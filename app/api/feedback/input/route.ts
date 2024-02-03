import { NextApiResponse } from "next"
import prisma from "../../../../lib/db"
import { setup_pinecone } from "../../../../lib/llm"
import { Document } from "langchain/document";

export async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json()

  const machines = body.machines.trim().replace(/[ ]+,/g, ",").replace(/,[ ]+/g, ",").split(',');
  const question = body.question
  const answer = body.answer
  const additionalText = body.additionalText

  // use prisma to log the body
  const input = await prisma.input.create({
    data: {
      question: question,
      answer: answer,
      general: additionalText,
      machines: machines,
    },
  })

  if (!input) {
    console.log("Could not upsert input")
    return new Response(JSON.stringify({ message: "ERROR" }), { status: 400 })
  }

  const vectorStore = await setup_pinecone("mvp")

  const docs = []

  if (additionalText) {
    const document = new Document({
      metadata: {
        chapter_title: "## Manual Text Entry",
        doctype: "user manual",
        machines: machines,
        source: "Manually added information",
        page_number: 0,
      },
      pageContent: additionalText,
    })
    docs.push(document)
  }

  if (question && answer) {
    const document = new Document({
      metadata: {
        chapter_title: "## Manually added question and Answer",
        doctype: "user manual",
        machines: machines,
        source: "Manually added question and Answer",
        page_number: 0,
      },
      pageContent: "### Question: " + question + "\n\n" + "### Answer: " + answer,
    })
    docs.push(document)
  }

  try{
  await vectorStore.addDocuments(docs)
  }
  catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: "ERROR" }), { status: 500 })
  }
  return new Response(JSON.stringify({ message: "OK" }), { status: 200 })
}
