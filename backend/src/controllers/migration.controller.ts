import { Hono } from 'hono';
import { PrismaClient } from '../generated/prisma/index.js';
import { generateUniqueShortId } from '../utils/shortId.js';

const router = new Hono();
const prisma = new PrismaClient();

function getPrefix(type: string): string {
  type = type.toLowerCase();
  if (type.includes('webhook')) return 'hook';
  if (type.includes('discord')) return 'disc';
  if (type.includes('http')) return 'http';
  return type.slice(0, 4); // Take first 4 chars for other types
}

router.get('/migration', async (c) => {
  try {
    // Check if migration is enabled
    if (!process.env.RUN_MIGRATION) {
      console.log('Migration is not enabled. Set RUN_MIGRATION=1 to enable.')

      return c.json({ 
        success: false, 
        error: 'Migration is not enabled. Set RUN_MIGRATION=1 to enable.' 
      }, 403);
    }

    // Find all nodes without shortId
    const nodes = await prisma.workflowNode.findMany({
      where: { shortId: null }
    });

    console.log(`Found ${nodes.length} nodes to migrate`);

    // Update each node with a new shortId
    const results = [];
    for (const node of nodes) {
      const shortId = await generateUniqueShortId(node.workflowId, node.type);
      
      await prisma.workflowNode.update({
        where: { id: node.id },
        data: { shortId }
      });

      results.push({ id: node.id, shortId });
      console.log(`Updated node ${node.id} with shortId: ${shortId}`);
    }

    return c.json({ 
      success: true, 
      message: `Successfully migrated ${nodes.length} nodes`,
      results 
    });

  } catch (error) {
    console.error('Migration failed:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, 500);
  }
});

export default router;
