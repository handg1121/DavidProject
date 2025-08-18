import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

function getOpenAIKey() {
  if (typeof window !== 'undefined') return null;
  const apiKey = process.env.OPENAI_API_KEY;
  return apiKey || null;
}

const summarySchema = z.object({
  summary: z.string().describe("A concise summary of what this repository is about"),
  cool_facts: z.array(z.string()).min(3).max(5).describe("3-5 cool or unique facts about this repository"),
});

function createLLM() {
  const apiKey = getOpenAIKey();
  if (!apiKey) throw new Error('OPENAI_API_KEY 환경변수가 설정되지 않았습니다.');
  return new ChatOpenAI({
    temperature: 0.2,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    apiKey,
  });
}

export async function summarizeReadmeWithLangChain(readmeContent: string) {
  try {
    const llm = createLLM();
    const structured = llm.withStructuredOutput(summarySchema);

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert open source analyst. Return a JSON object matching the schema with no markdown fences.`
      ],
      [
        "human",
        `README Content:\n{readme}`
      ]
    ]);

    const chain = prompt.pipe(structured);
    const result = await chain.invoke({ readme: readmeContent });
    return result as { summary: string; cool_facts: string[] };
  } catch (error: any) {
    return {
      summary: `요약을 생성하는 중 오류가 발생했습니다: ${error?.message || 'Unknown error'}`,
      cool_facts: [
        "LLM 서비스에 연결할 수 없습니다.",
        "API 키를 확인해주세요.",
        "네트워크 연결을 확인해주세요.",
        "잠시 후 다시 시도해주세요"
      ]
    };
  }
} 