import { useState } from 'react';
import { TriggerType, type TriggerConfig, type ScheduleConfig } from './types';
import { useWorkflowStore } from '../../WorkflowDetail/store';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WorkflowTriggerConfigContentProps {
  workflowId: string;
  initialConfig?: TriggerConfig;
}

export function WorkflowTriggerConfigContent({
  workflowId,
  initialConfig
}: WorkflowTriggerConfigContentProps) {
  const [triggerType, setTriggerType] = useState<TriggerType>(
    initialConfig?.type || TriggerType.WEBHOOK
  );
  const [scheduleType, setScheduleType] = useState<ScheduleConfig['type']>(
    initialConfig?.scheduleConfig?.type || 'immediately'
  );
  const [minutes, setMinutes] = useState(
    initialConfig?.scheduleConfig?.minutes?.toString() || ''
  );
  const [time, setTime] = useState(
    initialConfig?.scheduleConfig?.time || ''
  );

  const updateWorkflowTrigger = useWorkflowStore(state => state.updateWorkflowTrigger);

  const handleSave = async () => {
    try {
      let triggerValue: string | undefined;

      if (triggerType === TriggerType.SCHEDULED) {
        const scheduleConfig: ScheduleConfig = {
          type: scheduleType,
          ...(scheduleType === 'regular' && { minutes: parseInt(minutes) }),
          ...(scheduleType === 'daily' && { time })
        };
        triggerValue = JSON.stringify(scheduleConfig);
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
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TriggerType.WEBHOOK}>Webhook</SelectItem>
            <SelectItem value={TriggerType.SCHEDULED}>Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {triggerType === TriggerType.SCHEDULED && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Run scenario</Label>
            <Select
              value={scheduleType}
              onValueChange={(value) => setScheduleType(value as ScheduleConfig['type'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediately">Immediately</SelectItem>
                <SelectItem value="regular">At regular intervals</SelectItem>
                <SelectItem value="daily">Every day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {scheduleType === 'regular' && (
            <div className="space-y-2">
              <Label>Minutes</Label>
              <Input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="Enter minutes"
              />
              <p className="text-xs text-muted-foreground">
                The time interval in which the scenario should be repeated (in minutes).
              </p>
            </div>
          )}

          {scheduleType === 'daily' && (
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
        </div>
      )}

      <Button className="w-full" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
}
