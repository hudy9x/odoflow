import { Plus } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { memo } from 'react';

export const NodeCreate = memo(() => {
  const nodeTypes = [
    { type: 'webhook', title: 'Webhook', description: 'Custom webhook' },
    { type: 'http', title: 'HTTP', description: 'Make a request' },
    { type: 'discord', title: 'Discord', description: 'Send a Message' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <NodeBase
            noEdges={true}
            title="Add Node"
            description="Click to add"
            icon={<Plus className="w-8 h-8" />}
            color="#4B5563"
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Node Type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {nodeTypes.map((node) => (
            <Button
              key={node.type}
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // Handle node creation here
                console.log(`Creating ${node.type} node`);
              }}
            >
              {node.title} - {node.description}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
});

NodeCreate.displayName = 'NodeCreate';
