import { Loader2 } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { getNodeConfig } from '../../../services/node.service';
import type { ResponseNodeConfig } from './types';
import { NodeResponseConfigFormContent } from '../NodeResponse/NodeResponseConfigFormContent';

interface Props {
  nodeId: string;
}

export const NodeResponseConfigForm = memo(function NodeResponseConfigForm({ nodeId }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<ResponseNodeConfig>();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await getNodeConfig(nodeId);
        const config = response?.config?.config as ResponseNodeConfig;
        console.log('config', config)
        setConfig({
          statusCode: config?.statusCode || '',
          headers: config?.headers || [],
          responseData: config?.responseData || ""
        });
      } catch (error) {
        console.error('Failed to load response node config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [nodeId]);

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  return <NodeResponseConfigFormContent nodeId={nodeId} initialConfig={config} />;
});

NodeResponseConfigForm.displayName = 'NodeResponseConfigForm';
