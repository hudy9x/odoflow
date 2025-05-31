import { Hono } from 'hono'

const app = new Hono()

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

// Start the server
const port = 3003
Bun.serve({
  fetch: app.fetch,
  port: port,
})

console.log(`Bun server is running on http://localhost:${port}`)
