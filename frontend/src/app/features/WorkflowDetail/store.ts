import { create } from 'zustand'
import { Node, Edge, NodeChange, EdgeChange, Connection, addEdge } from '@xyflow/react'
import { createNode, deleteNode, createEdge, updateNodePosition, deleteEdge } from '@/app/services/node.service'
import { updateWorkflowStartingNode } from '@/app/services/workflow.service'
import { debounce } from '@/lib/utils'
import { toast } from 'sonner'
import { TriggerType } from '@/app/types/workflow'

const debouncedUpdatePosition = debounce(async (workflowId: string | null, nodeId: string, x: number, y: number) => {
  if (!workflowId) {
    console.error('No workflow ID available')
    return
  }

  try {
    const response = await updateNodePosition({
      workflowId,
      nodeId,
      positionX: x,
      positionY: y
    })

    if (!response.success) {
      console.error('Failed to update node position:', response.error)
    }

    toast.success("Node position updated");
  } catch (error) {
    console.error('Error updating node position:', error)
  }
}, 1000) // 1 second debounce

interface WorkflowState {
  workflowId: string | null
  nodes: Node[]
  edges: Edge[]
  startingNodeId: string | null
  triggerType: TriggerType | null
  triggerValue: string | null
  isActive: boolean
  background: string | null
  setWorkflowId: (id: string) => void
  setBackground: (background: string | null) => void
  setInitialData: (nodes: Node[], edges: Edge[], startingNodeId: string | null, triggerType: TriggerType | null, triggerValue: string | null, isActive: boolean) => void
  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  updateNodes: (changes: NodeChange[]) => void
  updateEdges: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  isLeafNode: (nodeId: string) => boolean
  addConnectedNode: (sourceId: string, type: string) => void
  setStartingNodeId: (nodeId: string | null) => void
  updateWorkflowTrigger: (params: { workflowId: string, triggerType: TriggerType, triggerValue?: string }) => Promise<void>
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowId: null,
  nodes: [],
  edges: [],
  startingNodeId: null,
  triggerType: null,
  triggerValue: null,
  isActive: false,
  background: null,

  setWorkflowId: (id) => set({ workflowId: id }),

  setBackground: (background) => set({ background }),

  setInitialData: (nodes, edges, startingNodeId, triggerType, triggerValue, isActive) => {
    set({ nodes, edges, startingNodeId, triggerType, triggerValue, isActive })
  },

