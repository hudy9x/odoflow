import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.middleware.js'
import type { AuthContext } from '../middleware/auth.middleware.js'

const prisma = new PrismaClient()
const workflowRouter = new Hono()

// Apply auth middleware to all routes
workflowRouter.use('*', authMiddleware)

// Create workflow
workflowRouter.post('/', async (c: AuthContext) => {
  try {
    const body = await c.req.json()
    const userId = c.user!.userId // Get userId from auth context
    const name = body.name || 'Untitled Workflow'
    const description = body.description

    const workflow = await prisma.workflow.create({
      data: {
        userId,
        name,
        description,
        isActive: false
      }
    })

    return c.json({ success: true, workflow })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Edit workflow
workflowRouter.put('/:id', async (c: AuthContext) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { name, description, isActive } = body

    // First check if workflow exists and belongs to user
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id }
    })

    if (!existingWorkflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404)
    }

    // Update workflow
    const workflow = await prisma.workflow.update({
      where: { id },
      data: {
        name,
        description,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return c.json({ success: true, workflow })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Delete workflow
workflowRouter.delete('/:id', async (c: AuthContext) => {
  try {
    const id = c.req.param('id')

    // First check if workflow exists
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id }
    })

    if (!existingWorkflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404)
    }

    // Delete workflow
    const workflow = await prisma.workflow.delete({
      where: { id }
    })

    return c.json({ success: true, workflow })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Get all workflows
workflowRouter.get('/', async (c: AuthContext) => {
  try {
    const userId = c.user!.userId // Get userId from auth context

    const workflows = await prisma.workflow.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    })

    return c.json({ success: true, workflows })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Get workflow by ID with nodes and edges
workflowRouter.get('/:id', async (c: AuthContext) => {
  try {
    const id = c.req.param('id')
    const userId = c.user!.userId

    // Get workflow with its nodes and edges
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        nodes: true,
        edges: true
      }
    })

    if (!workflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404)
    }

    // Check if workflow belongs to user
    if (workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }

    return c.json({ success: true, workflow })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

export default workflowRouter
