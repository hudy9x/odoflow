import type { Context, Next } from 'hono'
import { verify } from 'hono/jwt'

export interface AuthContext extends Context {
  user?: {
    userId: string
    email: string
  }
}

export const authMiddleware = async (c: AuthContext, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: 'No token provided' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = await verify(token, process.env.JWT_SECRET || 'super-secret')

    // Add user info to the context after type checking
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded && 'email' in decoded) {
      c.user = {
        userId: String(decoded.userId),
        email: String(decoded.email)
      }
    } else {
      throw new Error('Invalid token payload')
    }

    await next()
  } catch (error) {
    return c.json({ success: false, message: 'Invalid token' }, 401)
  }
}
