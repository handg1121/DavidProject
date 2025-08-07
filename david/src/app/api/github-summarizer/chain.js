import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// 환경변수 강제 로딩
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../../../../.env.local');

dotenv.config({ path: envPath });

// 요약 결과의 스키마 정의
const summarySchema = z.object({
  summary: z.string().describe("A concise summary of what this repository is about"),
  cool_facts: z.array(z.string()).min(3).max(5).describe("3-5 cool or unique facts about this repository"),
});

// 스키마 기반 파서 생성
const summaryParser = StructuredOutputParser.fromZodSchema(summarySchema);

// LLM 인스턴스 생성
const llm = new ChatOpenAI({
  temperature: 0.2,
  model: "gpt-3.5-turbo-16k",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeReadmeWithLangChain(readmeContent) {
  // API 키가 없으면 에러 발생
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }
  
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

  // 체인 생성 - StructuredOutputParser 사용
  const chain = prompt.pipe(llm).pipe(summaryParser);

  try {
  // 체인 실행
    const result = await chain.invoke({ 
      readme: readmeContent,
      format_instructions: summaryParser.getFormatInstructions()
    });
    
    console.log('LLM 요약 결과:', result);
    return result;
  } catch (error) {
    console.error('LLM 요약 실패:', error);
    // 에러 발생 시 기본 응답 반환
    return {
      summary: "요약을 생성하는 중 오류가 발생했습니다.",
      cool_facts: ["LLM 서비스에 연결할 수 없습니다.", "API 키를 확인해주세요.", "네트워크 연결을 확인해주세요."]
    };
  }
} 