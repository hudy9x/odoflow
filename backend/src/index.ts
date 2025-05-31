import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import testRouter from './controllers/test.controller.js'
import benchmarkRouter from './controllers/benchmark.controller.js'
import workflowRouter from './controllers/workflow.controller.js'
import authRouter from './controllers/auth.controller.js'

export const app = new Hono()

// Add CORS middleware
app.use('*', cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'], // Allow frontend origin
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
}))

app.use(async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`)
  await next()
})

// Mount routes
app.route('/api/test', testRouter)
app.route('/api/benchmark', benchmarkRouter)
app.route('/api/workflow', workflowRouter)
app.route('/api/auth', authRouter)

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const port = 3003
  serve({
    fetch: app.fetch,
    port: port
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })
}
