import { Webhook as WebhookIcon } from 'lucide-react';
import { NodeBase } from '../NodeBase';
import { memo } from 'react';
import { NodeConfigPopover } from '../../WorkflowConfig/NodeConfigPopover';
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
    <NodeConfigPopover
      trigger={
        <div>
          <NodeBase
            id={id}
            title="Webhook"
            description="Trigger by webhook"
            icon={<WebhookIcon className="w-8 h-8" />}
            color="#e31c7b"
            type="webhook"
            badgeNumber={1}
            shortId={data.shortId}
          />
        </div>
      }
      title="Configure Webhook"
    >
      <NodeWebhookConfigForm
        nodeId={id}
      />
    </NodeConfigPopover>
  );
});

NodeWebhook.displayName = 'NodeWebhook';
