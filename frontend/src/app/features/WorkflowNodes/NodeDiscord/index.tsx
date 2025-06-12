import { NodeBase } from '../NodeBase';
import { memo } from 'react';
import { NodeDiscordConfigForm } from './NodeDiscordConfigForm';
import { DiscordNodeConfig } from './types';
import { nodeIconMap } from '../NodeIcons';

interface NodeData {
  id: string;
  config?: DiscordNodeConfig;
  shortId?: string;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}
const DiscordIcon = nodeIconMap.discord.icon;

export const NodeDiscord = memo(({ id, data }: NodeProps) => {
  return (
    <NodeBase
      id={id}
      title="Discord"
      description="Send a Message"
      icon={<DiscordIcon className="w-8 h-8" />}
      color={nodeIconMap.discord.bg}
      type="discord"
      badgeNumber={1}
      shortId={data.shortId}
      popoverContent={<NodeDiscordConfigForm nodeId={id} />}
      popoverTitle="Configure Discord Message"
    />
  );
});

NodeDiscord.displayName = 'NodeDiscord';
