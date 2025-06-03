import { useEffect, useState } from 'react';
import { getNodeConfig } from '@/app/services/node.service';
import { Loader2 } from 'lucide-react';
import { NodeWebhookConfigFormContent } from './NodeWebhookConfigFormContent';

interface NodeWebhookConfigFormProps {
  nodeId: string;
  selectedWebhookId?: string;
}

export function NodeWebhookConfigForm({
  nodeId,
  selectedWebhookId: initialWebhookId
}: NodeWebhookConfigFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState<string>();
  const [selectedWebhookId, setSelectedWebhookId] = useState(initialWebhookId);

  useEffect(() => {
    async function loadNodeConfig() {
      try {
        const response = await getNodeConfig(nodeId);
        if (response.success && response.config) {
          setSelectedWebhookId(response.config.webhookId);
          setWebhookUrl(response.config.webhookUrl);
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
      initialWebhookId={selectedWebhookId}
      initialWebhookUrl={webhookUrl}
    />
  );
}
