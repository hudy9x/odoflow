import { MessageSquare } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { memo } from 'react';

interface NodeData {
  // Add Discord specific data fields here
  webhookUrl?: string;
  message?: string;
}

export interface NodeProps {
  id: string;
  data: NodeData;
}

export const NodeDiscord = memo(({ id }: NodeProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <NodeBase
            id={id}
            title="Discord"
            description="Send a Message"
            icon={<MessageSquare className="w-8 h-8" />}
            color="#7C3AED"
            badgeNumber={1}
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Discord Message</DialogTitle>
        </DialogHeader>
        {/* Add Discord configuration form here */}
      </DialogContent>
    </Dialog>
  );
});

NodeDiscord.displayName = 'NodeDiscord';
