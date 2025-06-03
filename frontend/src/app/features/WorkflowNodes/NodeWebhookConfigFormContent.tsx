import { Button } from '@/components/ui/button';
import { CreateWebhookPopover } from '@/app/features/Webhook/CreateWebhookPopover';
import { WebhookSelect } from '@/app/features/Webhook/WebhookSelect';
import { useState } from 'react';
import { getNodeConfig, updateNodeConfig } from '@/app/services/node.service';
import { toast } from 'sonner';

interface NodeWebhookConfigFormContentProps {
  nodeId: string;
  initialWebhookId?: string;
  initialWebhookUrl?: string;
}

export function NodeWebhookConfigFormContent({
  nodeId,
  initialWebhookId,
  initialWebhookUrl
}: NodeWebhookConfigFormContentProps) {
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [selectedWebhookId, setSelectedWebhookId] = useState(initialWebhookId);

  const handleSave = async () => {
    if (!selectedWebhookId) return;
    
    try {
      const webhook = await getNodeConfig(nodeId);
      if (!webhook.success) {
        console.error('Failed to get webhook URL');
        return;
      }

      const response = await updateNodeConfig({
        nodeId,
        webhookId: selectedWebhookId,
        webhookUrl: webhook.config.webhookUrl || ''
      });

      if (response.success) {
        setSelectedWebhookId(response.config.webhookId);
        setWebhookUrl(response.config.webhookUrl);
        toast.success('Webhook config saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save webhook config')
      console.error('Error saving webhook config:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <WebhookSelect
            value={selectedWebhookId}
            onValueChange={(id, url) => {
              setWebhookUrl(url);
              setSelectedWebhookId(id);
            }}
          />
          <CreateWebhookPopover />
        </div>
        {webhookUrl && (
          <div className="text-sm text-muted-foreground">
            {webhookUrl}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!selectedWebhookId}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
