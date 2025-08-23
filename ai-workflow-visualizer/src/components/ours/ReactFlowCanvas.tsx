import { applyNodeChanges, applyEdgeChanges, addEdge, ReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import ReactFlowJobNode from "./ReactFlowJobNode";
import '@xyflow/react/dist/style.css';
import ReactFlowStepNode from "./ReactFlowStepNode";
import { yamlToReactFlow } from "@/utils/utils";
import ReactFlowOnNode from "./ReactFlowOnNode";
import { useWorkflowNodesStore, useWorkflowEdgesStore, useWorkflowNameStore } from "@/store/store";
import type { WorkFlowEdge, WorkFlowNode } from "@/types/types";

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
    const [nodes, setNodes] = useState<WorkFlowNode[]>([]);
    const [edges, setEdges] = useState<WorkFlowEdge[]>([]);
    const setZustandNodes = useWorkflowNodesStore((state) => state.setNodes);
    const setZustandEdges = useWorkflowEdgesStore((state) => state.setEdges);
    const setWorkflowName = useWorkflowNameStore((state) => state.setName);
    const [showCanvas, setShowCanvas] = useState(false);
    
    const onNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => {
            const appliedChanges = applyNodeChanges(changes, nodesSnapshot);
            setZustandNodes(appliedChanges);
            return appliedChanges;
        }),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => {
            const appliedChanges = applyEdgeChanges(changes, edgesSnapshot);
            setZustandEdges(appliedChanges);
            return appliedChanges;
        }),
        [],
    );
    const onConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => {
            const appliedChanges = addEdge(params, edgesSnapshot);
            setZustandEdges(appliedChanges);
            return appliedChanges;
        }),
        [],
    );

    useEffect(() => {
        if(selectedYamlString === undefined || selectedYamlString.trim() === ""){ 
            setShowCanvas(false);
            setNodes([]);
            setEdges([]);
            return;
        } else{
            const { workflowName, nodes, edges } = yamlToReactFlow(selectedYamlString);
            setNodes(nodes);
            setZustandNodes(nodes);
            setEdges(edges);
            setZustandEdges(edges);
            setWorkflowName(workflowName);
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