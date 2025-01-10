import { Message as VercelChatMessage } from 'ai';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { CalendarEvent, ChatApiProps } from '@/components/constants';
import { ChatOpenAI } from '@langchain/openai';

export const dynamic = 'force-dynamic';
const MODEL = 'gpt-4o-mini-2024-07-18';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const DATE_ANALYSIS_TEMPLATE = `You are a date range analyzer. Analyze if the following query contains any date/time references. If it does, respond with the start and end dates in YYYY-MM-DD format. If not, respond with "NO_DATE_RANGE".
Examples:
Query: "What meetings do I have next week?"
Response: {{"start": "2024-01-22", "end": "2024-01-28"}}
Query: "Show me my events from last Tuesday to Friday"
Response: {{"start": "2024-01-16", "end": "2024-01-19"}}
Query: "Who am I meeting with tomorrow?"
Response: {{"start": "2024-01-16", "end": "2024-01-16"}}
Query: "What's the weather like?"
Response: "NO_DATE_RANGE"

Current datetime: {currentDateTime}
Query: {query}
Response:`;

const CHAT_TEMPLATE = `You're a helpful calendar wizard cat assistant. Try to answer concisely (<300 words) unless the user asks for more detail. Cite relevant calendar events as much as possible. Make recommendations and inferences if relevant. If the user asks for events lately / upcoming, make note of the correct year.
==============================
Current datetime: {currentDateTime}
==============================
Notepad: {notepad}
==============================
Relevant calendar events: {context}
==============================
History: {chat_history}
==============================

user: {question}
assistant:`;

export async function POST(req: Request) {
  try {
    const { messages, eventsByDate, notepad, isExample }: ChatApiProps = await req.json();
    const lastMessage = messages[messages.length - 1];
    const previousMessages = messages.slice(-2, -1).map(formatMessage);

    // analyze the query for date ranges
    const dateAnalysisPrompt = PromptTemplate.fromTemplate(DATE_ANALYSIS_TEMPLATE);

    const model = new ChatOpenAI({
      modelName: MODEL,
      temperature: 0
    });
    
    const dateAnalysisChain = dateAnalysisPrompt.pipe(model);
    const dateAnalysisResult = await dateAnalysisChain.invoke({ query: lastMessage.content, currentDateTime: new Date().toLocaleString() });

    let dateResponse: { start: string; end: string } | "NO_DATE_RANGE" = "NO_DATE_RANGE";
    try {
      dateResponse = JSON.parse(dateAnalysisResult.content.toString());
    } catch {
      dateResponse = "NO_DATE_RANGE";
    }

    let relevantContext = '';
    if (dateResponse !== "NO_DATE_RANGE") {
      const { start, end } = dateResponse;
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      // loop through dates between start and end
      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toISOString().split('T')[0];
        const events = eventsByDate[formattedDate] || [];
        relevantContext += `Events on ${formattedDate}: ${events.map((event: CalendarEvent) => event.summary).join(', ')}\n`;
      }
    } 

    // also semantic search for context
    const response = await fetch(
      `${req.url.split('/api/')[0]}/api/vectorstore?query=${encodeURIComponent(lastMessage.content)}&isExample=${isExample}`
    );
    const semanticData = await response.json();

    if (semanticData.error) {
      console.error('Vectorstore error:', semanticData.error);
    }

    relevantContext += "\n" + (semanticData.relevantContext);

    // format the chat assistant prompt
    const chatPrompt = PromptTemplate.fromTemplate(CHAT_TEMPLATE);
    const formattedPrompt = await chatPrompt.format({
      chat_history: previousMessages.join('\n'),
      question: lastMessage.content,
      currentDateTime: new Date().toLocaleString(),
      notepad: notepad,
      context: relevantContext,
    });

    // stream the response
    const { textStream } = streamText({
      model: openai('gpt-4o-mini-2024-07-18'),
      prompt: formattedPrompt,
    });

    return new Response(textStream);
  } catch (e: unknown) {
    const error = e as Error;
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
