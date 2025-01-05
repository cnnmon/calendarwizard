import { NextRequest, NextResponse } from "next/server";
import { PromptTemplate } from "@langchain/core/prompts";
import { streamText } from "ai";
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from "ai/rsc";

const MODEL = 'gpt-4o-mini-2024-07-18';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const stream = createStreamableValue('');
    (async () => {
      const { messages } = await req.json();
      const messagesString = JSON.stringify(messages);

      const systemMessage = "You are a helpful assistant that helps users plan their calendar and schedule. You have access to their calendar events and can help them make scheduling decisions.";

      const prompt = PromptTemplate.fromTemplate(
        `${systemMessage}\n\nPrevious messages:\n${messagesString}\n\nPlease respond to the latest message.`
      );

      const { textStream } = streamText({
        model: openai(MODEL),
        prompt: prompt.toString(),
      });

      for await (const chunk of textStream) {
        stream.append(chunk);
      }

      stream.done();
    })();

    return {
      text: stream.value,
    }
  } catch (error) {
    console.error(error);
    return new NextResponse('Error', { status: 500 });
  }
}
