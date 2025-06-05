import { Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/index.js'
import { randomUUID } from 'crypto'
import { authMiddleware } from '../middleware/auth.middleware.js'
import type { AuthContext } from '../middleware/auth.middleware.js'

const router = new Hono()
const prisma = new PrismaClient()

// Apply auth middleware to all routes except webhook execution endpoint
router.use('/webhooks/*', authMiddleware)

type CreateWebhookInput = {
  name: string
}

// Create a new webhook
router.post('/webhooks', async (c: AuthContext) => {
  try {
    const body = await c.req.json() as CreateWebhookInput
    const { name } = body
    const userId = c.user!.userId

    if (!name) {
      return c.json({ success: false, error: 'Webhook name is required' }, 400)
    }

    const webhook = await prisma.webhook.create({
      data: {
        name,
        url: `/webhook/${randomUUID()}`,
        userId,
      },
    })

    return c.json({ success: true, webhook })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// List all webhooks for the authenticated user
router.get('/webhooks', async (c: AuthContext) => {
  try {
    const userId = c.user!.userId

    const webhooks = await prisma.webhook.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return c.json({ success: true, webhooks })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Delete a webhook
router.delete('/webhooks/:id', async (c: AuthContext) => {
  try {
    const id = c.req.param('id')
    const userId = c.user!.userId

    const webhook = await prisma.webhook.findUnique({
      where: { id },
    })

    if (!webhook) {
      return c.json({ success: false, error: 'Webhook not found' }, 404)
    }

    if (webhook.userId !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }

    await prisma.webhook.delete({
      where: { id },
    })

    return c.json({ success: true, message: 'Webhook deleted successfully' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Handle incoming webhook requests
router.post('/webhook/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const webhook = await prisma.webhook.findFirst({
      where: {
        url: {
          endsWith: id,
        },
      },
    })

    if (!webhook) {
      return c.json({ success: false, error: 'Webhook not found' }, 404)
    }

    // TODO: Implement webhook execution logic here
    // This should trigger the workflow associated with this webhook

    return c.json({ success: true, message: 'Webhook received successfully' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

export default router
