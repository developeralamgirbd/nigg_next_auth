import { NextApiResponse } from "next"
import prisma from "../../../../lib/db"

export async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json()

  // use prisma to log the body
  const feedback = await prisma.feedback.upsert({
    where: { id: body.message_id },
    update: {
      chat_id: body.chat_id,
      vote: body.vote,
      question: body.question,
      answer: body.answer,
    },
    create: {
      id: body.message_id,
      chat_id: body.chat_id,
      vote: body.vote,
      question: body.question,
      answer: body.answer,
    },
  })

  if (!feedback) {
    console.log("Could not upsert feedback")
    return new Response(JSON.stringify({ message: "ERROR" }), { status: 400 })
  }

  return new Response(JSON.stringify({ message: "OK" }), { status: 200 })
}
