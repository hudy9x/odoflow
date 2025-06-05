import { Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()
const testRouter = new Hono()

// Create random user
testRouter.post('/user', async (c) => {
  try {
    const timestamp = Date.now()
    const randomEmail = `user${timestamp}@test.com`
    const user = await prisma.user.create({
      data: {
        email: randomEmail,
        name: `Test User ${timestamp}`,
        password: `test${timestamp}`
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
    const id = c.req.param('id')
    const user = await prisma.user.delete({
      where: { id }
    })
    return c.json({ success: true, user })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: errorMessage }, 500)
  }
})

export default testRouter
