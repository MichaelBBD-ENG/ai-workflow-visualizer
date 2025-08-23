import type { WorkFlowEdge, WorkFlowNode } from '@/types/types';
import { create } from 'zustand'

export const useWorkflowNameStore = create<{ name: string; setName: (name: string) => void }>((set) => ({
  name: "",
  setName: (name: string) => set({ name }),
}))

export const useWorkflowNodesStore = create<{ nodes: WorkFlowNode[]; setNodes: (nodes: WorkFlowNode[]) => void }>((set) => ({
  nodes: [],
  setNodes: (nodes: WorkFlowNode[]) => set({ nodes }),
}))

export const useWorkflowEdgesStore = create<{ edges: WorkFlowEdge[]; setEdges: (edges: WorkFlowEdge[]) => void }>((set) => ({
  edges: [],
  setEdges: (edges: WorkFlowEdge[]) => set({ edges }),
}))