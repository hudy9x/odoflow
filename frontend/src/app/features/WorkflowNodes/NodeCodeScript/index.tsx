import { memo } from 'react';
import { Code2 } from 'lucide-react';
import { NodeBase } from '../NodeBase';

import { NodeCodeScriptConfigForm } from './NodeCodeScriptConfigForm';
import { NodeData } from './types';

interface Props {
  id: string;
  data: NodeData;
}

export const NodeCodeScript = memo(({ id, data }: Props) => {
  return (
    <NodeBase
      id={id}
      title="Code Script"
      description="Execute JS code"
      icon={<Code2 className="w-8 h-8" />}
      color="#F7DF1E"
      type="code-script"
      badgeNumber={1}
      shortId={data.shortId}
      popoverContent={<NodeCodeScriptConfigForm nodeId={id} />}
      popoverTitle="Configure Code Script"
    />
  );
});

NodeCodeScript.displayName = 'NodeCodeScript';




















