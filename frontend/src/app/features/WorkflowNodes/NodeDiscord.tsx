import { MessageSquare } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { memo } from 'react';
import { NodeConfigPopover } from '../WorkflowConfig/NodeConfigPopover';

interface NodeData {
  // Add Discord specific data fields here
  webhookUrl?: string;
  message?: string;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeDiscord = memo(({ id }: NodeProps) => {
  return (
    <NodeConfigPopover
      trigger={
        <div>
          <NodeBase
            id={id}
            title="Discord"
            description="Send a Message"
            icon={<MessageSquare className="w-8 h-8" />}
            color="#7C3AED"
            badgeNumber={1}
          />
        </div>
      }
      title="Configure Discord Message"
    >
      {/* Add Discord configuration form here */}
    </NodeConfigPopover>
  );
});

NodeDiscord.displayName = 'NodeDiscord';
