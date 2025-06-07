import type { NodeExecutor, NodeExecutionResult, HttpNodeConfig } from '../types.js';
import type { WorkflowNode } from '../../../generated/prisma/index.js';
import axios from 'axios';
import { templateParser } from '../TemplateParser.js';

export class HttpNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode): Promise<NodeExecutionResult> {
    try {
      const data = node.data as unknown as Record<string, unknown>;
      const config = data.config as unknown as HttpNodeConfig;
      const body = config.body;
      const headers = config.headers || {};
      console.log('config', config)
      // Parse template strings in config
      const parsedUrl = templateParser.parse(config.url);
      const parsedHeaders = headers ? templateParser.parseObject(headers) : {};
      const parsedQueryParams = config.queryParams ? templateParser.parseObject(config.queryParams) : undefined;
      const parsedRequestContent = templateParser.parse(body?.requestContent);

      const response = await axios({
        url: parsedUrl,
        method: config.method,
        headers: Object.assign(parsedHeaders, { 'Content-Type': body?.contentType }),
        data: parsedRequestContent,
        params: parsedQueryParams
      });

      console.log('response', response.data)
      
      return { success: true, output: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}
