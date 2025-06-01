import { Globe } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { memo } from 'react';

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
    <Dialog>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure HTTP Request</DialogTitle>
        </DialogHeader>
        {/* Add HTTP configuration form here */}
      </DialogContent>
    </Dialog>
  );
});

NodeHttp.displayName = 'NodeHttp';
