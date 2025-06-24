import type { WorkflowNode } from '../../generated/prisma/index.js'

export interface NodeExecutor {
  execute(node: WorkflowNode): Promise<NodeExecutionResult>;
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
  body?: {
    contentType: string,
    requestContent: string
  },
  bodyType?: string,
  queryParams?: Record<string, string>
}

export interface DiscordNodeConfig {
  tts: boolean,
  content: string,
  username: string,
  avatarUrl: string,
  webhookUrl: string,
  messageType: string
}

export interface WebhookNodeConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface ResponseNodeConfig {
  statusCode: string;
  headers: Array<{
    id: string;
    key: string;
    value: string;
  }>;
  responseData: string; // JSON string
}

export interface CodeScriptNodeConfig {
  variables: Record<string, any>;
  script: string;
}
