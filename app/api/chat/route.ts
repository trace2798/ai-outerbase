import { StreamingTextResponse } from "ai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { OpenAI } from "langchain/llms/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.messages[body.messages.length - 1].content;
   //Change this to your embed and query command link
    const embedandquerypinecone = await fetch(
      `https://daily-beige.cmd.outerbase.io/embedandquery`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(question),
      }
    );
    const data = await embedandquerypinecone.json();
    const content = data.matches[0].metadata.pageContent;
    //console.log(`Asking question: ${question}...`);
    if (data.matches.length) {
      const llm = new OpenAI({
        modelName: "gpt-3.5-turbo",
        streaming: true,
        temperature: 1.0,
        maxTokens: 500,
      });
      const chain = loadQAStuffChain(llm);
      const concatenatedPageContent = data.matches
        .map((match: any) => match.metadata.pageContent)
        .join(" ");
      const result = await chain.call({
        input_documents: [
          new Document({ pageContent: concatenatedPageContent }),
        ],
        question: question,
      });
      return new StreamingTextResponse(result.text);
    } else {
      //console.log("There are no matches.");
      return new NextResponse("No Matches", { status: 200 });
    }
  } catch (error) {
    //console.log("[READ_error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
