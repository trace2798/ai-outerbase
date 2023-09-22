import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { timeout } from "./config";

export const queryPineconeVectorStoreAndQueryLLM = async (
  client: any,
  indexName: any,
  question: any
) => {
  // 1. Start query process
  console.log(client, "CLIENT CLIENT");
  console.log("Querying Pinecone vector store...");
  // 2. Retrieve the Pinecone index
  const index = client.Index(indexName);
  // 3. Create query embedding
  // const queryEmbeddin = await new OpenAIEmbeddings().embedQuery(question);
  // console.log(queryEmbeddin, "Question EMBEDDIN");
  // const openaiembed = await fetch(
  //   `https://daily-beige.cmd.outerbase.io/embedopenai`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify(question),
  //   }
  // );
  // const queryEmbedding = await openaiembed.json();
  // console.log(queryEmbedding, "Question EMBEDDING");
  // 4. Query Pinecone index and return top 10 matches
  // let queryResponse = await index.query({
  //   queryRequest: {
  //     topK: 10,
  //     vector: queryEmbedding,
  //     // includeMetadata: true,
  //     includeValues: true,
  //   },
  // });
  // const response = await fetch(
  //   `https://daily-beige.cmd.outerbase.io/queryPinecone`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify(queryEmbedding),
  //   }
  // );
  // const data = await response.json();
  // console.log(data, "COMMAND Query DATA");
  const response = await fetch(
    `https://daily-beige.cmd.outerbase.io/embedandquery`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(question),
    }
  );
  const data = await response.json();
  console.log(data, "COMMAND Query DATA");

  // 5. Log the number of matches
  console.log(`Found ${data.matches.length} matches...`);
  // 6. Log the question being asked
  console.log(`Asking question: ${question}...`);
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
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
    });
    // 10. Log the answer
    console.log(`Answer: ${result.text}`);
    return result.text;
  } else {
    // 11. Log that there are no matches, so GPT-3 will not be queried
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }
};
export const createPineconeIndex = async (
  client: any,
  indexName: any,
  vectorDimension: any
) => {
  // 1. Initiate index existence check
  console.log(`Checking "${indexName}"...`);
  // 2. Get list of existing indexes
  const existingIndexes = await client.listIndexes();
  // 3. If index doesn't exist, create it
  if (!existingIndexes.includes(indexName)) {
    // 4. Log index creation initiation
    console.log(`Creating "${indexName}"...`);
    // 5. Create index
    await client.createIndex({
      createRequest: {
        name: indexName,
        dimension: vectorDimension,
        metric: "cosine",
      },
    });
    // 6. Log successful creation
    console.log(
      `Creating index.... please wait for it to finish initializing.`
    );
    // 7. Wait for index initialization
    await new Promise((resolve) => setTimeout(resolve, timeout));
  } else {
    // 8. Log if index already exists
    console.log(`"${indexName}" already exists.`);
  }
};

export const updatePinecone = async (
  client: any,
  indexName: any,
  docs: any
) => {
  console.log("Retrieving Pinecone index...");
  // 1. Retrieve Pinecone index
  const index = client.Index(indexName);
  // 2. Log the retrieved index name
  console.log(`Pinecone index retrieved: ${indexName}`);
  // 3. Process each document in the docs array
  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`);
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;
    // 4. Create RecursiveCharacterTextSplitter instance
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    console.log("Splitting text into chunks...");
    // 5. Split text into chunks (documents)
    const chunks = await textSplitter.createDocuments([text]);
    console.log(`Text split into ${chunks.length} chunks`);
    console.log(
      `Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`
    );
    // 6. Create OpenAI embeddings for documents
    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
    );
    console.log(embeddingsArrays, "EmbeddingArray");
    console.log("Finished embedding documents");
    console.log(
      `Creating ${chunks.length} vectors array with id, values, and metadata...`
    );
    // 7. Create and upsert vectors in batches of 100
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
      console.log(batch, "BATCH");
      // When batch is full or it's the last item, upsert the vectors
      if (batch.length === batchSize || idx === chunks.length - 1) {
        await index.upsert({
          upsertRequest: {
            vectors: batch,
          },
        });
        // Empty the batch
        batch = [];
      }
    }
    // 8. Log the number of vectors updated
    console.log(`Pinecone index updated with ${chunks.length} vectors`);
  }
};

// This node executes Javascript code on your current base
// To access your commands POST inputs, use "{{request.body.INPUT_NAME}}"
// To access your commands GET inputs, use "{{request.query.INPUT_NAME}}"
// To access the raw value of previous nodes in your command, use "{{node-1}}"
// To access JSON key values from previous nodes in your command, use "{{node-1.keyValue}}"
// async function userCode() {
//   const response = await fetch('https://outerbase-1f01f20.svc.us-west1-gcp-free.pinecone.io/query', {
//     method: "POST",
//     headers: {
//       'Api-Key': 'fca4f85d-29c2-4144-bf07-ef071d1ec1d8',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       "vector": [0.57,0.86,0.87,0.3,0.18,0.9,0.28,0.88,0.08,0.8,],
//       "topK": 3,
//       "includeValues": true
//     })
//   });
//   return response.json();
// }

// async function userCode() {
//   const inputvalue = [0.57,0.86,0.87,.....]
//  const response = await fetch('https://outerbase-1f01f20.svc.us-west1-gcp-free.pinecone.io/query', {
//    method: "POST",
//    headers: {
//      'Api-Key': 'fca4f85d-29c2-4144-bf07-ef071d1ec1d8',
//      'Content-Type': 'application/json'
//    },
//    body: JSON.stringify({
//      "vector": inputvalue,
//      "topK": 3,
//      "includeValues": true
//    })
//  });
//  return response.json();
// }

//working command to query pinecone index
// async function userCode() {

//   const inputValue = JSON.parse({{request.body}})

//   const response = await fetch('https://outerbase-1f01f20.svc.us-west1-gcp-free.pinecone.io/query', {
//       method: "POST",
//       headers: {
//       'Api-Key': 'fca4f85d-29c2-4144-bf07-ef071d1ec1d8',
//       'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//       "vector": inputValue,
//       "topK": 3,
//       "includeMetadata": true
//       })
//   });
//   return response.json();
// }
