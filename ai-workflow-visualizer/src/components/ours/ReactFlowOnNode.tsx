import { memo } from "react";
import { Handle, Position  } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

function ReactFlowOnNode({ data }: any) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="rounded-2xl shadow-md border-b-blue-400">
          <CardContent className="p-3">
            <h3 className="text-lg font-semibold mb-3">On</h3>
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
        <p>{ "we will stream the ai summary from chatgpt"}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

export default memo(ReactFlowOnNode);
