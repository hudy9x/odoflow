import { NodeCreate } from './NodeCreate';
import { NodeWebhook } from './NodeWebhook';
import { NodeHttp } from './NodeHttp';
import { NodeDiscord } from './NodeDiscord';

export const nodeTypes = {
  create: NodeCreate,
  webhook: NodeWebhook,
  http: NodeHttp,
  discord: NodeDiscord,
};
