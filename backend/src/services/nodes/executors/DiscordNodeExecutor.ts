import type { NodeExecutor, NodeExecutionResult, DiscordNodeConfig } from '../types.js';
import type { WorkflowNode } from '../../../generated/prisma/index.js';
import axios from 'axios';
import { templateParser } from '../TemplateParser.js';

export class DiscordNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode): Promise<NodeExecutionResult> {
    try {
      const data = node.data as unknown as Record<string, unknown>;
      const config = data.config as unknown as DiscordNodeConfig;
      console.log('config DiscordNodeExecutor', config)

      // Parse template strings in config
      const parsedContent = templateParser.parse(config.content);
      const parsedUsername = templateParser.parse(config.username);
      const parsedAvatarUrl = templateParser.parse(config.avatarUrl);

      const response = await axios.post(config.webhookUrl, {
        content: parsedContent,
        username: parsedUsername,
        avatar_url: parsedAvatarUrl,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('response', response.status, response.data)

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
