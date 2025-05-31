import { Hono } from 'hono'

const benchmarkRouter = new Hono()

// Basic text response
benchmarkRouter.get('/', (c) => {
  return c.text('Hello from Bun.js!')
})

// JSON response
benchmarkRouter.get('/json', (c) => {
  return c.json({
    message: 'Hello from Bun.js!',
    timestamp: new Date().toISOString()
  })
})

// CPU intensive task
benchmarkRouter.get('/heavy', async (c) => {
  let result = 0
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i)
  }
  return c.text(`Heavy computation result: ${result}`)
})

export default benchmarkRouter
