import { create } from 'zustand'

export interface NodeDebugData {
  status: string
  outputData: Record<string, unknown>
  error?: string
}

interface NodeDebugStore {
  nodes: Record<string, NodeDebugData>
  set: (nodeId: string, data: NodeDebugData) => void
  setInitialData: (data: Record<string, NodeDebugData>) => void
}

export const useNodeDebugStore = create<NodeDebugStore>((set) => ({
  nodes: {},
  set: (nodeId, data) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: data,
      },
    })),
  setInitialData: (data) => set({ nodes: data }),
}))
