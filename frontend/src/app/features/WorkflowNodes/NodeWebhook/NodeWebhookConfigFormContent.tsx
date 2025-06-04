import { Button } from '@/components/ui/button';
import { CreateWebhookPopover } from '@/app/features/Webhook/CreateWebhookPopover';
import { WebhookSelect } from '@/app/features/Webhook/WebhookSelect';
import { WebhookUrlDisplay } from '@/app/features/Webhook/WebhookUrlDisplay';
import { useState } from 'react';
import { updateNodeConfig } from '@/app/services/node.service';
import { toast } from 'sonner';
import { NodeConfigPopoverCloseButton } from '../../WorkflowConfig/NodeConfigPopoverCloseButton';

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

      const response = await updateNodeConfig({
        nodeId,
        config: {
          webhookId: selectedWebhookId,
          webhookUrl: webhookUrl || ''
        }
      });

      if (response.success) {
        toast.success('Webhook config saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save webhook config')
      console.error('Error saving webhook config:', error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className=''>
        <label className="text-sm font-medium block mb-1">Select or create a webhook url</label>
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
        </div>
        
        {webhookUrl && (
          <WebhookUrlDisplay url={webhookUrl} />
        )}
      </div>
      <div className="grid grid-cols-2 space-x-2">
        <NodeConfigPopoverCloseButton />
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
