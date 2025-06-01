import { Globe } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { memo } from 'react';

export const NodeHttp = memo(() => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <NodeBase
            title="HTTP"
            description="Make a request"
            icon={<Globe className="w-8 h-8" />}
            color="#2563EB"
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
