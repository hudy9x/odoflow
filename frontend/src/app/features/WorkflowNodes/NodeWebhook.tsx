import { Webhook as WebhookIcon } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { memo } from 'react';
import { NodeConfigPopover } from '../WorkflowConfig/NodeConfigPopover';
import { NodeWebhookConfigForm } from './NodeWebhookConfigForm';

interface NodeData {
  webhookId?: string;
  url?: string;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeWebhook = memo(({ id, data }: NodeProps) => {
  return (
    <NodeConfigPopover
      trigger={
        <div>
          <NodeBase
            id={id}
            title="Webhook"
            description="Receive a request"
            icon={<WebhookIcon className="w-8 h-8" />}
            color="#0284C7"
            badgeNumber={1}
          />
        </div>
      }
      title="Configure Webhook"
    >
      <NodeWebhookConfigForm
        nodeId={id}
        selectedWebhookId={data.webhookId}
      />
    </NodeConfigPopover>
  );
});

NodeWebhook.displayName = 'NodeWebhook';
