import { applyNodeChanges, applyEdgeChanges, addEdge, ReactFlow, type Connection } from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import ReactFlowJobNode from "./ReactFlowJobNode";
import '@xyflow/react/dist/style.css';
import ReactFlowStepNode from "./ReactFlowStepNode";
import { yamlToReactFlow } from "@/utils/utils";
import ReactFlowOnNode from "./ReactFlowOnNode";
import { useWorkflowNodesStore, useWorkflowEdgesStore, useWorkflowNameStore } from "@/store/store";
import type { WorkFlowEdge, WorkFlowNode } from "@/types/types";
import ReactFlowEdge from "./ReactFlowEdge";
import { toast } from "sonner";

const nodeTypes = {
    onNode: ReactFlowOnNode,
    jobNode: ReactFlowJobNode,
    stepNode: ReactFlowStepNode
};

const edgeTypes = {
    rfEdge: ReactFlowEdge,
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
        (connection: any) => {
            const edge = { ...connection, type: 'rfEdge' };
            setEdges((edgesSnapshot) => {
                const appliedChanges = addEdge(edge, edgesSnapshot);
                setZustandEdges(appliedChanges);
                return appliedChanges;
            })
        },
        [],
    );

    const isValidConnection = (connection: WorkFlowEdge | Connection) => {
        const { source, target } = connection;

        const sourceType = nodes.find(n => n.id === source)?.type;
        const targetType = nodes.find(n => n.id === target)?.type;

        if (sourceType === "stepNode" && targetType === "jobNode"){ 
            toast.error("Cannot connect step to job");
            return false;
        } else if (sourceType === "stepNode" && targetType === "onNode"){ 
            toast.error("Cannot connect step to on");
            return false;
        } else if (sourceType === "onNode" && targetType === "stepNode"){ 
            toast.error("Cannot connect on to step");
            return false;
        } else{
            return true;
        }
    };

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
                    edgeTypes={edgeTypes}
                    isValidConnection={isValidConnection}
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