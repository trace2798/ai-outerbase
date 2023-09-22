import { StreamingTextResponse } from "ai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { OpenAI } from "langchain/llms/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
    if (data.matches.length) {
      const llm = new OpenAI({});
      const chain = loadQAStuffChain(llm);
      const concatenatedPageContent = data.matches
        .map((match: any) => match.metadata.pageContent)
        .join(" ");
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
