import { Hono } from 'hono'
import { createNodeWebSocket } from '@hono/node-ws'

const statusWsController = new Hono()

interface StatusMessage {
  status: string
  tick: number
}

statusWsController.get('/ws/status', async (c) => {
return   upgradeWebSocket((c) => {
  return {
    onMessage(event, ws) {
      console.log(`Message from client: ${event.data}`)
      ws.send('Hello from server!')
    },
    onClose: () => {
      console.log('Connection closed')
    },
  }
})

})

export default statusWsController
