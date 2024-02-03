import { X } from "lucide-react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { ReactNode } from "react"

interface Props {
  open: boolean
  setOpen(open: boolean): void
  title: string
  description?: ReactNode
  children: ReactNode
  size?: "xl" | "3xl"
}

export const Dialog = ({
  open,
  setOpen,
  title,
  description,
  children,
  size = "xl",
}: Props) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-900/90 py-8">
          <DialogPrimitive.Content
            className={`relative w-[90vw] rounded-lg bg-white p-8 shadow-2xl ${
              size === "3xl" ? "max-w-3xl" : "max-w-xl"
            }`}
          >
            <DialogPrimitive.Title className="mb-4 font-sans text-lg font-semibold">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="mb-8 font-sans text-sm">
                {description}
              </DialogPrimitive.Description>
            ) : null}
            {children}
            <DialogPrimitive.Close asChild>
              <button
                className="absolute right-6 top-6 rounded-full p-2 transition-colors hover:bg-emerald-50"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-slate-700" />
              </button>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
