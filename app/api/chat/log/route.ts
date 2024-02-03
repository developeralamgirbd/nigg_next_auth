import { NextApiResponse } from "next"
import prisma from "../../../../lib/db"

export async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json()

  // use prisma to log the body
  const upsertedLog = await prisma.message_log.upsert({
    where: { chat_id: body.id },
    update: { messages: JSON.stringify(body.messages), docsource: body.source },
    create: {
      chat_id: body.id,
      messages: JSON.stringify(body.messages),
      docsource: body.source,
    },
  })

  if (!upsertedLog) {
    console.log("Could not update message log")
    return new Response(JSON.stringify({ message: "ERROR" }), { status: 400 })
  }

  return new Response(JSON.stringify({ message: "OK" }), { status: 200 })
}
