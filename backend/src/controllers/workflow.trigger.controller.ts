import { Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/index.js'
import { TriggerType } from '../generated/prisma/index.js'
import { WorkflowTraversalService } from '../services/node.traversal.service.js'
import { TraversalStrategy } from '../services/nodes/traversal/types.js'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

const prisma = new PrismaClient()
const workflowTriggerRouter = new Hono()

// Handle webhook triggers
workflowTriggerRouter.post('/workflow-by/:webhookId', async (c) => {
  try {
    const webhookId = c.req.param('webhookId')
    let requestBody = {}

    // Check if there's a request body
    const contentType = c.req.header('content-type')
    if (contentType && contentType.includes('application/json')) {
      try {
        const body = await c.req.json()
        requestBody = body || {}
      } catch (e) {
        console.log('Warning: Invalid JSON body, using empty object')
      }
    }

    console.log('params:', {
      triggerType: TriggerType.WEBHOOK,
      requestBody,
      triggerValue: webhookId,
      isActive: true
    })

    // Find workflow by webhook ID with nodes and edges
    const workflow = await prisma.workflow.findFirst({
      where: {
        triggerType: TriggerType.WEBHOOK,
        triggerValue: webhookId,
        isActive: true
      },
      include: {
        nodes: {
          include: {
            filter: true
          }
        },
        edges: true
      }
    })

    console.log('work', workflow?.nodes)

    if (!workflow) {
      return c.json({ 
        success: false, 
        error: 'No active workflow found for this webhook ID' 
      }, 404)
    }

    if (!workflow.startingNodeId) {
      return c.json({ 
        success: false, 
        error: 'Workflow has no starting node configured' 
      }, 400)
    }

    // Create a new workflow run
    const workflowRun = await prisma.workflowRun.create({
      data: {
        workflowId: workflow.id,
        status: 'RUNNING',
        startedAt: new Date()
      }
    })

    // Traverse and process all nodes in the workflow
    const traversalService = new WorkflowTraversalService();
    const result = await traversalService.traverse({
      startingNodeId: workflow.startingNodeId!,
      nodes: workflow.nodes,
      edges: workflow.edges,
      workflowRunId: workflowRun.id,
      initialInputData: requestBody,
      strategy: TraversalStrategy.ROW_FIRST
    })

     // Create a new workflow run
     prisma.workflowRun.update({
      where: {
        id: workflowRun.id
      },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })

    if (result && typeof result === 'object' && 'customResponse' in result) {
      const { statusCode, headers, body } = result;
      const bodyData = {}
      Object.assign(bodyData, body)
    
      return c.json(bodyData, statusCode as unknown as ContentfulStatusCode, headers)
    }

    return c.json({ 
      success: true, 
      workflowRunId: workflowRun.id,
      message: 'Workflow triggered successfully'
    })

  } catch (error) {
    console.error('Error triggering workflow:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ 
      success: false, 
      error: errorMessage 
    }, 500)
  }
})

export default workflowTriggerRouter
