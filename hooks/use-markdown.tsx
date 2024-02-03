import { Dialog } from "@/components/dialog"
import { Loader2, Calculator, CheckCheck, Copy, Workflow } from "lucide-react"
import type { Root } from "hast"
import "highlight.js/styles/base16/google-dark.css"
import mermaid from "mermaid"
import Link from "next/link"
import {
  Children,
  Fragment,
  createElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import flattenChildren from "react-keyed-flatten-children"
import rehypeHighlight from "rehype-highlight"
import rehypeReact from "rehype-react"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { Plugin, unified } from "unified"
import { visit } from "unist-util-visit"
import { cn } from "@/lib/utils"
// import { HtmlGenerator, parse } from "latex.js"
// import "node_modules/latex.js/dist/css/base.css"
// // @ts-expect-error
// import "node_modules/latex.js/dist/css/katex.css"
export const ANCHOR_CLASS_NAME =
  "font-semibold underline text-emerald-700 underline-offset-[2px] decoration-1 hover:text-emerald-800 transition-colors"

// Mixing arbitrary Markdown + Capsize leads to lots of challenges
// with paragraphs and list items. This replaces paragraphs inside
// list items into divs to avoid nesting Capsize.
const rehypeListItemParagraphToDiv: Plugin<[], Root> = () => {
  return (tree: any) => {
    visit(tree, "element", (element) => {
      if (element.tagName === "li") {
        element.children = element.children.map((child: any) => {
          if (child.type === "element" && child.tagName === "p") {
            child.tagName = "div"
          }
          return child
        })
      }
    })
    return tree
  }
}

export const useMarkdownProcessor = (content: string) => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: "forest" })
  }, [])

  return useMemo(() => {
    return unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeHighlight, { ignoreMissing: true })
      .use(rehypeListItemParagraphToDiv)
      .use(rehypeReact, {
        createElement,
        Fragment,
        components: {
          a: ({ href, children }: JSX.IntrinsicElements["a"]) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={ANCHOR_CLASS_NAME}
            >
              {children}
            </a>
          ),
          h1: ({ children, id }: JSX.IntrinsicElements["h1"]) => (
            <h1
              className="mb-6 mt-6 font-sans text-2xl font-semibold text-emerald-950"
              id={id}
            >
              {children}
            </h1>
          ),
          h2: ({ children, id }: JSX.IntrinsicElements["h2"]) => (
            <h2
              className="mb-6 mt-6 font-sans text-2xl font-medium text-emerald-950"
              id={id}
            >
              {children}
            </h2>
          ),
          h3: ({ children, id }: JSX.IntrinsicElements["h3"]) => (
            <h3
              className="mb-6 mt-2 font-sans text-xl font-semibold text-emerald-950"
              id={id}
            >
              {children}
            </h3>
          ),
          h4: ({ children, id }: JSX.IntrinsicElements["h4"]) => (
            <h4
              className="my-6 font-sans text-xl font-medium text-emerald-950"
              id={id}
            >
              {children}
            </h4>
          ),
          h5: ({ children, id }: JSX.IntrinsicElements["h5"]) => (
            <h5
              className="my-6 font-sans text-lg font-semibold text-emerald-950"
              id={id}
            >
              {children}
            </h5>
          ),
          h6: ({ children, id }: JSX.IntrinsicElements["h6"]) => (
            <h6
              className="my-6 font-sans text-lg font-medium text-emerald-950"
              id={id}
            >
              {children}
            </h6>
          ),
          p: (props: JSX.IntrinsicElements["p"]) => {
            return (
              <p className="mb-0 font-sans text-sm text-emerald-900">
                {props.children}
              </p>
            )
          },
          strong: ({ children }: JSX.IntrinsicElements["strong"]) => (
            <strong className="font-semibold text-emerald-950">
              {children}
            </strong>
          ),
          em: ({ children }: JSX.IntrinsicElements["em"]) => (
            <em>{children}</em>
          ),
          code: CodeBlock,
          pre: ({ children }: JSX.IntrinsicElements["pre"]) => {
            return (
              <div className="relative mb-0">
                <pre
                  className={cn(
                    "flex items-start justify-center overflow-x-auto rounded-lg border-2",
                    "border-emerald-200 bg-emerald-100 px-0 py-4 text-sm sm:px-4",
                    "[&>code.hljs]:bg-transparent [&>code.hljs]:p-0"
                  )}
                >
                  {children}
                </pre>
              </div>
            )
          },
          ul: ({ children }: JSX.IntrinsicElements["ul"]) => (
            <ul className="my-6 flex flex-col gap-2 pl-3 text-emerald-900 [&_ol]:my-3 [&_ul]:my-3">
              {Children.map(
                flattenChildren(children).filter(isValidElement),
                (child, index) => (
                  <>
                    <li key={index} className="flex items-start gap-4">
                      <div className="bg-red-700">-</div>
                      {child}
                    </li>
                  </>
                )
              )}
            </ul>
          ),
          ol: ({ children }: JSX.IntrinsicElements["ol"]) => (
            <ol className="my-6 flex flex-col gap-3 space-y-2 pl-3 text-emerald-900 [&_ol]:my-3 [&_ul]:my-3">
              {Children.map(
                flattenChildren(children).filter(isValidElement),
                (child, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div
                      className="min-w-[1.4ch] shrink-0 font-sans text-sm font-semibold text-emerald-900"
                      aria-hidden
                    >
                      {index + 1}.
                    </div>
                    {child}
                  </li>
                )
              )}
            </ol>
          ),
          li: ({ children }: JSX.IntrinsicElements["li"]) => (
            <div className="flex flex-col items-start font-sans text-sm">
              {children}
            </div>
          ),
          table: ({ children }: JSX.IntrinsicElements["table"]) => (
            <div className="mb-6 overflow-x-auto">
              <table className="table-auto border-2 border-emerald-200">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }: JSX.IntrinsicElements["thead"]) => (
            <thead className="bg-emerald-100">{children}</thead>
          ),
          th: ({ children }: JSX.IntrinsicElements["th"]) => (
            <th className="border-2 border-emerald-200 p-2 font-sans text-sm font-semibold text-emerald-950">
              {children}
            </th>
          ),
          td: ({ children }: JSX.IntrinsicElements["td"]) => (
            <td className="border-2 border-emerald-200 p-2 font-sans text-sm text-emerald-900">
              {children}
            </td>
          ),
          blockquote: ({ children }: JSX.IntrinsicElements["blockquote"]) => (
            <blockquote className="border-l-4 border-emerald-200 pl-2 italic text-emerald-900">
              {children}
            </blockquote>
          ),
        },
      })
      .processSync(content).result
  }, [content])
}

