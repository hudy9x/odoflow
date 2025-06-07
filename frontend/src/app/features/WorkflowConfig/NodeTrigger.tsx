import { useWorkflowStore } from '../WorkflowDetail/store';
import { Zap } from 'lucide-react';
import { NodeConfigPopover } from './NodeConfigPopover';
import { WorkflowTriggerConfig } from './WorkflowTrigger/WorkflowTriggerConfig';

interface NodeTriggerProps {
  nodeId: string;
  nodeType: string;
}

export function NodeTrigger({ nodeId, nodeType }: NodeTriggerProps) {
  const { startingNodeId, workflowId } = useWorkflowStore();
  
  if (nodeId !== startingNodeId || !workflowId) {
    return null;
  }

  return (
    <NodeConfigPopover
      trigger={
        <div 
          className="absolute -bottom-2 -left-6 bg-primary text-primary-foreground rounded-full border-4 border-white p-1 cursor-pointer"
          title="Configure Trigger"
        >
          <Zap className="h-8 w-8 p-2" />
        </div>
      }
      title="Configure Workflow Trigger"
      width="w-[400px]"
    >
      <WorkflowTriggerConfig
        workflowId={workflowId}
        nodeId={nodeId}
        nodeType={nodeType}
      />
    </NodeConfigPopover>
  );
}
