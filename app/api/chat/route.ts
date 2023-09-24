import { StreamingTextResponse } from "ai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { OpenAI } from "langchain/llms/openai";
import { NextRequest, NextResponse } from "next/server";
import { PromptTemplate } from "langchain/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body, "BODY BODY");
    const question = body.messages[body.messages.length - 1].content;

    console.log(question, "QUESTION QUESTION");
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
    console.log(data, "DATA USING COMMAND");
    const content = data.matches[0].metadata.pageContent;
    // 5. Log the number of matches
    console.log(`Found ${data.matches.length} matches...`);
    // 6. Log the question being asked
    console.log(`Asking question: ${question}...`);
    if (data.matches.length) {
      const llm = new OpenAI({
        modelName: "gpt-3.5-turbo",
        streaming: true,
        temperature: 1.0,
      });
      //       const promptTemplate = `Use the following pieces of data to answer the question at the end. Try to be brief and to the point if possible.
      // ${content}
      // Question: ${question}
      // `;
      //       const prompt = PromptTemplate.fromTemplate(promptTemplate);
      const chain = loadQAStuffChain(llm);
      console.log(chain, "CHAIN");
      const concatenatedPageContent = data.matches
        .map((match: any) => match.metadata.pageContent)
        .join(" ");
        console.log(concatenatedPageContent, "CONCATENATED PAGE CONTENT");
      const result = await chain.call({
        input_documents: [
          new Document({ pageContent: concatenatedPageContent }),
        ],
        question: question,
      });
      // 10. Log the answer
      console.log(`Answer: ${result.text}`);
      // return result.text;
      console.log(result.text, "TEXT TEXT");
      return new StreamingTextResponse(result.text);
    } else {
      console.log("There are no matches.");
      return new NextResponse("No Matches", { status: 200 });
    }
  } catch (error) {
    console.log("[READ_error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
