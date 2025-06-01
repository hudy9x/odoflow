import { Plus } from 'lucide-react';
import { NodeBase } from './NodeBase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { memo, useState } from 'react';
import { useWorkflowStore } from '../WorkflowDetail/store';

export const NodeCreate = memo(({ id }: { id: string }) => {
  const { addNode, removeNode, nodes } = useWorkflowStore();
  const [open, setOpen] = useState(false);

  const nodeTypes = [
    { type: 'webhook', title: 'Webhook', description: 'Custom webhook' },
    { type: 'http', title: 'HTTP', description: 'Make a request' },
    { type: 'discord', title: 'Discord', description: 'Send a Message' },
  ];

  const handleAddNode = (type: string) => {
    // Create a new node with a unique ID and random position offset from the create node
    const newNode = {
      id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: {
        x: Math.random() * 100 + 300, // Random X between 300-400
        y: Math.random() * 100 + 100, // Random Y between 100-200
      },
      data: {}
    };

    // If this is the only node and it's a create node, remove it
    if (nodes.length === 1 && nodes[0].type === 'create') {
      removeNode(id);
    }

    addNode(newNode);
    setOpen(false); // Close dialog after adding
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogDescription>
            Choose a node type to add to your workflow
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {nodeTypes.map((node) => (
            <Button
              key={node.type}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddNode(node.type)}
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
