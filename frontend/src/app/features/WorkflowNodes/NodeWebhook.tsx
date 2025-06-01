import { Webhook } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { memo } from 'react';
import { NodeConfigPopover } from './NodeConfigPopover';

interface NodeData {
  // Add webhook specific data fields here
  url?: string;
  method?: string;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeWebhook = memo(({ id }: NodeProps) => {
  return (
    <NodeConfigPopover
      trigger={
        <div>
          <NodeBase
            id={id}
            title="Webhook"
            description="Receive a request"
            icon={<Webhook className="w-8 h-8" />}
            color="#0284C7"
            badgeNumber={1}
          />
        </div>
      }
      title="Configure Webhook"
    >
      {/* Add Webhook configuration form here */}
    </NodeConfigPopover>
  );
});

NodeWebhook.displayName = 'NodeWebhook';
