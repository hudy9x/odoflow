import { Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/index.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import type { AuthContext } from '../middleware/auth.middleware.js'

const prisma = new PrismaClient()
const workflowLogsRouter = new Hono()

// Apply auth middleware to all routes
workflowLogsRouter.use('*', authMiddleware)

// Get all logs by workflow id
workflowLogsRouter.get('/:workflowId', async (c: AuthContext) => {
  try {
    const workflowId = c.req.param('workflowId')
    const userId = c.user!.userId

    // Verify workflow exists and belongs to user
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        workflowRuns: {
          include: {
            logs: {
              orderBy: { startedAt: 'desc' }
            }
          },
          orderBy: { triggeredAt: 'desc' }
        }
      }
    })

    if (!workflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404)
    }

    if (workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }

    // Flatten logs from all workflow runs
    const logs = workflow.workflowRuns.flatMap(run => run.logs)

    return c.json({ success: true, logs })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Get latest log by workflow id
workflowLogsRouter.get('/:workflowId/latest', async (c: AuthContext) => {
  try {
    const workflowId = c.req.param('workflowId')
    const userId = c.user!.userId

    // First get the latest workflow run
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        workflowRuns: {
          orderBy: { triggeredAt: 'desc' },
          take: 1
        }
      }
    })

    if (!workflow) {
      return c.json({ success: false, error: 'Workflow not found' }, 404)
    }

    if (workflow.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }

    const latestWorkflowRun = workflow.workflowRuns[0]
    if (!latestWorkflowRun) {
      return c.json({ success: true, logs: [] })
    }

    // Now get all logs for this workflow run
    const logs = await prisma.workflowRunLog.findMany({
      where: { workflowRunId: latestWorkflowRun.id },
      orderBy: { startedAt: 'desc' }
    })

    return c.json({ success: true, logs })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

export default workflowLogsRouter
