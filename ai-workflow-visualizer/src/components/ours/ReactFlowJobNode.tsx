import { memo, useState } from "react";
import { Handle, Position  } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { LoaderFive } from "../ui/loader";
import { Button } from "../ui/button";

function ReactFlowJobNode({ data }: any) {
  const [aiSummary, setAiSummary] = useState<string | undefined>("");

  function askChatGPT() {
    setAiSummary(undefined);
    // simulate text streaming from chatgpt
    const bagOfRandomWords = [
      "Lorem ipsum dolor sit amet.",
      "Sed do eiusmod tempor incididunt.",
      "Ut enim ad minim veniam, quis nostrud.",
      "Duis aute irure dolor in reprehenderit.",
      "Excepteur sint occaecat cupidatat non proident."
    ]
    const interval = setInterval(() => {
      setAiSummary((aiSummary) => aiSummary ?? "" + bagOfRandomWords[Math.floor(Math.random() * bagOfRandomWords.length)]);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
    }, 5000);
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
          :
          <p>{aiSummary}</p>
        }
      </HoverCardContent>
    </HoverCard>
  );
}

export default memo(ReactFlowJobNode);
