import { Button } from '@/components/ui/button';
import { memo } from 'react';
import { useWorkflowStore } from '../WorkflowDetail/store';
import { generateId } from '@/lib/utils';

export const nodeTypes = [
  { type: 'webhook', title: 'Webhook', description: 'Custom webhook' },
  { type: 'http', title: 'HTTP', description: 'Make a request' },
  { type: 'discord', title: 'Discord', description: 'Send a Message' },
] as const;

interface NodeTypeListProps {
  onAdd?: () => void; // Optional callback when a node is added
}

export const NodeTypeList = memo(({ onAdd }: NodeTypeListProps) => {
  const { addNode } = useWorkflowStore();

  const handleAddNode = (type: string) => {
    // Create a new node with a unique ID and random position offset
    const newNode = {
      id: generateId('node'),
      type,
      position: {
        x: Math.random() * 100 + 300, // Random X between 300-400
        y: Math.random() * 100 + 100, // Random Y between 100-200
      },
      data: {}
    };

    addNode(newNode);
    onAdd?.(); // Call the optional callback if provided
  };
  return (
    <div className="grid gap-2 min-w-[200px]">
      {nodeTypes.map((node) => (
        <Button
          key={node.type}
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => handleAddNode(node.type)}
        >
          {node.title} - {node.description}
        </Button>
      ))}
    </div>
  );
});

NodeTypeList.displayName = 'NodeTypeList';
