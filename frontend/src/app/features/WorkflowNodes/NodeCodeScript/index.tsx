import { memo } from 'react';
import { Braces } from 'lucide-react';
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
      icon={<Braces className="w-8 h-8" />}
      color="#84d24a"
      type="code-script"
      badgeNumber={1}
      shortId={data.shortId}
      popoverContent={<NodeCodeScriptConfigForm nodeId={id} />}
      popoverTitle="Configure Code Script"
    />
  );
});

NodeCodeScript.displayName = 'NodeCodeScript';




















