import { Webhook as WebhookIcon } from 'lucide-react';
import { NodeBase } from '../NodeBase';
import { memo } from 'react';
import { NodeWebhookConfigForm } from './NodeWebhookConfigForm';

interface NodeData {
  webhookId?: string;
  url?: string;
  shortId?: string;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeWebhook = memo(({ id, data }: NodeProps) => {
  return (
    <NodeBase
      id={id}
      title="Webhook"
      description="Trigger by webhook"
      icon={<WebhookIcon className="w-8 h-8" />}
      color="#e31c7b"
      type="webhook"
      badgeNumber={1}
      shortId={data.shortId}
      popoverContent={<NodeWebhookConfigForm nodeId={id} />}
      popoverTitle="Configure Webhook"
    />
  );
});

NodeWebhook.displayName = 'NodeWebhook';
