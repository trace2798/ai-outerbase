import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextResponse } from "next/server";

export async function POST() {
  const loader = new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
  });

  const docs = await loader.load();
  try {
    for (const doc of docs) {
      const txtPath = doc.metadata.source;
      const text = doc.pageContent;

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });
      //Split text into chunks (documents)
      const chunks = await textSplitter.createDocuments([text]);

      const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
        chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
      );
      const batchSize = 100;
      let batch: any = [];
      for (let idx = 0; idx < chunks.length; idx++) {
        const chunk = chunks[idx];
        const vector = {
          id: `${txtPath}_${idx}`,
          values: embeddingsArrays[idx],
          metadata: {
            ...chunk.metadata,
            loc: JSON.stringify(chunk.metadata.loc),
            pageContent: chunk.pageContent,
            txtPath: txtPath,
          },
        };
        batch = [...batch, vector];
        if (batch.length === batchSize || idx === chunks.length - 1) {
       //change this to your COMMAND_TO_UPSERT_TO_PINECONE
          await fetch(`https://daily-beige.cmd.outerbase.io/upsertPinecone`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(batch),
          });
          console.log("Upserting Vector using Outerbase Command");
          // Empty the batch
          batch = [];
        }
      }
      // Log the number of vectors updated just for verification purpose
      console.log(`Pinecone index updated with ${chunks.length} vectors`);
    }
  } catch (err) {
    console.log("error: ", err);
  }

  return NextResponse.json({
    data: "successfully created index and loaded data into pinecone...",
  });
}
