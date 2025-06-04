import { MessageSquare } from 'lucide-react';
import { NodeBase } from '../NodeBase';
import { memo } from 'react';
import { NodeConfigPopover } from '../../WorkflowConfig/NodeConfigPopover';
import { NodeDiscordConfigForm } from './NodeDiscordConfigForm';
import { DiscordNodeConfig } from './types';

interface NodeData {
  id: string;
  config?: DiscordNodeConfig;
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
      width="w-[450px]"
    >
      <NodeDiscordConfigForm nodeId={id} />
    </NodeConfigPopover>
  );
});

NodeDiscord.displayName = 'NodeDiscord';
