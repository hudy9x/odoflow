import { Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/index.js'
import { generateUniqueShortId } from '../utils/shortId.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import type { AuthContext } from '../middleware/auth.middleware.js'

const prisma = new PrismaClient()
const nodeRouter = new Hono()

// Apply auth middleware to all routes
nodeRouter.use('*', authMiddleware)

interface CreateNodeBody {
  workflowId: string
  type: string
  name: string
  positionX: number
  positionY: number
  data: any
  edge?: {
    sourceId?: string // Optional: if this is the source node
    targetId?: string // Optional: if this is the target node
  }
}

// Add a new node with optional edge
nodeRouter.post('/', async (c: AuthContext) => {
  try {
    const body = await c.req.json() as CreateNodeBody
    const userId = c.user!.userId

    // Verify workflow exists and belongs to user
    const workflow = await prisma.workflow.findUnique({
      where: { id: body.workflowId }
    })

    if (!workflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404)
    }

    if (workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }

    // Start a transaction since we might need to create both node and edge
    const result = await prisma.$transaction(async (tx) => {
      // Create the node
      const shortId = await generateUniqueShortId(body.workflowId, body.type);
      const node = await tx.workflowNode.create({
        data: {
          workflowId: body.workflowId,
          type: body.type,
          name: body.name,
          positionX: body.positionX,
          positionY: body.positionY,
          data: body.data,
          shortId
        }
      })

      // If edge information is provided, create the edge
      let createdEdge = null
      if (body.edge) {
        const edgeData = {
          workflowId: body.workflowId,
          sourceId: body.edge.sourceId || node.id,
          targetId: body.edge.targetId || node.id
        }

        createdEdge = await tx.workflowEdge.create({
          data: edgeData
        })
      }

      return { node, edge: createdEdge }
    })

    return c.json({ success: true, ...result })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Delete a node and its associated edges
nodeRouter.delete('/:nodeId', async (c: AuthContext) => {
  try {
    const nodeId = c.req.param('nodeId')
    const userId = c.user!.userId

    // First get the node to check workflow ownership
    const node = await prisma.workflowNode.findUnique({
      where: { id: nodeId },
      include: { workflow: true }
    })

    if (!node) {
      return c.json({ success: false, error: 'Node not found' }, 404)
    }

    // Check if workflow belongs to user
    if (node.workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }

    await prisma.$transaction(async (tx) => {
      // Delete all edges where this node is either source or target
      await tx.workflowEdge.deleteMany({
        where: {
          OR: [
            { sourceId: nodeId },
            { targetId: nodeId }
          ]
        }
      })

      // Delete the node
      await tx.workflowNode.delete({
        where: { id: nodeId }
      })
    })

    return c.json({ success: true, message: 'Node and associated edges deleted successfully' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Create a new edge
nodeRouter.post('/edge', async (c: AuthContext) => {
  try {
    const body = await c.req.json() as {
      workflowId: string
      sourceId: string
      targetId: string
    }
    const userId = c.user!.userId

    // Verify workflow exists and belongs to user
    const workflow = await prisma.workflow.findUnique({
      where: { id: body.workflowId }
    })

    if (!workflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404)
    }

    if (workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }

    const edge = await prisma.workflowEdge.create({
      data: {
        workflowId: body.workflowId,
        sourceId: body.sourceId,
        targetId: body.targetId
      }
    })

    return c.json({ success: true, edge })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Update node's position
nodeRouter.put('/position', async (c: AuthContext) => {
  try {
    const body = await c.req.json() as {
      workflowId: string
      nodeId: string
      positionX: number
      positionY: number
    }
    const userId = c.user!.userId

    // Verify workflow exists and belongs to user
    const workflow = await prisma.workflow.findUnique({
      where: { id: body.workflowId }
    })

    if (!workflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404)
    }

    if (workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }

    const node = await prisma.workflowNode.update({
      where: { id: body.nodeId },
      data: {
        positionX: body.positionX,
        positionY: body.positionY
      }
    })

    return c.json({ success: true, node })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Get node config
nodeRouter.get('/:nodeId/config', async (c: AuthContext) => {
  try {
    const nodeId = c.req.param('nodeId')
    const userId = c.user!.userId

    const node = await prisma.workflowNode.findUnique({
      where: { id: nodeId },
      include: { workflow: true }
    })

    if (!node) {
      return c.json({ success: false, error: 'Node not found' }, 404)
    }

    if (node.workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }

    return c.json({ 
      success: true, 
      config: node.data || {}
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Update node config
nodeRouter.put('/:nodeId/config', async (c: AuthContext) => {
  try {
    const nodeId = c.req.param('nodeId')
    const userId = c.user!.userId
    const body = await c.req.json() as Record<string, any>

    const node = await prisma.workflowNode.findUnique({
      where: { id: nodeId },
      include: { workflow: true }
    })

    if (!node) {
      return c.json({ success: false, error: 'Node not found' }, 404)
    }

    if (node.workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }

    // Update node data with new config
    const updatedNode = await prisma.workflowNode.update({
      where: { id: nodeId },
      data: {
        data: {
          ...node.data as object,
          ...body
        }
      }
    })

    return c.json({ 
      success: true, 
      config: updatedNode.data
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

export default nodeRouter
