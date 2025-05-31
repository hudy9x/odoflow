import { Hono } from 'hono'
import testRouter from './controllers/test.controller'
import benchmarkRouter from './controllers/benchmark.controller'
import workflowRouter from './controllers/workflow.controller'

export const app = new Hono()

// Mount routes
app.route('/test', testRouter)
app.route('/benchmark', benchmarkRouter)
app.route('/workflow', workflowRouter)

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const port = 3003
  Bun.serve({
    fetch: app.fetch,
    port: port,
  })

  console.log(`Bun server is running on http://localhost:${port}`)
}