const CodeBlock = ({ children, className }: JSX.IntrinsicElements["code"]) => {
  const [copied, setCopied] = useState(false)
  const [showMermaidPreview, setShowMermaidPreview] = useState(false)
  const [showLatexPreview, setShowLatexPreview] = useState(false)
  const textInput = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (copied) {
      const interval = setTimeout(() => setCopied(false), 3000)
      return () => clearTimeout(interval)
    }
  }, [copied])

  // Highlight.js adds a `className` so this is a hack to detect if the code block
  // is a language block wrapped in a `pre` tag.
  if (className) {
    const isMermaid = className.includes("language-mermaid")
    const isLatex = className.includes("language-latex")

    return (
      <>
        <code ref={textInput} className={`${className} my-auto flex-shrink flex-grow rounded-lg`}>
          {children}
        </code>
        <div className="flex flex-shrink-0 flex-grow-0 flex-col gap-1">
          <button
            type="button"
            className="rounded-md border-2 border-emerald-200 p-1 text-emerald-900 transition-colors hover:bg-emerald-200"
            aria-label="copy code to clipboard"
            title="Copy code to clipboard"
            onClick={() => {
              if (!textInput?.current) {
                return
              }
              navigator.clipboard.writeText(textInput.current.textContent ?? "")
              setCopied(true)
            }}
          >
            {copied ? (
              <CheckCheck className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          {isMermaid ? (
            <>
              <button
                type="button"
                className="rounded-md border-2 border-emerald-200 p-1 text-emerald-900 transition-colors hover:bg-emerald-200"
                aria-label="Open Mermaid preview"
                title="Open Mermaid preview"
                onClick={() => {
                  setShowMermaidPreview(true)
                }}
              >
                <Workflow className="h-4 w-4" />
              </button>
              <Dialog
                open={showMermaidPreview}
                setOpen={setShowMermaidPreview}
                title="Mermaid diagram preview"
                size="3xl"
              >
                <Mermaid content={children?.toString() ?? ""} />
              </Dialog>
            </>
          ) : null}
          {isLatex ? (
            <>
              <button
                type="button"
                className="rounded-md border-2 border-emerald-200 p-1 text-emerald-900 transition-colors hover:bg-emerald-200"
                aria-label="Open Latex preview"
                title="Open Latex preview"
                onClick={() => {
                  setShowLatexPreview(true)
                }}
              >
                <Calculator className="h-4 w-4" />
              </button>
              <Dialog
                open={showLatexPreview}
                setOpen={setShowLatexPreview}
                title="Latex diagram preview"
                size="3xl"
              >
                {children?.toString()}
                {/* <Latex content={children?.toString() ?? ""} /> */}
              </Dialog>
            </>
          ) : null}
        </div>
      </>
    )
  }

  return (
    <code className="font-code -my-0.5 inline-block rounded bg-emerald-100 p-0.5 text-emerald-950">
      {children}
    </code>
  )
}

// const Latex = ({ content }: { content: string }) => {
//   const [diagram, setDiagram] = useState<string | boolean>(true)

//   useEffect(() => {
//     try {
//       const generator = new HtmlGenerator({ hyphenate: false })
//       const fragment = parse(content, { generator: generator }).domFragment()
//       setDiagram(fragment.firstElementChild.outerHTML)
//     } catch (error) {
//       console.error(error)
//       setDiagram(false)
//     }
//   }, [content])

//   if (diagram === true) {
//     return (
//       <div className="flex items-center gap-2">
//         <Loader2 className="h-4 w-4 animate-spin text-emerald-900" />
//         <p className="font-sans text-sm text-slate-700">Rendering diagram...</p>
//       </div>
//     )
//   } else if (diagram === false) {
//     return (
//       <p className="font-sans text-sm text-slate-700">
//         Unable to render this diagram.
//       </p>
//     )
//   } else {
//     return <div dangerouslySetInnerHTML={{ __html: diagram ?? "" }} />
//   }
// }

const Mermaid = ({ content }: { content: string }) => {
  const [diagram, setDiagram] = useState<string | boolean>(true)

  useEffect(() => {
    const render = async () => {
      // Generate a random ID for mermaid to use.
      const id = `mermaid-svg-${Math.round(Math.random() * 10000000)}`

      // Confirm the diagram is valid before rendering.
      if (await mermaid.parse(content, { suppressErrors: true })) {
        const { svg } = await mermaid.render(id, content)
        setDiagram(svg)
      } else {
        setDiagram(false)
      }
    }
    render()
  }, [content])

  if (diagram === true) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-900" />
        <p className="font-sans text-sm text-slate-700">Rendering diagram...</p>
      </div>
    )
  } else if (diagram === false) {
    return (
      <p className="font-sans text-sm text-slate-700">
        Unable to render this diagram. Try copying it into the{" "}
        <Link
          href="https://mermaid.live/edit"
          className={ANCHOR_CLASS_NAME}
          target="_blank"
        >
          Mermaid Live Editor
        </Link>
        .
      </p>
    )
  } else {
    return <div dangerouslySetInnerHTML={{ __html: diagram ?? "" }} />
  }
}

