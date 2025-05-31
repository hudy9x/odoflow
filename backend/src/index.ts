import { Hono } from 'hono'
import { PrismaClient } from './generated/prisma'

export const app = new Hono()
const prisma = new PrismaClient()

// Test routes
const testRouter = new Hono()

// Create random user
testRouter.post('/user', async (c) => {
  try {
    const randomEmail = `user${Date.now()}@test.com`
    const user = await prisma.user.create({
      data: {
        email: randomEmail,
        name: `Test User ${Date.now()}`
      }
    })
    return c.json({ success: true, user })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Delete user by ID
testRouter.delete('/user/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const user = await prisma.user.delete({
      where: { id }
    })
    return c.json({ success: true, user })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

// Mount test routes
app.route('/test', testRouter)

// Basic text response
app.get('/', (c) => {
  return c.text('Hello from Bun.js!')
})

// JSON response
app.get('/json', (c) => {
  return c.json({
    message: 'Hello from Bun.js!',
    timestamp: new Date().toISOString()
  })
})

// CPU intensive task
app.get('/heavy', async (c) => {
  let result = 0
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i)
  }
  return c.text(`Heavy computation result: ${result}`)
})

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const port = 3003
  Bun.serve({
    fetch: app.fetch,
    port: port,
  })

  console.log(`Bun server is running on http://localhost:${port}`)
}
