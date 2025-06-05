import type { NodeExecutor, NodeExecutionResult, DiscordNodeConfig } from '../types.js';
import type { WorkflowNode } from '../../../generated/prisma/index.js';
import axios from 'axios';

export class DiscordNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, inputData: any): Promise<NodeExecutionResult> {
    try {
      const config = node.data as unknown as DiscordNodeConfig;
      const response = await axios.post(config.webhookUrl, config.message, {
        headers: { 'Content-Type': 'application/json' }
      });

      return { 
        success: true, 
        output: { status: response.status } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
