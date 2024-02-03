import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { PineconeStore } from "langchain/vectorstores/pinecone"
import pinecone from "../lib/pinecone"

export async function setup_pinecone(namespace: string = "mvp") {
  if (
    process.env.OPENAI_API_KEY === undefined
  ) {
    throw new Error(
      "OPENAI_API_KEY is not set"
    )
  }

  if (
    process.env.PINECONE_API_KEY === undefined ||
    process.env.PINECONE_ENVIRONMENT === undefined
  ) {
    throw new Error(
      "PINECONE_API_KEY is not set or PINECONE_ENVIRONMENT is not set"
    )
  }

  if (process.env.PINECONE_INDEX_NAME === undefined) {
    throw new Error("PINECONE_INDEX_NAME is not set")
  }

  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  })

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME)
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    { pineconeIndex, namespace: namespace }
  )

  return vectorStore
}
