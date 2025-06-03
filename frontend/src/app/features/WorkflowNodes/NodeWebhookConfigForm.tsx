import { Button } from '@/components/ui/button';
import { CreateWebhookPopover } from '@/app/features/Webhook/CreateWebhookPopover';
import { WebhookSelect } from '@/app/features/Webhook/WebhookSelect';
import { useState } from 'react';

interface NodeWebhookConfigFormProps {
  selectedWebhookId?: string;
}

export function NodeWebhookConfigForm({
  selectedWebhookId
}: NodeWebhookConfigFormProps) {
  const [webhookUrl, setWebhookUrl] = useState<string>();



  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <WebhookSelect
            value={selectedWebhookId}
            onValueChange={(id, url) => {
              setWebhookUrl(url);
              // Will handle saving later
              console.log('Selected webhook:', { id, url });
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
          onClick={() => {
            // Will handle saving later
            console.log('Save clicked with webhook:', selectedWebhookId);
          }}
          disabled={!selectedWebhookId}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
