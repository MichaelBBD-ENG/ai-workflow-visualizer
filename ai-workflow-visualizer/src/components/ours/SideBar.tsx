import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Bot, X, Send, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import MarkdownContent from "./MarkDownContent"
import { useState } from "react"

interface PromptHistoryItem {
  id: string
  prompt: string
  timestamp: Date
}

export default function Sidebar({
    isSidebarCollapsed,
    setIsSidebarCollapsed,
}: {
    isSidebarCollapsed: boolean
    setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [currentPrompt, setCurrentPrompt] = useState("")
    const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([])
    
    const handleSendPrompt = () => {
    if (currentPrompt.trim()) {
        const newPrompt: PromptHistoryItem = {
        id: Date.now().toString(),
        prompt: currentPrompt.trim(),
        timestamp: new Date(),
        }
        setPromptHistory((prev) => [newPrompt, ...prev])
        setCurrentPrompt("")
    }
    }

    const clearHistory = () => {
      setPromptHistory([])
    }

    return (
        <aside
          className={`absolute left-4 top-4 bottom-4 z-10 bg-background border rounded-lg shadow-lg transition-all duration-300 ${
            isSidebarCollapsed ? "w-12 h-min" : "w-80"
          }`}
        >
          {isSidebarCollapsed ? (
            <div className="p-3 flex flex-col items-center gap-2 h-min">
              <Button onClick={() => setIsSidebarCollapsed(false)} variant="ghost" size="sm" className="w-6 h-6 p-0">
                <Bot className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-medium">AI Assistant</h2>
                <Button onClick={() => setIsSidebarCollapsed(true)} variant="ghost" size="sm" className="w-6 h-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 border-b">
                {/* Prompt Input */}
                <div className="flex gap-2">
                  <Input
                    value={currentPrompt}
                    onChange={(e) => setCurrentPrompt(e.target.value)}
                    placeholder="Describe your workflow..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendPrompt()
                      }
                    }}
                  />
                  <Button onClick={handleSendPrompt} size="sm" disabled={!currentPrompt.trim()} className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Prompt History */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 pb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Prompt History</h3>
                  {promptHistory.length > 0 && (
                    <Button
                      onClick={clearHistory}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                <ScrollArea className="flex-1 px-4">
                  {promptHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No prompts yet. Start by describing your workflow above.
                    </div>
                  ) : (
                    <div className="space-y-3 pb-4">
                      {promptHistory.map((item, _) => (
                        <Card key={item.id} className="bg-card">
                          <CardContent className="p-3">
                            <div className="text-sm text-card-foreground mb-2">
                              <MarkdownContent content={item.prompt} />
                            </div>
                            <p className="text-xs text-muted-foreground">{item.timestamp.toLocaleTimeString()}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
        </aside>
    )
}