import { useState } from 'react';
import { TriggerType, type TriggerConfig } from '@/app/types/workflow';
import { useWorkflowStore } from '../../WorkflowDetail/store';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { WebhookUrlDisplay } from './WebhookUrlDisplay';
import { getNodeConfig } from '@/app/services/node.service';
import { NodeConfigPopoverCloseButton } from '../NodeConfigPopoverCloseButton';

interface WorkflowTriggerConfigContentProps {
  workflowId: string;
  nodeId: string;
  nodeType: string;
  initialConfig?: TriggerConfig;
}

export function WorkflowTriggerConfigContent({
  workflowId,
  nodeId,
  nodeType,
  initialConfig
}: WorkflowTriggerConfigContentProps) {
  const [triggerType, setTriggerType] = useState<TriggerType>(
    initialConfig?.type || TriggerType.WEBHOOK
  );
  const [minutes, setMinutes] = useState(
    initialConfig?.minutes?.toString() || ''
  );
  const [time, setTime] = useState(
    initialConfig?.time || ''
  );

  const updateWorkflowTrigger = useWorkflowStore(state => state.updateWorkflowTrigger);

  const handleSave = async () => {
    try {
      let triggerValue: string | undefined;

      if (triggerType === TriggerType.WEBHOOK) {
        const response = await getNodeConfig(nodeId);
        const config = response.config.config;
        console.log('config', config)
        if (response.success && config.webhookId) {
          triggerValue = config.webhookId;
        }
      } else if (triggerType === TriggerType.REGULAR) {
        triggerValue = minutes;
      } else if (triggerType === TriggerType.DAILY) {
        triggerValue = time;
      }

      await updateWorkflowTrigger({
        workflowId,
        triggerType,
        triggerValue
      });

      toast.success('Trigger configuration saved');
    } catch (error) {
      console.error('Error saving trigger config:', error);
      toast.error('Failed to save trigger configuration');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Trigger Type</Label>
        <Select
          value={triggerType}
          onValueChange={(value) => setTriggerType(value as TriggerType)}
        >
          <SelectTrigger className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {nodeType === 'webhook' && (
              <SelectItem value={TriggerType.WEBHOOK}>Webhook</SelectItem>
            )}
            <SelectItem disabled value={TriggerType.REGULAR}>At regular intervals</SelectItem>
            <SelectItem disabled value={TriggerType.DAILY}>Every day</SelectItem>
            <SelectItem disabled value={TriggerType.CUSTOM}>Custom</SelectItem>

          </SelectContent>
        </Select>
      </div>

      {triggerType === TriggerType.REGULAR && (
        <div className="space-y-2">
          <Label>Minutes</Label>
          <Input
            type="number"
            value={minutes}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value > 0) {
                setMinutes(value.toString());
              }
            }}
            placeholder="Enter minutes"
            min={1}
          />
          <p className="text-xs text-muted-foreground">
            The time interval in which the scenario should be repeated (in minutes).
          </p>
        </div>
      )}

      {triggerType === TriggerType.WEBHOOK && <WebhookUrlDisplay nodeId={nodeId} workflowId={workflowId} />}

      {triggerType === TriggerType.DAILY && (
        <div className="space-y-2">
          <Label>Time</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="HH:mm"
          />
          <p className="text-xs text-muted-foreground">
            Time zone: Asia/Bangkok
            <br />
            Format: HH:mm
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 space-x-2">
        <NodeConfigPopoverCloseButton />
        <Button 
          onClick={handleSave}
          disabled={triggerType === TriggerType.REGULAR && !minutes || triggerType === TriggerType.DAILY && !time}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
