import { Reply } from 'lucide-react';
import { NodeBase } from '../NodeBase';
import { memo } from 'react';
import { NodeResponseConfigForm } from './NodeResponseConfigForm';
import { ResponseNodeConfig } from './types';

interface NodeData {
  config?: ResponseNodeConfig;
  shortId?: string;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeResponse = memo(({ id, data }: NodeProps) => {
  return (
    <NodeBase
      id={id}
      title="Response"
      description="Return a json data"
      icon={<Reply className="w-8 h-8" />}
      color="#eeb71d"
      type="response"
      badgeNumber={1}
      shortId={data.shortId}
      popoverContent={<NodeResponseConfigForm nodeId={id} />}
      popoverTitle="Configure Response"
    />
  );
});

NodeResponse.displayName = 'NodeResponse';
