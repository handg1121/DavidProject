import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// 런타임에서만 환경 변수 확인
function getOpenAIKey() {
  // 빌드 시점이 아닌 런타임에서만 확인
  if (typeof window !== 'undefined') {
    return null; // 클라이언트 사이드에서는 접근 불가
  }
  
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('OPENAI_API_KEY 확인:', apiKey ? '설정됨' : '설정되지 않음');
  return apiKey;
}

// 요약 결과의 스키마 정의
const summarySchema = z.object({
  summary: z.string().describe("A concise summary of what this repository is about"),
  cool_facts: z.array(z.string()).min(3).max(5).describe("3-5 cool or unique facts about this repository"),
});

// 스키마 기반 파서 생성
const summaryParser = StructuredOutputParser.fromZodSchema(summarySchema);

// LLM 인스턴스 생성 함수
function createLLM() {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY 환경변수가 설정되지 않았습니다. 프로젝트 루트에 .env.local 파일을 생성하고 OPENAI_API_KEY=your_api_key_here를 추가해주세요.');
  }
  
  return new ChatOpenAI({
    temperature: 0.2,
    model: "gpt-3.5-turbo-16k",
    apiKey: apiKey,
  });
}

export async function summarizeReadmeWithLangChain(readmeContent) {
  try {
    console.log('=== LLM 요약 시작 ===');
    console.log('README 내용 길이:', readmeContent?.length || 0);
    
    // LLM 인스턴스 생성
    const llm = createLLM();
    console.log('LLM 인스턴스 생성 완료');
    
    // 프롬프트 템플릿 정의
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert open source analyst. 
Given the following GitHub repository README, create a comprehensive summary.

{format_instructions}

README Content:
{readme}
`
      ]
    ]);

    console.log('프롬프트 템플릿 생성 완료');

    // 체인 생성 - StructuredOutputParser 사용
    const chain = prompt.pipe(llm).pipe(summaryParser);
    console.log('체인 생성 완료');

    // 체인 실행
    console.log('체인 실행 시작...');
    const result = await chain.invoke({ 
      readme: readmeContent,
      format_instructions: summaryParser.getFormatInstructions()
    });
    
    console.log('LLM 요약 결과:', result);
    return result;
  } catch (error) {
    console.error('=== LLM 요약 실패 상세 정보 ===');
    console.error('에러 타입:', error.constructor.name);
    console.error('에러 메시지:', error.message);
    console.error('에러 스택:', error.stack);
    console.error('에러 객체:', JSON.stringify(error, null, 2));
    
    // API 키 관련 에러인지 확인
    if (error.message.includes('OPENAI_API_KEY')) {
      console.error('API 키 관련 에러 감지');
      return {
        summary: "OpenAI API 키가 설정되지 않았습니다.",
        cool_facts: [
          "프로젝트 루트에 .env.local 파일을 생성해주세요",
          "OPENAI_API_KEY=your_api_key_here를 추가해주세요",
          "https://platform.openai.com/api-keys에서 API 키를 발급받을 수 있습니다",
          "서버를 재시작한 후 다시 시도해주세요"
        ]
      };
    }
    
    // OpenAI API 관련 에러인지 확인
    if (error.message.includes('OpenAI') || error.message.includes('API') || error.message.includes('401') || error.message.includes('403')) {
      console.error('OpenAI API 에러 감지');
      return {
        summary: "OpenAI API 연결에 실패했습니다.",
        cool_facts: [
          "API 키가 올바른지 확인해주세요",
          "API 키에 충분한 크레딧이 있는지 확인해주세요",
          "OpenAI 서비스 상태를 확인해주세요",
          "잠시 후 다시 시도해주세요"
        ]
      };
    }
    
    // 네트워크 관련 에러인지 확인
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('timeout')) {
      console.error('네트워크 에러 감지');
      return {
        summary: "네트워크 연결에 실패했습니다.",
        cool_facts: [
          "인터넷 연결을 확인해주세요",
          "방화벽 설정을 확인해주세요",
          "프록시 설정을 확인해주세요",
          "잠시 후 다시 시도해주세요"
        ]
      };
    }
    
    // 기타 에러의 경우
    console.error('기타 에러 감지');
    return {
      summary: `요약을 생성하는 중 오류가 발생했습니다: ${error.message}`,
      cool_facts: [
        "LLM 서비스에 연결할 수 없습니다.", 
        "API 키를 확인해주세요.", 
        "네트워크 연결을 확인해주세요.",
        "잠시 후 다시 시도해주세요"
      ]
    };
  }
} 