import type { WorkflowNode } from '../../generated/prisma/index.js'

export interface NodeExecutor {
  execute(node: WorkflowNode, inputData: any): Promise<NodeExecutionResult>;
}

export interface NodeExecutionResult {
  success: boolean;
  output?: any;
  error?: any;
}

export interface HttpNodeConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface DiscordNodeConfig {
  webhookUrl: string;
  message: any;
}

export interface WebhookNodeConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}
