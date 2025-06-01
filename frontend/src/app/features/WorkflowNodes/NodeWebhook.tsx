import { Webhook } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { memo } from 'react';

export const NodeWebhook = memo(() => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <NodeBase
            title="Webhooks"
            description="Custom webhook"
            icon={<Webhook className="w-8 h-8" />}
            color="#BE185D"
            badgeNumber={1}
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
