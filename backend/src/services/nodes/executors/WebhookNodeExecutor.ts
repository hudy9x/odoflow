import type { NodeExecutor, NodeExecutionResult, WebhookNodeConfig } from '../types.js';
import type { WorkflowNode } from '../../../generated/prisma/index.js';
import { nodeOutput } from '../NodeOutput.js';

export class WebhookNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode): Promise<NodeExecutionResult> {
    try {
      const config = node.data as unknown as WebhookNodeConfig;
      const response = await fetch(config.url, {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: typeof config.body === 'string' ? config.body : JSON.stringify(config.body)
      });

      const data = await response.json();
      return { success: true, output: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
