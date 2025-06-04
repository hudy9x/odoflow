import { Globe } from 'lucide-react';
import { NodeBase } from '../NodeBase';
import { memo } from 'react';
import { NodeConfigPopover } from '../../WorkflowConfig/NodeConfigPopover';
import { NodeHttpConfigForm } from './NodeHttpConfigForm';

interface NodeData {
  config?: {
    url?: string;
    method?: string;
    queryParams?: Record<string, string>;
    headers?: Record<string, string>;
    bodyType?: 'empty' | 'raw' | 'x-www-form-urlencoded';
    body?: {
      contentType?: 'text/plain' | 'application/json' | 'application/xml' | 'text/xml' | 'text/html' | 'custom';
      customContentType?: string;
      requestContent?: string;
    };
    formData?: Record<string, string>;
  };
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeHttp = memo(({ id }: NodeProps) => {
  return (
    <NodeConfigPopover
      width='w-[400px]'
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
      <NodeHttpConfigForm nodeId={id} />
    </NodeConfigPopover>
  );
});

NodeHttp.displayName = 'NodeHttp';
