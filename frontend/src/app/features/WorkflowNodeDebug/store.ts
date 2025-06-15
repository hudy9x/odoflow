import { create } from 'zustand'

interface NodeDebugData {
  status: string
  outputData: Record<string, unknown>
  error?: string
}

interface NodeDebugStore {
  nodes: Record<string, NodeDebugData>
  set: (nodeId: string, data: NodeDebugData) => void
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
}))
