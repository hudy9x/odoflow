import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import testRouter from './controllers/test.controller.js'
import benchmarkRouter from './controllers/benchmark.controller.js'
import workflowRouter from './controllers/workflow.controller.js'
import authRouter from './controllers/auth.controller.js'
import nodeRouter from './controllers/node.controller.js'
import webhookRouter from './controllers/webhook.controller.js'
import workflowTriggerRouter from './controllers/workflow.trigger.controller.js'
import migrationRouter from './controllers/migration.controller.js'
import nodeFilterController from './controllers/node.filter.controller.js'
// import statusWsController from './controllers/websocket.controller.js'
import { createNodeWebSocket } from '@hono/node-ws'
import { RedisService } from './services/redis.service.js'
import workflowLogsRouter from './controllers/workflow.logs.controller.js'

export const app = new Hono()
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })


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
app.route('/api/node', nodeRouter)
app.route('/api', webhookRouter) // Webhook routes are mounted at /api/webhooks
app.route('/api/trigger', workflowTriggerRouter) // Workflow trigger routes
app.route('/api', migrationRouter) // Migration routes
app.route('/api/node-filters', nodeFilterController)
app.route('/api/workflow-logs', workflowLogsRouter)


const redisService = RedisService.getInstance();



app.get('/ws', upgradeWebSocket((c) => {
  // https://hono.dev/helpers/websocket
  return {
    onOpen(ev, ws) {
      console.log('Connection opened')
      redisService.subscribe('node-run-log', (channel: string, message: string) => {
        console.log(`Received message from Redis channel ${channel}: ${message}`);
        ws.send(JSON.stringify({
          status: 'OK',
          tick: Date.now(),
          channel,
          message
        }))
      });


      // const intervalId = setInterval(() => {
      //   ws.send(JSON.stringify({
      //     status: 'OK',
      //     tick: Date.now()
      //   }))
      // }, 1000)
    },
    onMessage(event, ws) {
      console.log(`Message from client: ${event.data}`)
      ws.send('Hello from server!')
    },
    onClose: () => {
      console.log('Connection closed')
    },
  }
})) // WebSocket status endpoint

// Start the server only if not in test environment
// if (process.env.NODE_ENV !== 'test') {
  const port = 3003
  const server = serve({
    fetch: app.fetch,
    port: port
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })

  injectWebSocket(server)
// }
