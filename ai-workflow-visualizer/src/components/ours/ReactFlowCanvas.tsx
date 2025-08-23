import { applyNodeChanges, applyEdgeChanges, addEdge, ReactFlow } from "@xyflow/react";
import { useCallback, useState } from "react";
import ReactFlowJobNode from "./ReactFlowJobNode";
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  jobNode: ReactFlowJobNode,
};
 
const initialNodes = [
  { type: 'jobNode',
    id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1',steps:[{ name: 'step 1', run: 'run 1', uses: 'uses 1' }, { name: 'step 2', run: 'run 2', uses: 'uses 2' }, { name: 'step 3', run: 'run 3', uses: 'uses 3' }], runsOn: 'runs on 1', } },
  { type: 'jobNode',
    id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2',steps:[{ name: 'step 1', run: 'run 1', uses: 'uses 1' }, { name: 'step 2', run: 'run 2', uses: 'uses 2' }, { name: 'step 3', run: 'run 3', uses: 'uses 3' }], runsOn: 'runs on 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

export default function ReactFlowCanvas(
    {
        handleCanvasClick,
        selectedYamlString
    }: {
        handleCanvasClick: () => void,
        selectedYamlString: string
    }
){
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    
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
    
    return(
        <main className="flex-1 bg-background relative" onClick={handleCanvasClick}>
          { selectedYamlString ?
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