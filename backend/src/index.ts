import { Hono } from 'hono'
import { cors } from 'hono/cors'
import testRouter from './controllers/test.controller'
import benchmarkRouter from './controllers/benchmark.controller'
import workflowRouter from './controllers/workflow.controller'
import authRouter from './controllers/auth.controller'

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
app.route('/test', testRouter)
app.route('/benchmark', benchmarkRouter)
app.route('/workflow', workflowRouter)
app.route('/auth', authRouter)

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const port = 3003
  Bun.serve({
    fetch: app.fetch,
    port: port,
  })

  console.log(`Bun server is running on http://localhost:${port}`)
}
