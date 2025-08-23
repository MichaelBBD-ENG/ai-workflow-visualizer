import { applyNodeChanges, applyEdgeChanges, addEdge, ReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import ReactFlowJobNode from "./ReactFlowJobNode";
import '@xyflow/react/dist/style.css';
import ReactFlowStepNode from "./ReactFlowStepNode";
import { yamlToReactFlow } from "@/utils/utils";
import ReactFlowOnNode from "./ReactFlowOnNode";

const nodeTypes = {
    onNode: ReactFlowOnNode,
    jobNode: ReactFlowJobNode,
    stepNode: ReactFlowStepNode
};

export default function ReactFlowCanvas(
    {
        handleCanvasClick,
        selectedYamlString
    }: {
        handleCanvasClick: () => void,
        selectedYamlString: string
    }
){
    const [nodes, setNodes] = useState<{ id: string; data: any; position: { x: number; y: number; }; type: string; }[]>([]);
    const [edges, setEdges] = useState<{ id: string; source: string; target: string; }[]>([]);
    const [showCanvas, setShowCanvas] = useState(false);
    
    const onNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    useEffect(() => {
        if(selectedYamlString === undefined || selectedYamlString.trim() === ""){ 
            setShowCanvas(false);
            setNodes([]);
            setEdges([]);
            return;
        } else{
            const { nodes, edges } = yamlToReactFlow(selectedYamlString);
            setNodes(nodes);
            setEdges(edges);
            setShowCanvas(true);
        }
        
    }, [selectedYamlString])
    
    return(
        <main className="flex-1 bg-background relative" onClick={handleCanvasClick}>
          { showCanvas ?
                 <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                />
                :
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-muted/50 flex items-center justify-center">
                        <div className="w-12 h-12 rounded border-2 border-dashed border-muted-foreground/30"></div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Canvas Ready</h3>
                    <p className="text-sm max-w-md">
                        This is where your workflow visualization will appear. Use the sidebar to prompt the AI and build your
                        workflow or import a workflow.
                    </p>
                    </div>
                </div>
          }
        </main>
    )
}