import { customAlphabet } from 'nanoid';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 3);

function getPrefix(type: string): string {
  type = type.toLowerCase();
  if (type.includes('webhook')) return 'hook';
  if (type.includes('discord')) return 'disc';
  if (type.includes('http')) return 'http';
  return type.slice(0, 4); // Take first 4 chars for other types
}

export async function generateUniqueShortId(workflowId: string, type: string): Promise<string> {
  const prefix = getPrefix(type);
  let isUnique = false;
  let shortId = '';
  
  while (!isUnique) {
    shortId = `${prefix}_${nanoid()}`;
    const existing = await prisma.workflowNode.findFirst({
      where: {
        workflowId,
        shortId
      }
    });
    isUnique = !existing;
  }
  
  return shortId;
}
