import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWebhookStore } from './store';

interface WebhookSelectProps {
  value?: string;
  onValueChange: (value: string, url: string) => void;
}

export function WebhookSelect({ value, onValueChange }: WebhookSelectProps) {
  const { webhooks, loadWebhooks } = useWebhookStore();

  useEffect(() => {
    loadWebhooks();
  }, [loadWebhooks]);

  return (
    <Select 
      value={value} 
      onValueChange={(id) => {
        const webhook = webhooks.find(w => w.id === id);
        if (webhook) {
          onValueChange(id, webhook.url);
        }
      }}>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select a webhook" />
      </SelectTrigger>
      <SelectContent>
        {webhooks.map((webhook) => (
          <SelectItem key={webhook.id} value={webhook.id}>
            {webhook.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
