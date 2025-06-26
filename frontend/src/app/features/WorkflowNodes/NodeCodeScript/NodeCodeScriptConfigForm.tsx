import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { NodeCodeScriptConfig } from './types';
import { getNodeConfig } from '@/app/services/node.service';
import { NodeCodeScriptConfigFormContent } from './NodeCodeScriptConfigFormContent';

interface Props {
  nodeId: string;
}

export function NodeCodeScriptConfigForm({ nodeId }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<NodeCodeScriptConfig>();

  useEffect(() => {
    async function loadNodeConfig() {
      try {
        const response = await getNodeConfig(nodeId);
        if (response.success) {
          setConfig(response.config.config);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNodeConfig();
  }, [nodeId]);

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;

  return <NodeCodeScriptConfigFormContent nodeId={nodeId} initialConfig={config} />;
}
