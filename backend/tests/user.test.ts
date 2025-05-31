import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

describe("User Model Tests", () => {
  // Test data
  const testUser = {
    email: "test@example.com",
    name: "Test User",
  };

  // Clean up after all tests
  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test("should create a new user", async () => {
    const user = await prisma.user.create({
      data: testUser,
    });

    expect(user.email).toBe(testUser.email);
    expect(user.name).toBe(testUser.name);
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  test("should read a user", async () => {
    const users = await prisma.user.findMany({
      where: {
        email: testUser.email,
      },
    });

    expect(users.length).toBeGreaterThan(0);
    expect(users[0].email).toBe(testUser.email);
  });

  test("should update a user", async () => {
    const updatedName = "Updated Test User";
    const user = await prisma.user.update({
      where: {
        email: testUser.email,
      },
      data: {
        name: updatedName,
      },
    });

    expect(user.name).toBe(updatedName);
  });

  test("should delete a user", async () => {
    const deleted = await prisma.user.delete({
      where: {
        email: testUser.email,
      },
    });

    expect(deleted.email).toBe(testUser.email);

    const users = await prisma.user.findMany({
      where: {
        email: testUser.email,
      },
    });

    expect(users.length).toBe(0);
  });
});
