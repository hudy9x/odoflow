import { Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/index.js'
import { TriggerType } from '../generated/prisma/index.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import type { AuthContext } from '../middleware/auth.middleware.js'

type StartingNodeUpdateBody = {
  startingNodeId: string | null
  triggerType?: TriggerType | null
  triggerValue?: string | null
}

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

// Get all workflows with their unique node types
workflowRouter.get('/', async (c: AuthContext) => {
  try {
    const userId = c.user!.userId // Get userId from auth context
    const filter = c.req.query('filter') as 'recently' | 'active' | 'inactive' | 'all' | undefined;

    let where: any = { userId };
    if (filter === 'active') {
      where.isActive = true;
    } else if (filter === 'inactive') {
      where.isActive = false;
    } else if (filter === 'recently') {
      // 7 days ago from now
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      console.log('sevenDaysAgo', sevenDaysAgo)
      where.updatedAt = { gte: sevenDaysAgo };
    }
    // 'all' or undefined: no extra filter

    const workflows = await prisma.workflow.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        nodes: {
          select: {
            type: true
          },
          distinct: ['type']
        }
      }
    })

    // Transform the response to include unique node types as an array
    const workflowsWithNodes = workflows.map(workflow => ({
      ...workflow,
      uniqueNodeTypes: workflow.nodes.map(node => node.type)
    }))

    return c.json({ success: true, workflows: workflowsWithNodes })
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

// Toggle workflow active status
workflowRouter.put('/:id/active', async (c: AuthContext) => {
  try {
    const id = c.req.param('id');
    const { active } = await c.req.json();

    // First check if workflow exists and belongs to user
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id }
    });

    if (!existingWorkflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404);
    }

    // Update workflow's active status
    const workflow = await prisma.workflow.update({
      where: { id },
      data: { isActive: active }
    });

    return c.json({ success: true, workflow });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// Update workflow starting node and trigger info
workflowRouter.put('/:id/starting-node', async (c: AuthContext) => {
  try {
    const id = c.req.param('id')
    const { startingNodeId, triggerType, triggerValue } = await c.req.json() as StartingNodeUpdateBody

    // First check if workflow exists and belongs to user
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id }
    })

    if (!existingWorkflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404)
    }

    // Update workflow's starting node and trigger info
    const workflow = await prisma.workflow.update({
      where: { id },
      data: { 
        startingNodeId,
        triggerType: triggerType || null,
        triggerValue: triggerValue || null
      }
    })

    return c.json({ success: true, workflow })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

export default workflowRouter
