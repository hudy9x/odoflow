import type { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

type UserPayload = {
  id: string;
  email: string;
};

declare module 'hono' {
  interface ContextVariableMap {
    user: {
      id: string;
      email: string;
    };
  }
}

export async function authenticateToken(c: Context, next: Next) {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const payload = await verify(token, process.env.JWT_SECRET || 'your-secret-key') as UserPayload;
    c.set('user', { id: payload.id, email: payload.email });
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}
