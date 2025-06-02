import { create } from 'zustand'
import { Node, Edge, NodeChange, EdgeChange, Connection, addEdge } from '@xyflow/react'
import { createNode, deleteNode, createEdge } from '@/app/services/node.service'

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

  addNode: async (node: Node) => {
    const state = get()
    if (!state.workflowId) return

    try {
      // Create node in the database
      const response = await createNode({
        workflowId: state.workflowId,
        type: node.type || 'default',
        name: node.type || 'default', // Using type as name for now
        positionX: Math.round(node.position.x),
        positionY: Math.round(node.position.y),
        data: node.data as Record<string, unknown>
      })

      if (response.success) {
        set((state) => {
          let newNodes = [...state.nodes]

          // If this is the only node and it's a create node, remove it
          if (newNodes.length === 1 && newNodes[0].type === 'create') {
            newNodes = []
          }

          // Add the new node with database ID
          newNodes.push({
            ...node,
            id: response.node.id // Use the database ID
          })

          return { nodes: newNodes }
        })
      }
    } catch (error) {
      console.error('Failed to create node:', error)
    }
  },

  removeNode: async (nodeId: string) => {
    try {
      const response = await deleteNode(nodeId)
      
      if (response.success) {
        set((state) => ({
          nodes: state.nodes.filter(n => n.id !== nodeId),
          // Also remove any edges connected to this node
          edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
        }))
      }
    } catch (error) {
      console.error('Failed to delete node:', error)
    }
  },

  updateNodes: (changes) => {
    set((state) => {
      const nextNodes = [...state.nodes]
      console.log('update nodes', changes)
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
      console.log('update nodes')
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
      console.log('udpate edges')
      return { edges: nextEdges }
    })
  },

  // onConnect means user hold a handle and drag to connect to another node
  // so it will create a new edge between 2 nodes
  onConnect: async (connection) => {
    console.log('on connect', connection)
    const state = get()
    const workflowId = state.workflowId
    
    if (!workflowId) {
      console.error('No workflow ID available')
      return
    }

    // Update UI state immediately
    const oldEdges = state.edges
    set((state) => ({
      edges: addEdge({ ...connection }, state.edges)
    }))

    try {
      const response = await createEdge({
        workflowId,
        sourceId: connection.source,
        targetId: connection.target
      })

      if (!response.success) {
        // Revert state if API call fails
        console.error('Failed to create edge:', response.error)
        set(() => ({ edges: oldEdges }))
      }
    } catch (error) {
      // Revert state on error
      console.error('Error creating edge:', error)
      set(() => ({ edges: oldEdges }))
    }
  },

  isLeafNode: (nodeId: string) => {
    const state = get()
    return !state.edges.some((edge: Edge) => edge.source === nodeId)
  },

  addConnectedNode: async (sourceId: string, type: string) => {
    const state = get()
    if (!state.workflowId) return

    const sourceNode = state.nodes.find((n: Node) => n.id === sourceId)
    if (!sourceNode) return

    try {
      // Create new node with edge in the database
      const response = await createNode({
        workflowId: state.workflowId,
        type: type || 'default',
        name: type || 'default',
        positionX: Math.round(sourceNode.position.x + 200), // 200px to the right
        positionY: Math.round(sourceNode.position.y), // Same Y level
        data: {},
        edge: {
          sourceId // This will connect back to the source node
        }
      })

      if (response.success && response.node) {
        // Add node and edge to local state
        const newNode = {
          id: response.node.id,
          type,
          position: {
            x: sourceNode.position.x + 200,
            y: sourceNode.position.y,
          },
          data: {}
        }

        const newEdge = {
          id: response.edge?.id || `${sourceId}-${newNode.id}`,
          source: sourceId,
          target: newNode.id,
        }

        set((state) => ({
          nodes: [...state.nodes, newNode],
          edges: [...state.edges, newEdge]
        }))
      }
    } catch (error) {
      console.error('Failed to create connected node:', error)
    }
  }
}))
