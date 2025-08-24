import type { PromptHistoryItem, WorkFlowEdge, WorkFlowNode } from '@/types/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useWorkflowNameStore = create<{ name: string; setName: (name: string) => void }>()(
  devtools(
    persist(
      (set) => ({
        name: "",
        setName: (name: string) => set({ name }),
      }),
      {
        name: "workflow-name",
      }
    )
  )
)

export const useWorkflowNodesStore = create<{ nodes: WorkFlowNode[]; setNodes: (nodes: WorkFlowNode[]) => void }>()(
  devtools(
    persist(
      (set) => ({
      nodes: [],
      setNodes: (nodes: WorkFlowNode[]) => set({ nodes }),
      }),
      {
        name: "workflow-nodes",
      }
    )
  )
)

export const useWorkflowEdgesStore = create<{ edges: WorkFlowEdge[]; setEdges: (edges: WorkFlowEdge[]) => void }>()(
  devtools(
    persist(
      (set) => ({
        edges: [],
        setEdges: (edges: WorkFlowEdge[]) => set({ edges }),

      }),
      {
        name: "workflow-edges",
      }
    )
  )
)

export const usePromptHistoryStore = create<{ history: PromptHistoryItem[]; setHistory: (history: PromptHistoryItem[]) => void }>()(
  devtools(
    persist(
      (set) => ({
        history: [],
        setHistory: (history: PromptHistoryItem[]) => set({ history }),
      }),
      {
        name: "prompt-history",
      }
    )
  )
)