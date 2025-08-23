import { memo } from "react";
import { Handle, Position  } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

function ReactFlowJobNode({ data }: {data: { label: string, steps: { name: string, run: string, uses: string }[], runsOn: string }}) {
  const { label, steps = [], runsOn } = data;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="rounded-2xl shadow-md bg-white border w-64">
          <CardContent className="p-3">
            <h3 className="text-lg font-semibold">{label}</h3>
            <p className="text-xs text-gray-500 mb-2">Runs on: {runsOn}</p>
            <ul className="text-xs space-y-1">
              {steps.map((step, i: number) => (
                <li key={i}>• {step.name || step.run || step.uses}</li>
              ))}
            </ul>
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

export default memo(ReactFlowJobNode);
