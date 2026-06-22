import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const indexName = process.env.PINECONE_INDEX_NAME;

export const upsertVectors = async (vectors) => {
  if (!vectors || vectors.length === 0) {
    console.log("No vectors to upsert to Pinecone.");
    return;
  }
  const index = pc.index(indexName);
  // Version 7.2.0 of Pinecone SDK requires wrapping records in an object
  await index.upsert({ records: vectors });
};

export const queryVectors = async (vector, topK = 5, filter = {}) => {
  const index = pc.index(indexName);
  const queryResponse = await index.query({
    vector,
    topK,
    filter,
    includeMetadata: true,
  });
  return queryResponse.matches;
};

export default pc;
