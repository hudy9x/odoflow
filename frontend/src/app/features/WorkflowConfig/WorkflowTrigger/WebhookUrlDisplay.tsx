import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { getNodeConfig } from '@/app/services/node.service';

interface WebhookUrlDisplayProps {
  nodeId: string;
}

export function WebhookUrlDisplay({ nodeId }: WebhookUrlDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState<string>();

  useEffect(() => {
    async function loadNodeConfig() {
      try {
        const response = await getNodeConfig(nodeId);
        const config = response.config.config;
        if (response.success) {
          setWebhookUrl(config.webhookUrl);
        }
      } catch (error) {
        console.error('Error loading webhook URL:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadNodeConfig();
  }, [nodeId]);

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  return (
    <div className="space-y-2">
      <Label>Webhook URL</Label>
      <Input
        type="text"
        value={webhookUrl}
        disabled
      />
      <p className="text-xs text-muted-foreground">
        Send a POST request to this URL to trigger your workflow.
      </p>
    </div>
  );
}
