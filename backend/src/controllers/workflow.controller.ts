import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const workflowRouter = new Hono()

// Create workflow
workflowRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const userId = body.userId // In a real app, this would come from auth middleware
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
workflowRouter.put('/:id', async (c) => {
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
workflowRouter.delete('/:id', async (c) => {
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

export default workflowRouter
