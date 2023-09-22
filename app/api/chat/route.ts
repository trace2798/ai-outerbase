import { NextRequest, NextResponse } from "next/server";
import { PineconeClient } from "@pinecone-database/pinecone";
import { queryPineconeVectorStoreAndQueryLLM } from "../../../utils";
import { indexName } from "../../../config";
import { StreamingTextResponse } from 'ai';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = new PineconeClient();
  const clientdata = await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });

  const text = await queryPineconeVectorStoreAndQueryLLM(
    client,
    indexName,
    body
  );
  console.log(text, "TEXT TEXT");
  return new StreamingTextResponse(text)
  
}
