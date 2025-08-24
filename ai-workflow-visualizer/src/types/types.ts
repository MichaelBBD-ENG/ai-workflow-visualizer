export type WorkFlowNode = {
    id: string;
    data: any;
    position: { x: number; y: number };
    type: string;
}

export type WorkFlowEdge = {
    id: string;
    source: string;
    target: string;
    type: string;
    animated?: boolean;
}