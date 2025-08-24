import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Bot, X, Send, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import MarkdownContent from "./MarkDownContent"
import { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea"
import { v4 as uuid } from "uuid"
import { LoaderFive } from "../ui/loader"
import { aiGenerateWorkflowYaml } from "@/utils/chatgpt"
import { toast } from "sonner"
import { usePromptHistoryStore } from "@/store/store"
import type { PromptHistoryItem } from "@/types/types"

export default function Sidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  setSelectedYamlString,
}: {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedYamlString: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [currentPrompt, setCurrentPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([])
    const setZustandPromptHistory = usePromptHistoryStore((state) => state.setHistory);
    const zustandPromptHistory = usePromptHistoryStore((state) => state.history);
    
    const handleSendPrompt = async () => {
    if (!currentPrompt.trim()) return;
    setIsLoading(true);

    try {
      const yaml = await aiGenerateWorkflowYaml(currentPrompt);
  
      setSelectedYamlString(yaml);

      const newPrompt: PromptHistoryItem = {
        id: uuid(),
        prompt: "```yaml\n" + yaml + "\n```",
        timestamp: new Date(),
      };

      setPromptHistory((prev) => [newPrompt, ...prev]);
      setZustandPromptHistory([newPrompt, ...promptHistory]);
      setCurrentPrompt("");
    } catch (error) {
      if(error === "ChatGPT client is not initialized"){
        // do nothing toast already showed error
      } else{
        toast.error("Error generating workflow, please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

    const clearHistory = () => {
      setPromptHistory([])
      setZustandPromptHistory([])
    }

    const deletePrompt = (id: string) => {
      setZustandPromptHistory(promptHistory.filter((item) => item.id !== id))
      setPromptHistory((prev) => prev.filter((item) => item.id !== id))
    }

    useEffect(() => {
      if (zustandPromptHistory.length > 0) {
        setPromptHistory(zustandPromptHistory)
      }
    }, [])

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
            <div className="flex flex-col h-full w-full">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-medium">AI Assistant</h2>
                <Button onClick={() => setIsSidebarCollapsed(true)} variant="ghost" size="sm" className="w-6 h-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 border-b">
                {/* Prompt Input */}
                { isLoading ?
                    <div className="flex gap-2">
                      <LoaderFive text="Generating workflow..." />
                    </div>
                    :
                    <div className="flex gap-2">
                      <Textarea
                        value={currentPrompt}
                        onChange={(e) => setCurrentPrompt(e.target.value)}
                        placeholder="Describe your workflow..."
                        className="flex-1 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendPrompt()
                          }
                        }}
                      />
                      <Button onClick={handleSendPrompt} size="sm" disabled={!currentPrompt.trim()} className="shrink-0 bg-amber-400">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  }
              </div>

              {/* Prompt History */}
              <div className="flex-1 flex flex-col min-h-0 w-full min-w-0">
                <div className="p-4 pb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Prompt History</h3>
                  {promptHistory.length > 0 && (
                    <Button
                      onClick={clearHistory}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                      Clear
                    </Button>
                  )}
                </div>

                <div className="flex-1 min-h-0 px-4 w-full min-w-0">
                <ScrollArea className="h-full w-full">
                  {promptHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No prompts yet. Start by describing your workflow above.
                    </div>
                  ) : (
                    <div className="space-y-3 pb-4 h-full overflow-y-auto overflow-x-hidden">
                      {promptHistory.map((item, _) => (
                        <Card key={item.id} className="bg-card">
                          <CardContent className="p-3">
                            <div className="text-sm text-card-foreground mb-2 flex justify-between">
                              <MarkdownContent content={item.prompt} />
                              <Button
                                onClick={() => deletePrompt(item.id)}
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-muted-foreground hover:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
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
            </div>
          )}
        </aside>
    )
}