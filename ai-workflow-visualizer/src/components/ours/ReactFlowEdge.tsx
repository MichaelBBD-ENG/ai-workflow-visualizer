import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { memo } from 'react';

function ReactFlowEdge(
    { id, sourceX, sourceY, targetX, targetY }
    :
    {
      id: string;
      sourceX: number;
      sourceY: number;
      targetX: number;
      targetY: number;
    }
) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: Position.Right,
    targetX,
    targetY,
    targetPosition: Position.Left,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="outline" size="sm" className='p-2 text-xs text-muted-foreground hover:text-foreground'>
                        <Pencil className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Edge Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button
                            onClick={() => {
                                    setEdges((es) => es.filter((e) => e.id !== id));
                                }}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                            <Trash2 className="h-3 w-3" />
                            Delete edge
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

      </EdgeLabelRenderer>
    </>
  );
}

export default memo(ReactFlowEdge);