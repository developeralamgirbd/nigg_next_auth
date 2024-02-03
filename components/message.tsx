"use client"
import { useMarkdownProcessor } from "@/hooks/use-markdown"

type Props = {
  children: string
  role: string
}

export const Message = ({ children, role }: Props) => {
  const content = useMarkdownProcessor(children)

  return (
    <>
      <div className="ml-1 w-[60px] self-start font-bold sm:ml-0">
        {role === "user" ? "You" : "AI"}:
      </div>
      <div className="ml-2 w-full overflow-hidden whitespace-pre-wrap">
        {content}
      </div>
    </>
  )
}
