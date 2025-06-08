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
  shortId?: string;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeHttp = memo(({ id, data }: NodeProps) => {
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
            color="#0284C7"
            type="http"
            badgeNumber={1}
            shortId={data.shortId}
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