export const MARKDOWN_TEST_MESSAGE = `
# Heading level 1

This is the first paragraph.

This is the second paragraph.

This is the third paragraph.

## Heading level 2

This is an [anchor](https://github.com).

### Heading level 3

This is **bold** and _italics_.

#### Heading level 4

This is \`inline\` code.

This is a code block:

\`\`\`tsx
const Message = () => {
  return <div>hi</div>;
};
\`\`\`

##### Heading level 5

This is an unordered list:

- One
- Two
- Three, and **bold**

This is an ordered list:

1. One
1. Two
1. Three

This is a complex list:

1. **Bold**: One
    - One
    - Two
    - Three

2. **Bold**: Three
    - One
    - Two
    - Three

3. **Bold**: Four
    - One
    - Two
    - Three

###### Heading level 6

> This is a blockquote.

This is a table:

| Vegetable | Description |
|-----------|-------------|
| Carrot    | A crunchy, orange root vegetable that is rich in vitamins and minerals. It is commonly used in soups, salads, and as a snack. |
| Broccoli  | A green vegetable with tightly packed florets that is high in fiber, vitamins, and antioxidants. It can be steamed, boiled, stir-fried, or roasted. |
| Spinach   | A leafy green vegetable that is dense in nutrients like iron, calcium, and vitamins. It can be eaten raw in salads or cooked in various dishes. |
| Bell Pepper | A colorful, sweet vegetable available in different colors such as red, yellow, and green. It is often used in stir-fries, salads, or stuffed recipes. |
| Tomato    | A juicy fruit often used as a vegetable in culinary preparations. It comes in various shapes, sizes, and colors and is used in salads, sauces, and sandwiches. |
| Cucumber   | A cool and refreshing vegetable with a high water content. It is commonly used in salads, sandwiches, or as a crunchy snack. |
| Zucchini | A summer squash with a mild flavor and tender texture. It can be sautéed, grilled, roasted, or used in baking recipes. |
| Cauliflower | A versatile vegetable that can be roasted, steamed, mashed, or used to make gluten-free alternatives like cauliflower rice or pizza crust. |
| Green Beans | Long, slender pods that are low in calories and rich in vitamins. They can be steamed, stir-fried, or used in casseroles and salads. |
| Potato | A starchy vegetable available in various varieties. It can be boiled, baked, mashed, or used in soups, fries, and many other dishes. |

This is a mermaid diagram:

\`\`\`mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit
\`\`\`

\`\`\`latex
\\[F(x) = \\int_{a}^{b} f(x) \\, dx\\]
\`\`\`
`
