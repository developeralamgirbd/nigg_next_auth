"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { set, useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import withAuth from "@/components/withAuth"

const formSchema = z.object({
  machines: z
    .string()
    .nonempty({ message: "Please enter at least one machine." }),
  additionalText: z.string().optional(),
  question: z.string().optional(),
  answer: z.string().optional(),
})

const InputPage = () => {

  const [successText, setSuccessText] = useState("")
  const [errorText, setErrorText] = useState("")
  const [loading, setLoading] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machines: "",
      additionalText: "",
      question: "",
      answer: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    setSuccessText("")
    setErrorText("")
    setLoading(true)

    // Do something with the form values.
    try {
      // Send data to backend
      const response = await fetch("/api/feedback/input", {
        method: "POST",
        body: JSON.stringify(values),
      })
      if (response.ok) {
        setSuccessText("Successfully added data to index.")
        form.reset()
      } else {
        setErrorText("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error(error)
      setErrorText("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-1 flex-col content-stretch items-stretch justify-stretch gap-2 p-2 text-neutral-50 sm:py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="machines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-foreground">Machines: </span>
                    <span className="font-normal text-muted-foreground self-start">
                      (Enter machines which this new information applies to as
                      comma separated values, etc. machine1, machine2)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-secondary-foreground"
                      placeholder="Machines..."
                    />
                  </FormControl>
                  <FormMessage className="text-md text-red-700" />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4 flex flex-col gap-4 rounded-lg border p-4">
            <p className="text-2xl text-secondary-foreground">
              Additional information
            </p>
            <p className="text-sm text-muted-foreground">
              Add additional text you want to add to the index. This information
              is used for the model to learn from. Add enough information so
              that the AI is able to find this document later on again.
              It&apos;s best practive to rather add too much text as too little.
            </p>
            <FormField
              control={form.control}
              name="additionalText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Additional Text:</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[250px] text-secondary-foreground"
                      placeholder="Enter additional text to add to the model..."
                    />
                  </FormControl>
                  <FormMessage className="text-2xl text-red-700" />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4 flex flex-col gap-4 rounded-lg border p-4">
            <p className="text-2xl text-secondary-foreground">
              Question Answer Pairs
            </p>
            <p className="text-sm text-muted-foreground">
              Add questions and corresponding answers. These are used later on
              for retrieval training.
            </p>
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Question:
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-secondary-foreground"
                      placeholder="Question..."
                    />
                  </FormControl>
                  <FormMessage className="text-2xl text-red-700" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Answer:
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="text-secondary-foreground"
                      placeholder="Answer..."
                    />
                  </FormControl>
                  <FormMessage className="text-2xl text-red-700" />
                </FormItem>
              )}
            />
          </div>
          {errorText && (<p className="mt-2 text-red-400">{errorText}</p>)}
          {successText && (<p className="mt-2 text-blue-400">{successText}</p>)}
          <Button className="mt-4 w-full" type="submit" disabled={loading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default withAuth(InputPage)
