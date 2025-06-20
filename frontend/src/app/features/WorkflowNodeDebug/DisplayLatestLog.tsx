import { useEffect } from 'react';
import { getLatestWorkflowLog } from '@/app/services/workflow.logs.service';
import { useNodeDebugStore, NodeDebugData } from './store';

interface DisplayLatestLogProps {
  workflowId: string;
}

const DisplayLatestLog = ({ workflowId }: DisplayLatestLogProps) => {
  const { setInitialData } = useNodeDebugStore();

  useEffect(() => {
    const fetchLatestLog = async () => {
      try {
        const response = await getLatestWorkflowLog(workflowId);
        const {success, logs} = response
        console.log('response', response)
        if (success && logs) {
          const nodeData = logs.reduce((acc, log) => {
            acc[log.nodeId] = {
              outputData: log.outputData || {},
              error: log.error ? JSON.stringify(log.error) : undefined,
              status: log.status,
            };
            return acc;
          }, {} as Record<string, NodeDebugData>);
          setInitialData(nodeData);
        }
      } catch (error) {
        console.error('Failed to fetch latest log:', error);
      }
    };

    if (workflowId) {
      fetchLatestLog();
    }
  }, [workflowId, setInitialData]);

  return null; // This is a data-only component
};

export default DisplayLatestLog