import { PineconeClient } from "@pinecone-database/pinecone"

// pineconeClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

declare global {
  var pinecone: PineconeClient | undefined
}

const pinecone = global.pinecone || new PineconeClient()

if (process.env.NODE_ENV !== 'production') global.pinecone = pinecone

export default pinecone
