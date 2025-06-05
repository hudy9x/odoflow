import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { PrismaClient } from "../generated/prisma/index.js";
import { hash, compare } from "bcrypt";
import { sign } from "hono/jwt";

const prisma = new PrismaClient();
const auth = new Hono();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

// Register endpoint
auth.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, password, name } = c.req.valid("json");

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json({
        success: false,
        message: "User with this email already exists",
      }, 400);
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0], // Use part of email as name if not provided
      },
    });

    return c.json({
      success: true,
      message: "Registration successful",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    }, 201);
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({
      success: false,
      message: "Registration failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Login endpoint
auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  console.log(email, password)

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return c.json({
        success: false,
        message: "Invalid credentials",
      }, 401);
    }

    // Verify password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return c.json({
        success: false,
        message: "Invalid credentials",
      }, 401);
    }

    // Generate JWT token
    const payload = {
      userId: user.id,
      email: user.email,
    };
    
    const token = await sign(payload, process.env.JWT_SECRET || 'super-secret');

    return c.json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

export default auth;
