export default function MarkdownContent ({ content }: { content: string }) {
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
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-t border">{language}</div>
            )}
            <pre className={`bg-muted p-3 rounded${language ? "-b" : ""} border text-sm overflow-x-auto`}>
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