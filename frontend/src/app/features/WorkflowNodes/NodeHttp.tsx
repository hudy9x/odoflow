import { Globe } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { memo } from 'react';
import { NodeConfigPopover } from '../WorkflowConfig/NodeConfigPopover';

interface NodeData {
  // Add HTTP specific data fields here
  url?: string;
  method?: string;
  headers?: Record<string, string>;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeHttp = memo(({ id }: NodeProps) => {
  return (
    <NodeConfigPopover
      trigger={
        <div>
          <NodeBase
            id={id}
            title="HTTP"
            description="Make a request"
            icon={<Globe className="w-8 h-8" />}
            color="#059669"
            badgeNumber={1}
          />
        </div>
      }
      title="Configure HTTP Request"
    >
      {/* Add HTTP configuration form here */}
    </NodeConfigPopover>
  );
});

NodeHttp.displayName = 'NodeHttp';
