import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import { formatEventsAsString } from "@/app/api/chat/utils";
import { EventsByDate } from "@/components/constants";
import path from "path";

export const dynamic = "force-dynamic";
const VECTOR_STORE_PATH = path.join(process.cwd(), "src", "lib", "vector_store");
const EXAMPLE_VECTOR_STORE_PATH = path.join(process.cwd(), "src", "lib", "example", "vector_store");

export async function POST(req: Request) {
  try {
    const { eventsByDate }: { eventsByDate: EventsByDate } = await req.json();
    // create vector store in memory first
    const docs = Object.values(eventsByDate)
      .flat()
      .map(
        (event) =>
          new Document({
            pageContent: formatEventsAsString({
              [event.start.date ?? event.start.dateTime]: [event],
            }),
            metadata: { source: event.id },
          })
      );
    
    // use /tmp directory for Vercel serverless functions
    const vectorStore = await FaissStore.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        modelName: "text-embedding-ada-002", 
      })
    );
    
    // save to /tmp instead of process.cwd()
    await vectorStore.save(VECTOR_STORE_PATH);
    return Response.json({ success: true });
  } catch (e: unknown) {
    console.error("Error in POST request:", e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const query = searchParams.get("query");
    const isExample = searchParams.get("isExample") === "true";

    if (!query) {
      return Response.json(
        { error: "Query parameter required" },
        { status: 400 }
      );
    }

    let vectorStore: FaissStore | null = null;
    console.log("vectorStore", vectorStore);
    if (isExample) {
      // load the vector store from absolute path to example vector store
      vectorStore = await FaissStore.load(
        EXAMPLE_VECTOR_STORE_PATH,
        new OpenAIEmbeddings({
          modelName: "text-embedding-ada-002",
        })
      );
    } else {
      // load the vector store
      vectorStore = await FaissStore.load(
        VECTOR_STORE_PATH,
        new OpenAIEmbeddings({
          modelName: "text-embedding-ada-002",
        })
      );
    }

    // if the vector store is not found, error
    if (!vectorStore) {
      return Response.json(
        {
          error: "Vector store not found. You may need to reload your events.",
        },
        { status: 404 }
      );
    }

    const relevantDocs = await vectorStore.similaritySearch(query, 50);
    const relevantContext = relevantDocs
      .map((doc) => `[${doc.metadata.source}]: ${doc.pageContent}`)
      .join("\n");


    return Response.json({ relevantContext });
  } catch (e: unknown) {
    console.error("Error in GET request:", e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
