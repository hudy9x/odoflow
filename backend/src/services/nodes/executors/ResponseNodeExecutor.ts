import type { NodeExecutor, NodeExecutionResult } from '../types.js';
import type { WorkflowNode } from '../../../generated/prisma/index.js';
import { templateParser } from '../TemplateParser.js';

interface ResponseNodeConfig {
  statusCode: string;
  headers: Array<{
    id: string;
    key: string;
    value: string;
  }>;
  responseData: string; // JSON string
}

export class ResponseNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode): Promise<NodeExecutionResult> {
    try {
      const data = node.data as unknown as Record<string, unknown>;
      const config = data.config as unknown as ResponseNodeConfig;

      // Parse template strings in config
      const parsedStatusCode = templateParser.parse(config.statusCode);
      const parsedHeaders = config.headers.reduce((acc, header) => {
        acc[templateParser.parse(header.key)] = templateParser.parse(header.value);
        return acc;
      }, {} as Record<string, string>);
      const parsedResponseData = templateParser.parse(config.responseData);

      let responseData;
      try {
        // Try to parse the response data as JSON
        responseData = JSON.parse(parsedResponseData);
      } catch {
        // If parsing fails, use the raw string
        responseData = parsedResponseData;
      }

      return {
        success: true,
        output: {
          customResponse: true,
          statusCode: parseInt(parsedStatusCode) || 200,
          headers: parsedHeaders,
          body: responseData
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