  updateWorkflowTrigger: async ({ workflowId, triggerType, triggerValue }) => {
    // Update UI state immediately
    set({ triggerType, triggerValue })

    try {
      const response = await updateWorkflowStartingNode({
        workflowId,
        startingNodeId: get().startingNodeId,
        triggerType,
        triggerValue
      })

      if (!response.success) {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error('Failed to update workflow trigger:', error)
      throw error
    }
  },

  setStartingNodeId: (nodeId) => {
    const state = get()
    if (!state.workflowId) return

    // Update UI state immediately
    set({ startingNodeId: nodeId })

    // Fire and forget API update
    updateWorkflowStartingNode({
      workflowId: state.workflowId,
      startingNodeId: nodeId,
      triggerType: state.triggerType || undefined,
      triggerValue: state.triggerValue || undefined
    }).catch((error: Error) => {
      console.error('Failed to update starting node:', error)
      toast.error('Failed to set starting node')
      // Revert state on error
      set({ startingNodeId: state.startingNodeId })
    })
  },

  addNode: async (node: Node) => {
    try {
      const state = get()
      if (!state.workflowId) {
        console.error('No workflow ID available')
        return
      }

      const response = await createNode({
        workflowId: state.workflowId || '',
        type: node.type || 'default',
        name: (node.data?.label as string) || node.type || 'Unnamed Node',
        positionX: Math.round(node.position.x),
        positionY: Math.round(node.position.y),
        data: node.data || {}
      })

      if (response.success) {

        set((state) => {
          let newNodes = [...state.nodes]
          const merged:Record<string, string> = {};
          const autoAssignStartingNode = (nodeId:string) =>  { merged.startingNodeId = nodeId }

          console.log('newNodes', newNodes.length)
          // If this is the only node and it's a create node, remove it
          if (newNodes.length === 1 && newNodes[0].type === 'create') {
            newNodes = []

            // Mark this node as the starting node
            autoAssignStartingNode(response.node.id)
          }

          // Add the new node with database ID
          const newNode = {
            ...node,
            id: response.node.id,
            shortId: response.node.shortId,
          }

          newNodes.push(newNode)

          // If this is the first node, set it as the starting node
          if (merged.startingNodeId) {
            updateWorkflowStartingNode({
              workflowId: state.workflowId || '',
              startingNodeId: merged.startingNodeId,
              triggerType: state.triggerType || undefined,
              triggerValue: state.triggerValue || undefined
            })
          }

          return { nodes: newNodes, ...merged }
        })

       

      }
    } catch (error) {
      console.error('Failed to create node:', error)
    }
  },

  removeNode: (nodeId: string) => {

    const autoCreateNodeWhenNoNodeLeft = () => {
      console.log('autoCreateNodeWhenNoNodeLeft')
      set(() => {
        return {
          nodes: [{
            id: `create-${Math.random().toString(36).substring(2, 9)}`,
            type: 'create',
            position: { x: 250, y: 200 },
            data: {}
          }],
        }
      })
    }

    console.log('removeNode', nodeId)
    set((state) => ({
      nodes: state.nodes.filter(n => n.id !== nodeId),
      edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
      startingNodeId: state.startingNodeId === nodeId ? null : state.startingNodeId
    }))
    
    // Fire and forget delete request
    console.log('deleteNode from server', nodeId)
    deleteNode(nodeId).catch(error => {
      toast.error('Failed to delete node')
      console.error('Failed to delete node:', error)
    })

    if (get().nodes.length === 0) {
      autoCreateNodeWhenNoNodeLeft()
    }
    
  },

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
            // Trigger debounced position update
            debouncedUpdatePosition(get().workflowId, change.id, change.position.x, change.position.y)
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

      console.trace('update edges', changes)

      let removedEdgeId = ''
      changes.forEach((change) => {
        if (change.type === 'remove') {
          const edgeIndex = nextEdges.findIndex((e) => e.id === change.id)
          if (edgeIndex !== -1) {
            nextEdges.splice(edgeIndex, 1)
            removedEdgeId = change.id
          }
        }
      })

      if (removedEdgeId) {
        deleteEdge(removedEdgeId).then(() => {
          console.log('Edge deleted successfully')
          toast.success('Edge deleted successfully')
        }).catch((error) => {
          console.error('Error deleting edge:', error)
          toast.error('Failed to delete edge')
        })
      }

      console.log('udpate edges')
      return { edges: nextEdges }
    })
  },

  // onConnect means user hold a handle and drag to connect to another node
  // so it will create a new edge between 2 nodes
  onConnect: async (connection) => {
    const state = get()
    const workflowId = state.workflowId
    
    if (!workflowId) {
      console.error('No workflow ID available')
      return
    }

    console.log('on connect', connection, state.edges)

    const existingConnection = state.edges.find(edge => {
      return edge.target === connection.target
    })

    if (existingConnection) {
      toast.warning('You cannot create a connection to an existing one')
      return
    }

    // Update UI state immediately
    const oldEdges = state.edges
    set((state) => ({
      edges: addEdge({ ...connection, type: 'customedge' }, state.edges)
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
        toast.error('Failed to create connection')
        set(() => ({ edges: oldEdges }))
      } else {
        toast.success('Connection created successfully')
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
          type: 'customedge'
        }

        set((state) => ({
          nodes: [...state.nodes, newNode],
          edges: [...state.edges, newEdge]
        }))
        toast.success('Node added successfully')
      }
    } catch (error) {
      console.error('Failed to create connected node:', error)
      toast.error('Failed to add node')
    }
  }
}))
