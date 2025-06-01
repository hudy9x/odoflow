import { create } from 'zustand'
import { Node, Edge, NodeChange, EdgeChange, Connection, addEdge } from '@xyflow/react'

interface WorkflowState {
  workflowId: string | null
  nodes: Node[]
  edges: Edge[]
  setWorkflowId: (id: string) => void
  setInitialData: (nodes: Node[], edges: Edge[]) => void
  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  updateNodes: (changes: NodeChange[]) => void
  updateEdges: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  isLeafNode: (nodeId: string) => boolean
  addConnectedNode: (sourceId: string, type: string) => void
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowId: null,
  nodes: [],
  edges: [],

  setWorkflowId: (id) => set({ workflowId: id }),

  setInitialData: (nodes, edges) => set({ nodes, edges }),

  addNode: (node) => set((state) => {
    let newNodes = [...state.nodes]

    // If this is the only node and it's a create node, remove it
    if (newNodes.length === 1 && newNodes[0].type === 'create') {
      newNodes = []
    }

    // Add the new node
    newNodes.push(node)

    return { nodes: newNodes }
  }),

  removeNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter(n => n.id !== nodeId)
  })),

  updateNodes: (changes) => {
    set((state) => {
      const nextNodes = [...state.nodes]
      changes.forEach((change) => {
        // Handle different types of changes (position, removal, etc)
        if (change.type === 'position' && change.position) {
          const nodeIndex = nextNodes.findIndex((n) => n.id === change.id)
          if (nodeIndex !== -1) {
            nextNodes[nodeIndex] = {
              ...nextNodes[nodeIndex],
              position: change.position
            }
          }
        } else if (change.type === 'remove') {
          const nodeIndex = nextNodes.findIndex((n) => n.id === change.id)
          if (nodeIndex !== -1) {
            nextNodes.splice(nodeIndex, 1)
          }
        }
      })
      return { nodes: nextNodes }
    })
  },

  updateEdges: (changes) => {
    set((state) => {
      const nextEdges = [...state.edges]
      changes.forEach((change) => {
        if (change.type === 'remove') {
          const edgeIndex = nextEdges.findIndex((e) => e.id === change.id)
          if (edgeIndex !== -1) {
            nextEdges.splice(edgeIndex, 1)
          }
        }
      })
      return { edges: nextEdges }
    })
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges)
    }))
  },

  isLeafNode: (nodeId: string) => {
    const state = get()
    return !state.edges.some((edge: Edge) => edge.source === nodeId)
  },

  addConnectedNode: (sourceId, type) => {
    const state = get()
    const sourceNode = state.nodes.find((n: Node) => n.id === sourceId)
    if (!sourceNode) return

    // Create new node positioned to the right of source node
    const newNode = {
      id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: {
        x: sourceNode.position.x + 200, // 200px to the right
        y: sourceNode.position.y, // Same Y level
      },
      data: {}
    }

    // Create edge connecting source to new node
    const newEdge = {
      id: `${sourceId}-${newNode.id}`,
      source: sourceId,
      target: newNode.id
    }

    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: [...state.edges, newEdge]
    }))
  }
}))
