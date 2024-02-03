import { Configuration, OpenAIApi } from "openai-edge"
import { StreamingTextResponse, OpenAIStream, Message } from "ai"
import { setup_pinecone } from "../../../lib/llm"
import {
  default_qa_prompt,
  default_system_prompt,
  classification_prompt,
  conversational_prompt,
} from "../../../lib/prompts"

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export const runtime = "edge"

export async function POST(req: Request) {
  const body = await req.json()

  const messages = body.messages
  let query = messages[messages.length - 1].content

  const run_final_prompt_function = [
    {
      name: "run_final_prompt",
      description: "Execute the qa prompt, based on the classification",
      parameters: {
        type: "object",
        properties: {
          classification: {
            type: "string",
            description: "Classification of question",
            enum: [
              "Technische Details",
              "Allgemeine Benützung",
              "Wartung",
              "Inhaltsverzeichnis",
            ],
          },
          sourceCategory: {
            type: "string",
            description:
              "Which type of document would you choose for answering the question?",
            enum: ["General", "Tickets"],
          },
        },
        required: ["classification", "sourceCategory"],
      },
    },
  ]

  let summaryResponse = undefined
  if(messages.length >= 2){
    const content = conversational_prompt
    .replace(
      "{history}",
      messages
        .slice(0, messages.length - 1)
        .map((message: Message) => `${message.role}: ${message.content}`)
        .join("\n")
    ).replace("{query}", query)

    console.log(content)
    summaryResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.0,
      stream: false,
      messages: [
        {
          role: "user",
          content: content,
        }
      ],
    })

    const summaryJson = await summaryResponse.json()
    query = summaryJson.choices[0].message.content

    console.log(query)
  }

  const classificationResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    temperature: 0.0,
    stream: false,
    messages: [
      {
        role: "system",
        content: classification_prompt,
      },
      {
        role: "user",
        content: query,
      },
    ],
    functions: run_final_prompt_function,
    function_call: { name: "run_final_prompt" },
  })

  const responseJson = await classificationResponse.json()

  const classification = JSON.parse(
    responseJson.choices[0].message.function_call.arguments
  ).classification

  const sourceCategory = JSON.parse(
    responseJson.choices[0].message.function_call.arguments
  ).sourceCategory

  console.log(sourceCategory)

  let model = "gpt-3.5-turbo-16k"
  let number_docs = 6

  if (classification === "Technische Details" || classification === "Wartung") {
    model = "gpt-4"
    number_docs = 6
    console.log("Wartung...")
  }

  const vectorStore = await setup_pinecone("mvp")

  let filter: Record<string, any> | undefined
  // if (body.source === "avis software") {
  //   filter = { doctype: {"$eq": "software user manual"} }
  // } else if (body.source === "machine") {
  //   filter = { doctype: {"$ne": "software user manual"} }
  // } else {
  //   filter = undefined
  // }

  // TODO: Disable software user manual for now
  filter = { doctype: { $ne: "software user manual" } }

  const docs = await vectorStore.similaritySearch(query, number_docs, filter)

  let i = 0
  let response = undefined
  while (i <= 2) {
    // Remove the preamble from the documents
    const prompt_context = docs.map((doc) => {
      const page = doc.metadata.source !== "JIRA tickets" ? `Seite ${
        doc.metadata.page_number + 1
      }` : `Ticket ${doc.metadata.ticket_number}`
      return `Dokument ${doc.metadata.source} ${page}: \n ${doc.pageContent.replace(/[\s\S]*>>>><<<</, "")} \n----\n`
    })

    const system_prompt = default_system_prompt + prompt_context
    const prompt = query
    // const prompt = default_system_prompt.replace("{query}", condensed_question) + prompt_context + "Answer in the same language as the question was asked in: "
    response = await openai.createChatCompletion({
      model: model,
      stream: true,
      temperature: 0.0,
      messages: [
        {
          role: "system",
          content: system_prompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })
    if (response.status === 429) {
      console.log(await response.json())
      docs.pop()
      i = i + 1
      continue
    }
    break
  }

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response as Response, {
    onCompletion: async (completion: string) => {
      // Send logging data to backend
      try {
        // Send data to backend
        let domain = process.env.VERCEL_URL?.replace(/\/$/, "")
        if (!domain?.startsWith("http")) {
          domain = "https://" + domain
        }
        body.messages.push({ role: "assistant", content: completion })
        const response = await fetch(domain + "/api/chat/log", {
          method: "POST",
          body: JSON.stringify(body),
        })
        if (!response.ok) {
          console.log("Could not update message log")
        }
      } catch (error) {
        console.error(error)
      }
    },
  })

  // This would be with LangChain
  // const { stream, handlers } = LangChainStream()

  // if(true){
  //   const chain = loadQAChain(model, { type: "stuff" })

  //   chain
  //     .call(
  //       {
  //         input_documents: docs,
  //         question: messages[messages.length - 1].content,
  //       },
  //       [handlers]
  //     )
  //     .catch(console.error)
  // }

  return new StreamingTextResponse(stream)
}
