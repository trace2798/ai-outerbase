import { Pinecone } from "@pinecone-database/pinecone";
import { StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";
import { indexName } from "../../../config";
import { queryPineconeVectorStoreAndQueryLLM } from "../../../utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });

  const response = await queryPineconeVectorStoreAndQueryLLM(
    client,
    indexName,
    body
  );
  console.log(response, "TEXT TEXT");
  return new StreamingTextResponse(response);
}
