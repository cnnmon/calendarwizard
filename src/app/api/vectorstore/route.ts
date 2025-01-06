import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from 'langchain/document';
import { formatEventsAsString } from '@/app/api/chat/utils';
import path from 'path';
import { EventsByDate } from "@/components/constants";

export const dynamic = 'force-dynamic';

const VECTOR_STORE_PATH = path.join(process.cwd(), 'vector_store');

async function createVectorStore(eventsByDate: EventsByDate) {
  // create individual documents for each event with just that event's content
  const docs = Object.values(eventsByDate).flat().map((event) => new Document({
    pageContent: formatEventsAsString({ [event.start.date ?? event.start.dateTime]: [event] }),
    metadata: { source: event.id }
  }));
  const vectorStore = await FaissStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002"
    })
  );
  await vectorStore.save(VECTOR_STORE_PATH);
}

export async function POST(req: Request) {
  try {
    const { eventsByDate }: { eventsByDate: EventsByDate } = await req.json();

    // create and save the vector store
    await createVectorStore(eventsByDate);

    return Response.json({ success: true });
  } catch (e: unknown) {
    console.error('Error in POST request:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return Response.json(
        { error: 'Query parameter required' },
        { status: 400 }
      );
    }

    // load the vector store
    const vectorStore = await FaissStore.load(
      VECTOR_STORE_PATH,
      new OpenAIEmbeddings({
        modelName: "text-embedding-ada-002"
      })
    );

    // if the vector store is not found, error
    if (!vectorStore) {
      return Response.json({ error: 'Vector store not found. You may need to reload your events.' }, { status: 404 });
    }

    const relevantDocs = await vectorStore.similaritySearch(query, 150);
    const relevantContext = relevantDocs
      .map(doc => `[${doc.metadata.source}]: ${doc.pageContent}`)
      .join('\n');

    return Response.json({ relevantContext });
  } catch (e: unknown) {
    console.error('Error in GET request:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
