import { Message as VercelChatMessage } from 'ai';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { CalendarEvent } from '@/components/Setup/utils';
import { formatEventsAsString } from './utils';

export const dynamic = 'force-dynamic';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You're a helpful calendar wizard cat assistant. Use the context to answer questions concisely (<100 words ideally). If info isn't in context, help as possible or explain it's unrelated. Ask if user wants more details, and if so, provide more context.
==============================
Time: {currentDateTime}
Zone: {currentTimeZone}
==============================
Context: {context}
==============================
History: {chat_history}

user: {question}
assistant:`;

export async function POST(req: Request) {
  try {
    const { messages, eventsByDate }: { messages: VercelChatMessage[]; eventsByDate: {[key: string]: CalendarEvent[]} } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const formattedPrompt = await prompt.format({
      chat_history: formattedPreviousMessages.join('\n'),
      question: currentMessageContent,
      currentDateTime: new Date().toISOString(),
      currentTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      context: formatEventsAsString(eventsByDate)
    });

    const { textStream } = streamText({
      model: openai('gpt-4o-mini-2024-07-18'),
      prompt: formattedPrompt
    });


    return new Response(textStream);
  } catch (e: unknown) {
    const error = e as Error;
    return Response.json(
      { error: error.message },
      { status: error instanceof Error ? 500 : 400 }
    );
  }
}
