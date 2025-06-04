import { useEffect, useState } from 'react';
import { getNodeConfig } from '@/app/services/node.service';
import { Loader2 } from 'lucide-react';
import { NodeHttpConfigFormContent } from './NodeHttpConfigFormContent';
import { HttpNodeConfig } from './types';

interface NodeHttpConfigFormProps {
  nodeId: string;
}

export function NodeHttpConfigForm({
  nodeId
}: NodeHttpConfigFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<HttpNodeConfig>();

  useEffect(() => {
    async function loadNodeConfig() {
      try {
        const response = await getNodeConfig(nodeId);
        if (response.success) {
          const { config: responseConfig } = response.config;
          setConfig(responseConfig as HttpNodeConfig);
        }
      } catch (error) {
        console.error('Error loading node config:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadNodeConfig();
  }, [nodeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <NodeHttpConfigFormContent
      nodeId={nodeId}
      initialConfig={config}
    />
  );
}
