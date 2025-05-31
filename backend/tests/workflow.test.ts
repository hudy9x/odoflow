import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { app } from "../src/index.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Workflow API Tests", () => {
  let testUserId: string;
  let workflowId: string;

  // Create a test user before running tests
  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `test${Date.now()}@test.com`,
        name: "Test User",
        password: "testpass123"
      }
    });
    testUserId = user.id;
  });

  // Clean up after all tests
  afterAll(async () => {
    try {
      await prisma.workflow.deleteMany({
        where: { userId: testUserId }
      });
      await prisma.user.delete({
        where: { id: testUserId }
      });
      await prisma.$disconnect();
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  });

  test("POST /workflow - should create a workflow with default name", async () => {
    const req = new Request("http://localhost:3003/workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: testUserId
      })
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.workflow).toBeDefined();
    expect(data.workflow.name).toBe("Untitled Workflow");
    expect(data.workflow.userId).toBe(testUserId);
    
    workflowId = data.workflow.id;
  });

  test("POST /workflow - should create a workflow with custom name", async () => {
    const req = new Request("http://localhost:3003/workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: testUserId,
        name: "My Custom Workflow",
        description: "Test workflow description"
      })
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.workflow).toBeDefined();
    expect(data.workflow.name).toBe("My Custom Workflow");
    expect(data.workflow.description).toBe("Test workflow description");
    expect(data.workflow.userId).toBe(testUserId);
  });

  test("PUT /workflow/:id - should update workflow", async () => {
    const req = new Request(`http://localhost:3003/workflow/${workflowId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Updated Workflow",
        description: "Updated description",
        isActive: true
      })
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.workflow.name).toBe("Updated Workflow");
    expect(data.workflow.description).toBe("Updated description");
    expect(data.workflow.isActive).toBe(true);
  });

  test("PUT /workflow/:id - should return 404 for non-existent workflow", async () => {
    const nonExistentId = "00000000-0000-0000-0000-000000000000";
    const req = new Request(`http://localhost:3003/workflow/${nonExistentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Updated Workflow"
      })
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(404);
    
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Workflow not found");
  });

  test("DELETE /workflow/:id - should delete workflow", async () => {
    const req = new Request(`http://localhost:3003/workflow/${workflowId}`, {
      method: "DELETE"
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.workflow.id).toBe(workflowId);
  });

  test("DELETE /workflow/:id - should return 404 for non-existent workflow", async () => {
    const nonExistentId = "00000000-0000-0000-0000-000000000000";
    const req = new Request(`http://localhost:3003/workflow/${nonExistentId}`, {
      method: "DELETE"
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(404);
    
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Workflow not found");
  });
});
