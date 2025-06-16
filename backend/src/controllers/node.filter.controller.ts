import { Hono } from 'hono';
import { PrismaClient } from '../generated/prisma/index.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import type { AuthContext } from '../middleware/auth.middleware.js';

interface CreateFilterBody {
  workflowId: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  conditions: any;
}

interface UpdateFilterBody {
  label?: string;
  conditions: any;
}

const prisma = new PrismaClient();
const nodeFilterController = new Hono();

// Apply auth middleware to all routes
nodeFilterController.use('*', authMiddleware);

nodeFilterController.post('/', async (c: AuthContext) => {
  try {
    const body = await c.req.json() as CreateFilterBody;
    const userId = c.user!.userId;

    // Verify workflow exists and belongs to user
    const workflow = await prisma.workflow.findUnique({
      where: { id: body.workflowId }
    });

    if (!workflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404);
    }

    if (workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }
    
    const filter = await prisma.workflowNodeFilter.create({
      data: {
        workflowId: body.workflowId,
        sourceNodeId: body.sourceNodeId,
        targetNodeId: body.targetNodeId,
        label: body.label,
        conditions: body.conditions,
      },
    });

    // Update workflow to trigger updatedAt
    await prisma.workflow.update({
      where: { id: body.workflowId },
      data: { updatedAt: new Date() }
    });

    return c.json({ success: true, data: filter });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

nodeFilterController.get('/workflow/:workflowId', async (c: AuthContext) => {
  try {
    const workflowId = c.req.param('workflowId');
    const userId = c.user!.userId;

    // Verify workflow belongs to user
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId }
    });

    if (!workflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404);
    }

    if (workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }

    const filters = await prisma.workflowNodeFilter.findMany({
      where: {
        workflowId,
      },
    });
    return c.json({ success: true, data: filters });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

nodeFilterController.delete('/:id', async (c: AuthContext) => {
  try {
    const filterId = c.req.param('id');
    const userId = c.user!.userId;

    // Get filter and check ownership through workflow
    const filter = await prisma.workflowNodeFilter.findUnique({
      where: { id: filterId },
      include: { workflow: true }
    });

    if (!filter) {
      return c.json({ success: false, error: 'Filter not found' }, 404);
    }

    if (filter.workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }

    await prisma.$transaction(async (tx) => {
      // Delete the filter
      await tx.workflowNodeFilter.delete({
        where: { id: filterId },
      });

      // Update workflow to trigger updatedAt
      await tx.workflow.update({
        where: { id: filter.workflowId },
        data: { updatedAt: new Date() }
      });
    });

    return c.json({ success: true, message: 'Filter deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

nodeFilterController.put('/:id', async (c: AuthContext) => {
  try {
    const filterId = c.req.param('id');
    const body = await c.req.json() as UpdateFilterBody;
    const userId = c.user!.userId;

    // Get filter and check ownership through workflow
    const filter = await prisma.workflowNodeFilter.findUnique({
      where: { id: filterId },
      include: { workflow: true }
    });

    if (!filter) {
      return c.json({ success: false, error: 'Filter not found' }, 404);
    }

    if (filter.workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }

    await prisma.$transaction(async (tx) => {
      // Update the filter conditions
      await tx.workflowNodeFilter.update({
        where: { id: filterId },
        data: { 
          label: body.label,
          conditions: body.conditions,
        }
      });

      // Update workflow to trigger updatedAt
      await tx.workflow.update({
        where: { id: filter.workflowId },
        data: { updatedAt: new Date() }
      });
    });

    const updatedFilter = await prisma.workflowNodeFilter.findUnique({
      where: { id: filterId }
    });

    return c.json({ success: true, data: updatedFilter });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

export default nodeFilterController;
