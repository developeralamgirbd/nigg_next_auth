"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "ai/react"
import * as z from "zod"
import { useEffect, useRef, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading"
import { Icons } from "@/components/icons"
import { v4 } from "uuid"
import { Combobox } from "@/components/combobox"
import { Message } from "@/components/message"
import { WelcomeMessage } from "@/components/welcome-message"

export default function Home() {
  const [successText, setSuccessText] = useState<string>("")
  const [errorText, setErrorText] = useState<string>("")
  const [conversationId, setConversationId] = useState(v4())
  const [sourceValue, setSourceValue] = useState("machine")
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ body: { id: conversationId, source: sourceValue } })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault() // Prevent new line in textarea
        buttonRef.current?.click()
      }
    }

    textareaRef.current?.addEventListener("keydown", handleKeyDown)

    return () => {
      textareaRef.current?.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleVote = async (index: number, vote: "up" | "down") => {
    setSuccessText("")
    setErrorText("")
    setFeedbackLoading(true)

    console.log(JSON.stringify([...messages.slice(index - 1, index + 1)]))
    // Do something with the form values.
    try {
      // Send data to backend
      const response = await fetch("/api/feedback/vote", {
        method: "POST",
        body: JSON.stringify({
          vote: vote,
          question: messages[index - 1].content,
          answer: messages[index].content,
          chat_id: conversationId,
          message_id: messages[index].id,
        }),
      })
      if (response.ok) {
        setSuccessText("Successfully voted message.")
      } else {
        setErrorText("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error(error)
      setErrorText("Something went wrong. Please try again.")
    } finally {
      setFeedbackLoading(false)
    }
  }


  const frameworks = [
    {
      value: "avis software",
      label: "Avis Software",
    },
    {
      value: "machine",
      label: "Machine",
    },
  ]

  const handleSourceChange = (value: string) => {
    setSourceValue(value);
  }

  return (
    <div className="mx-auto w-full p-2 px-6 text-neutral-50 sm:max-w-[800px] sm:py-6 md:px-0">
      <div className="mb-20 flex w-full flex-1 flex-col">
        <div className="mb-6 hidden w-full flex-col items-center justify-start gap-4 sm:flex-row sm:gap-6">
          <p className="text-sm text-muted-foreground">
            Select for which asset you want to ask questions for:
          </p>
          <Combobox
            comboItems={frameworks}
            emptyText={"Document source..."}
            handleSourceChange={(e) => handleSourceChange(e)}
          />
        </div>
        {messages.length >> 0 ? (
          <>
            <Button
              onClick={() => {
                setConversationId(v4()), window.location.reload()
              }}
            >
              Ask new question
            </Button>
            <div className="mb-20 mt-5 flex max-h-[calc(100vh-350px)] w-full flex-col self-start overflow-hidden overflow-y-auto border-b">
              {messages.map((m, index) => {
                return (
                  <div
                    key={m.id}
                    className="flex flex-col items-center gap-4 border-t py-4 text-sm text-secondary-foreground sm:flex-row sm:gap-0"
                  >
                    <Message role={m.role}>{m.content}</Message>
                    {m.role !== "user" && (
                      <div className="w-332 ml-2 flex items-center gap-2 whitespace-pre-wrap">
                        <Button
                          size="sm"
                          onClick={() => handleVote(index, "up")}
                          disabled={feedbackLoading}
                        >
                          <Icons.thumbsUp className="h-5 w-5" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleVote(index, "down")}
                          disabled={feedbackLoading}
                        >
                          <Icons.thumbsDown className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        ) : <WelcomeMessage />}
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <LoadingSpinner.spinner className="-mt-36 h-8 w-8 animate-spin text-secondary-foreground" />
        </div>
      )}

      <div className="fixed bottom-0 w-full max-w-[800px] pr-4">
        <div className="flex flex-1 flex-col justify-end">
          {successText && (
            <div className="self-end text-left text-xs text-blue-500">
              {successText}
            </div>
          )}
          {errorText && (
            <div className="self-end text-left text-xs text-red-500">
              {errorText}
            </div>
          )}
          <label className="text-sm text-slate-500">
            Press CTRL+Enter to send
          </label>
          <form
            className="bottom-0 flex h-36 w-full sm:bottom-4"
            onSubmit={(e) => {
              console.log("submitting")
              handleSubmit(e)
            }}
          >
            <div className="flex h-[120px] w-[calc(100%-2rem)] flex-col items-center md:h-[70px] md:w-full md:flex-row md:space-x-2">
              <Textarea
                className="min-h-[40px] resize-none"
                ref={textareaRef}
                placeholder="Ask a question about your documentation..."
                value={input}
                onChange={handleInputChange}
              />

              <Button
                ref={buttonRef}
                type="submit"
                className="mt-2 h-10 w-full md:mt-0 md:h-14 md:w-24"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
