import { Check, Copy } from "lucide-react"
import { useState } from "react";

export default function MarkdownContent ({ content }: { content: string }) {
  const [hasCopied, setHasCopied] = useState(false)
  const handleCopy = async (contents: string) => {
    try {
      await navigator.clipboard.writeText(contents);
      setHasCopied(true)
      setTimeout(() => setHasCopied(false), 2000);
      //toast.success("Copied to clipboard");
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  const renderContent = () => {
    const parts = content.split(/(```[\s\S]*?```)/g)

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        // Extract language and code
        const lines = part.slice(3, -3).split("\n")
        const firstLine = lines[0].trim()
        const hasLanguage = firstLine && !firstLine.includes(" ")
        const language = hasLanguage ? firstLine : ""
        const code = hasLanguage ? lines.slice(1).join("\n") : lines.join("\n")

        return (
          <div key={index}>
            {language && (
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-t border flex justify-between">
                {language}
                <button onClick={() => handleCopy(code)} disabled={hasCopied} className="flex items-center">
                  { hasCopied ? 
                    <Check className="h-4 w-4 ml-2" /> :
                    <Copy className="h-4 w-4 ml-2" />
                  }
                </button>
              </div>
            )}
            <pre className={`bg-muted p-3 rounded${language ? "-b" : ""} border text-sm w-51 overflow-x-auto`}>
              <code>{code}</code>
            </pre>
          </div>
        )
      } else {
        return (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        )
      }
    })
  }

  return <div>{renderContent()}</div>
}