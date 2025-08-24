import { memo, useState } from "react";
import { Handle, Position  } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Button } from "../ui/button";
import { LoaderFive } from "../ui/loader";
import { client } from "../../utils/chatgpt";

function ReactFlowStepNode({ data }: any) {
  const [aiSummary, setAiSummary] = useState<string | undefined | "error">("");
  
  async function askChatGPT() {
    try{
      if (aiSummary === "" || aiSummary === "error"){
        setAiSummary(undefined);
        const response = await client.responses.create({
          model: 'gpt-4.1-mini',
          input: `Can you summarize this github action workflow step in less than 100 words: ${data}`
        });
  
        setAiSummary(response.output_text);
      }
    } catch(e) {
      setAiSummary("error")
    }
  }
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="rounded-2xl shadow-md border-amber-300">
          <CardContent className="p-3">
            <h3 className="text-lg font-semibold mb-3">Step</h3>
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
            Ask ChatGPT what this step does
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

export default memo(ReactFlowStepNode);
