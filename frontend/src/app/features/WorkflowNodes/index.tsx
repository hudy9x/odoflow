import { Globe, MessageSquare, Reply, Webhook } from 'lucide-react';
import { NodeCreate } from './NodeCreate';
import { NodeWebhook } from './NodeWebhook';
import { NodeHttp } from './NodeHttp';
import { NodeDiscord } from './NodeDiscord';
import { NodeResponse } from './NodeResponse';

// Node type configuration with metadata
export const nodeTypeConfig = [
  { 
    type: 'webhook',
    title: 'Webhook',
    description: 'Trigger events',
    icon: <Webhook className="w-4 h-4" />,
  },
  {
    type: 'http',
    title: 'HTTP Request',
    description: 'Make a request',
    icon: <Globe className="w-4 h-4" />,
  },
  {
    type: 'discord',
    title: 'Discord',
    description: 'Send a Message',
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    type: 'response',
    title: 'Response',
    description: 'Configure response',
    icon: <Reply className="w-4 h-4" />,
  }
];

// Export node components for ReactFlow
export const nodeTypes = {
  create: NodeCreate,
  webhook: NodeWebhook,
  http: NodeHttp,
  discord: NodeDiscord,
  response: NodeResponse,
};
