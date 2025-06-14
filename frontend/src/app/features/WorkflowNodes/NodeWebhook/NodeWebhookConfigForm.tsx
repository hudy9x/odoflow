import { useEffect, useState } from 'react';
import { getNodeConfig } from '@/app/services/node.service';
import { Loader2 } from 'lucide-react';
import { NodeWebhookConfigFormContent } from './NodeWebhookConfigFormContent';

interface NodeWebhookConfigFormProps {
  nodeId: string;
}

export function NodeWebhookConfigForm({
  nodeId
}: NodeWebhookConfigFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState<string>();
  const [webhookId, setWebhookId] = useState<string>();

  useEffect(() => {
    async function loadNodeConfig() {
      try {
        const response = await getNodeConfig(nodeId);
        const config = response?.config?.config
        console.log('response', response, config)
        if (response.success && config) {
          const webhookUrl = config.webhookUrl as string | undefined;
          const webhookId = config.webhookId as string | undefined;
          setWebhookUrl(webhookUrl);
          setWebhookId(webhookId);
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
    <NodeWebhookConfigFormContent
      nodeId={nodeId}
      initialWebhookId={webhookId}
      initialWebhookUrl={webhookUrl}
    />
  );
}
