import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Copy } from 'lucide-react';
import { getNodeConfig } from '@/app/services/node.service';
import { toast } from 'sonner';

interface WebhookUrlDisplayProps {
  nodeId: string;
  workflowId: string;
}

export function WebhookUrlDisplay({ nodeId, workflowId }: WebhookUrlDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState<string>();

  const handleCopyUrl = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      toast.success('Webhook URL copied to clipboard');
    }
  };

  useEffect(() => {
    async function loadNodeConfig() {
      try {
        const response = await getNodeConfig(nodeId);
        const config = response.config.config || {};
        if (response.success) {
          setWebhookUrl(`${process.env.NEXT_PUBLIC_API_URL}/api/trigger/workflow-by/${config.webhookId}/${workflowId}`);
        }
      } catch (error) {
        console.error('Error loading webhook URL:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadNodeConfig();
  }, [nodeId, workflowId]);

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  return (
    <div className="space-y-2">
      <Label>Webhook URL</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={webhookUrl}
          disabled
          className="flex-1"
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleCopyUrl}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Send a POST request to this URL to trigger your workflow.
      </p>
    </div>
  );
}
