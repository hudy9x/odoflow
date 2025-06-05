import { useWorkflowStore } from '../WorkflowDetail/store';
import { Zap } from 'lucide-react';
import { NodeConfigPopover } from './NodeConfigPopover';
import { WorkflowTriggerConfig } from './WorkflowTrigger/WorkflowTriggerConfig';

interface NodeTriggerProps {
  nodeId: string;
}

export function NodeTrigger({ nodeId }: NodeTriggerProps) {
  const { startingNodeId, workflowId } = useWorkflowStore();
  
  if (nodeId !== startingNodeId || !workflowId) {
    return null;
  }

  return (
    <NodeConfigPopover
      trigger={
        <div 
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
          title="Configure Trigger"
        >
          <Zap className="h-3 w-3" />
        </div>
      }
      title="Configure Workflow Trigger"
      width="w-[400px]"
    >
      <WorkflowTriggerConfig workflowId={workflowId} />
    </NodeConfigPopover>
  );
}
