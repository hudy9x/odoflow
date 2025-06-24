import { Globe, MessageSquare, Reply, Webhook, Braces } from 'lucide-react';
import { NodeCreate } from './NodeCreate';
import { NodeWebhook } from './NodeWebhook';
import { NodeHttp } from './NodeHttp';
import { NodeDiscord } from './NodeDiscord';
import { NodeResponse } from './NodeResponse';
import { NodeCodeScript } from './NodeCodeScript';

// Node type configuration with metadata
export const nodeTypeConfig = [
  {
    type: 'code-script',
    title: 'Code Script',
    description: 'Execute JavaScript code',
    icon: <Braces className="w-4 h-4" />,
  },
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
  'code-script': NodeCodeScript,
  create: NodeCreate,
  webhook: NodeWebhook,
  http: NodeHttp,
  discord: NodeDiscord,
  response: NodeResponse,
};
