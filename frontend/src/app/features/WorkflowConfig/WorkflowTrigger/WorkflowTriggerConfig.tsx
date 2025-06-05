import { useEffect, useState } from 'react';
import { TriggerType, type TriggerConfig } from './types';
import { WorkflowTriggerConfigContent } from './WorkflowTriggerConfigContent';
import { Loader2 } from 'lucide-react';
import { useWorkflowStore } from '../../WorkflowDetail/store';

interface WorkflowTriggerConfigProps {
  workflowId: string;
}

export function WorkflowTriggerConfig({ workflowId }: WorkflowTriggerConfigProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<TriggerConfig>();
  const { triggerType, triggerValue } = useWorkflowStore();

  useEffect(() => {
    try {
      let parsedConfig: TriggerConfig = {
        type: triggerType || TriggerType.WEBHOOK
      };

      if (triggerType === TriggerType.SCHEDULED && triggerValue) {
        parsedConfig.scheduleConfig = JSON.parse(triggerValue);
      }

      setConfig(parsedConfig);
    } catch (error) {
      console.error('Error parsing trigger config:', error);
    } finally {
      setIsLoading(false);
    }
  }, [triggerType, triggerValue]);

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  return (
    <WorkflowTriggerConfigContent
      workflowId={workflowId}
      initialConfig={config}
    />
  );
}
