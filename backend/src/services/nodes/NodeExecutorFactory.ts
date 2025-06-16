import { HttpNodeExecutor } from './executors/HttpNodeExecutor.js';
import { DiscordNodeExecutor } from './executors/DiscordNodeExecutor.js';
import { WebhookNodeExecutor } from './executors/WebhookNodeExecutor.js';
import { ResponseNodeExecutor } from './executors/ResponseNodeExecutor.js';
import type { NodeExecutor } from './types.js';

export class NodeExecutorFactory {
  private static executors = new Map<string, NodeExecutor>([
    ['http', new HttpNodeExecutor()],
    ['discord', new DiscordNodeExecutor()],
    ['webhook', new WebhookNodeExecutor()],
    ['response', new ResponseNodeExecutor()]
  ]);

  static getExecutor(nodeType: string): NodeExecutor {
    const executor = this.executors.get(nodeType.toLowerCase());
    if (!executor) {
      throw new Error(`No executor found for node type: ${nodeType}`);
    }
    return executor;
  }
}
