import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { app } from "../src/index.js";
import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

describe("API Endpoints Tests", () => {
  let createdUserId: string;

  // Clean up after all tests
  afterAll(async () => {
    try {
      // Clean up any remaining test users
      await prisma.user.deleteMany();
      await prisma.$disconnect();
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  });

  test("POST /test/user - should create a random user", async () => {
    const req = new Request("http://localhost:3003/test/user", {
      method: "POST",
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.email).toMatch(/@test.com$/);
    expect(data.user.name).toMatch(/^Test User/);
    
    // Save the user ID for delete test
    createdUserId = data.user.id;
  });

  test("DELETE /test/user/:id - should delete an existing user", async () => {
    const req = new Request(`http://localhost:3003/test/user/${createdUserId}`, {
      method: "DELETE",
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.id).toBe(createdUserId);
  });

  test("DELETE /test/user/:id - should return error for non-existent user", async () => {
    const nonExistentId = 99999;
    const req = new Request(`http://localhost:3003/test/user/${nonExistentId}`, {
      method: "DELETE",
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(500);
    
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  test("DELETE /test/user/:id - should handle invalid ID format", async () => {
    const invalidId = "not-a-number";
    const req = new Request(`http://localhost:3003/test/user/${invalidId}`, {
      method: "DELETE",
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(500);
    
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });
});
