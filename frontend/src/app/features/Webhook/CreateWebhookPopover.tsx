import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import { useWebhookStore } from './store';

export function CreateWebhookPopover() {
  const [newWebhookName, setNewWebhookName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { createWebhook, isLoading } = useWebhookStore();

  const handleCreateWebhook = async () => {
    if (!newWebhookName) return;
    
    const success = await createWebhook(newWebhookName);
    if (success) {
      setNewWebhookName('');
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-name">Webhook Name</Label>
            <Input
              id="webhook-name"
              placeholder="Enter webhook name"
              value={newWebhookName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewWebhookName(e.target.value)}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleCreateWebhook}
            disabled={!newWebhookName || isLoading}
          >
            Create Webhook
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
