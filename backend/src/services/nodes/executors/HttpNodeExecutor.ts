import type { NodeExecutor, NodeExecutionResult, HttpNodeConfig } from '../types.js';
import type { WorkflowNode } from '../../../generated/prisma/index.js';
import axios from 'axios';

export class HttpNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, inputData: any): Promise<NodeExecutionResult> {
    try {
      const config = node.data as unknown as HttpNodeConfig;
      const response = await axios({
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.body
      });
      
      return { success: true, output: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}
