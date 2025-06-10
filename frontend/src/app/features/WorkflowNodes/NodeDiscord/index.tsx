import { MessageSquare } from 'lucide-react';
import { NodeBase } from '../NodeBase';
import { memo } from 'react';
import { NodeDiscordConfigForm } from './NodeDiscordConfigForm';
import { DiscordNodeConfig } from './types';

interface NodeData {
  id: string;
  config?: DiscordNodeConfig;
  shortId?: string;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeDiscord = memo(({ id, data }: NodeProps) => {
  return (
    <NodeBase
      id={id}
      title="Discord"
      description="Send a Message"
      icon={<MessageSquare className="w-8 h-8" />}
      color="#5865F2"
      type="discord"
      badgeNumber={1}
      shortId={data.shortId}
      popoverContent={<NodeDiscordConfigForm nodeId={id} />}
      popoverTitle="Configure Discord Message"
    />
  );
});

NodeDiscord.displayName = 'NodeDiscord';
