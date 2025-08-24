import { memo, useState } from "react";
import { Handle, Position  } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { LoaderFive } from "../ui/loader";
import { Button } from "../ui/button";
import { aiSummarizeSection } from "@/utils/chatgpt";

function ReactFlowJobNode({ data }: any) {
  const [aiSummary, setAiSummary] = useState<string | undefined | "error">("");

  async function askChatGPT() {
    try{
      if (aiSummary === "" || aiSummary === "error"){
        setAiSummary(undefined);
        const response = await aiSummarizeSection(`Can you summarize this github action workflow step in less than 100 words: ${data}`);
        setAiSummary(response);
      }
    } catch(e) {
      setAiSummary("error")
    }
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="rounded-2xl shadow-md border-b-blue-400">
          <CardContent className="p-3">
            <h3 className="text-lg font-semibold mb-3">Job</h3>
            <pre className="bg-muted p-3 rounded border text-sm overflow-x-auto">
              <code>{data}</code>
            </pre>
          </CardContent>
          {/* Handles let you connect nodes */}
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </Card>
      </HoverCardTrigger>

      {/* Popover with AI summary */}
      <HoverCardContent className="w-64 text-sm">
        { aiSummary === undefined ?
          <LoaderFive text="Generating summary..." />
          : aiSummary === "" ?
          <Button onClick={askChatGPT} variant="outline" size="sm" className="gap-2 bg-transparent">
            Ask ChatGPT what this job does
          </Button>
          : aiSummary === "error" ?
          <Button onClick={askChatGPT} variant="outline" size="sm" className="gap-2 bg-transparent text-red-400">
            ChatGPT encountered some error, please try again
          </Button>
          :
          <p>{aiSummary}</p>
        }
      </HoverCardContent>
    </HoverCard>
  );
}

export default memo(ReactFlowJobNode);
