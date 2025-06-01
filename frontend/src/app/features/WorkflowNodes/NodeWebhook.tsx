import { Webhook } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { memo } from 'react';

interface NodeData {
  // Add webhook specific data fields here
  url?: string;
  method?: string;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeWebhook = memo(({ id }: NodeProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <NodeBase
            id={id}
            title="Webhook"
            description="Trigger events"
            icon={<Webhook className="w-8 h-8" />}
            color="#2563eb"
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Webhook</DialogTitle>
        </DialogHeader>
        {/* Add webhook configuration form here */}
      </DialogContent>
    </Dialog>
  );
});

NodeWebhook.displayName = 'NodeWebhook';
