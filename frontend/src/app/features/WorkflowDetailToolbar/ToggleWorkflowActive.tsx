import { useWorkflowStore } from '../WorkflowDetail/store';
import { toggleWorkflowActive } from '@/app/services/workflow.service';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ToggleWorkflowActive() {
  const workflowId = useWorkflowStore(state => state.workflowId);
  const nodes = useWorkflowStore(state => state.nodes);
  const startingNodeId = useWorkflowStore(state => state.startingNodeId);
  const triggerType = useWorkflowStore(state => state.triggerType);
  const isActive = useWorkflowStore(state => state.isActive);
  const setInitialData = useWorkflowStore(state => state.setInitialData);

  const handleToggle = async (checked: boolean) => {
    try {
      // Don't allow activation if no nodes or no starting node
      if (checked && (!nodes.length || !startingNodeId || !triggerType)) {
        console.log(nodes, startingNodeId, triggerType)
        toast.error('Cannot activate: Add nodes and set a starting node with trigger configuration first');
        return;
      }

      const response = await toggleWorkflowActive({
        workflowId: workflowId!,
        active: checked
      });

      if (response.success) {
        // Update store with new active status
        setInitialData(
          nodes,
          useWorkflowStore.getState().edges,
          startingNodeId,
          triggerType,
          useWorkflowStore.getState().triggerValue,
          checked
        );
        toast.success(`Workflow ${checked ? 'activated' : 'deactivated'}`);
      } else {
        throw new Error(response.error || 'Failed to toggle workflow status');
      }
    } catch (error) {
      console.error('Error toggling workflow status:', error);
      toast.error('Failed to toggle workflow status');
    }
  };

  return (
    <div className="flex items-center space-x-2 px-2">
      <Switch
        id="workflow-active"
        checked={isActive}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="workflow-active">Active</Label>
    </div>
  );
}
