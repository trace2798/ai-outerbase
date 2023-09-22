import { Pinecone } from "@pinecone-database/pinecone";
import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { indexName } from "../../../config";
import { queryPineconeVectorStoreAndQueryLLM } from "../../../utils";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
      environment: process.env.PINECONE_ENVIRONMENT || "",
    });
    const embedandquerypinecone = await fetch(
      `https://daily-beige.cmd.outerbase.io/embedandquery`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await embedandquerypinecone.json();

    // const response = await queryPineconeVectorStoreAndQueryLLM(
    //   client,
    //   indexName,
    //   body
    // );
    if (data.matches.length) {
      // 7. Create an OpenAI instance and load the QAStuffChain
      const llm = new OpenAI({});
      const chain = loadQAStuffChain(llm);
      // 8. Extract and concatenate page content from matched documents
      const concatenatedPageContent = data.matches
        .map((match: any) => match.metadata.pageContent)
        .join(" ");
      // 9. Execute the chain with input documents and question
      const result = await chain.call({
        input_documents: [
          new Document({ pageContent: concatenatedPageContent }),
        ],
        question: body,
      });
      // 10. Log the answer
      console.log(`Answer: ${result.text}`);
      // return result.text;
      console.log(result.text, "TEXT TEXT");
      return new StreamingTextResponse(result.text);
    } else {
      console.log("Since there are no matches, GPT-3 will not be queried.");
    }
  } catch (error) {
    console.log("[READ_error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
