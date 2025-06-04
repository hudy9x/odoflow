import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { updateNodeConfig } from '@/app/services/node.service';
import { toast } from 'sonner';
import { PlusCircle, X } from 'lucide-react';
import { 
  DiscordNodeConfig, 
  MessageType, 
  EmbedField,
  DiscordEmbed
} from './types';
import { NodeConfigPopoverCloseButton } from '../../WorkflowConfig/NodeConfigPopoverCloseButton';

interface NodeDiscordConfigFormContentProps {
  nodeId: string;
  initialConfig?: DiscordNodeConfig;
}

const generateKey = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function NodeDiscordConfigFormContent({
  nodeId,
  initialConfig,
}: NodeDiscordConfigFormContentProps) {
  const [webhookUrl, setWebhookUrl] = useState(initialConfig?.webhookUrl || '');
  const [username, setUsername] = useState(initialConfig?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(initialConfig?.avatarUrl || '');
  const [messageType, setMessageType] = useState<MessageType>(
    initialConfig?.messageType || MessageType.SIMPLE
  );
  const [content, setContent] = useState(initialConfig?.content || '');
  const [tts, setTts] = useState(initialConfig?.tts || false);
  
  // Embed state
  const [embed, setEmbed] = useState<DiscordEmbed>(
    initialConfig?.embeds?.[0] || {
      title: '',
      description: '',
      color: 0x000000,
      fields: []
    }
  );

  const addField = () => {
    setEmbed(prev => ({
      ...prev,
      fields: [
        ...(prev.fields || []),
        { id: generateKey(), name: '', value: '', inline: false }
      ]
    }));
  };

  const removeField = (id: string) => {
    setEmbed(prev => ({
      ...prev,
      fields: prev.fields?.filter(field => field.id !== id) || []
    }));
  };

  const updateField = (id: string, key: keyof EmbedField, value: string | boolean) => {
    setEmbed(prev => ({
      ...prev,
      fields: prev.fields?.map(field =>
        field.id === id ? { ...field, [key]: value } : field
      ) || []
    }));
  };

  const handleSave = async () => {
    try {
      const config: DiscordNodeConfig = {
        webhookUrl,
        username,
        avatarUrl,
        messageType,
        content,
        tts,
        embeds: messageType === MessageType.EMBED ? [embed] : undefined
      };

      const response = await updateNodeConfig({
        nodeId,
        config
      });

      if (response.success) {
        toast.success('Discord config saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save Discord config');
      console.error('Error saving Discord config:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Webhook URL</Label>
          <Input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="Enter Discord Webhook URL"
            required
          />
          <p className="text-xs text-muted-foreground">
            To get your Webhook URL, go to Server Settings &gt; Integrations &gt; Webhooks. 
            <a 
              href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              Learn more
            </a>
          </p>
        </div>
        {/* Basic Settings */}
        <div className="space-y-2">
          <Label>Username (Optional)</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Leave empty to use webhook default"
          />
        </div>

        <div className="space-y-2">
          <Label>Avatar URL (Optional)</Label>
          <Input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Leave empty to use webhook default"
          />
        </div>

        <div className="space-y-2">
          <Label>Message Type</Label>
          <Select 
            value={messageType} 
            onValueChange={(value) => setMessageType(value as MessageType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(MessageType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your message content"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={tts}
            onCheckedChange={setTts}
          />
          <Label>Text-to-Speech</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          If enabled, your message will be read aloud by Discord. 
          <a 
            href="https://support.discord.com/hc/en-us/articles/212517297-Text-to-Speech-101" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline"
          >
            Learn more
          </a>
        </p>

        {/* Embed Builder */}
        {messageType === MessageType.EMBED && (
          <div className="space-y-4">
            <div className="flex items-end space-x-2">
              <div className="flex-grow space-y-1">
                <Label>Embed Title</Label>
                <Input
                  value={embed.title || ''}
                  onChange={(e) => setEmbed(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter embed title"
                />
              </div>
              <div className="space-y-1">
                <Label>Color</Label>
                <Input
                  type="color"
                  className="w-10 px-2"
                  value={`#${(embed.color || 0).toString(16).padStart(6, '0')}`}
                  onChange={(e) => setEmbed(prev => ({ 
                    ...prev, 
                    color: parseInt(e.target.value.slice(1), 16)
                  }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Embed Description</Label>
              <Textarea
                value={embed.description || ''}
                onChange={(e) => setEmbed(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter embed description"
              />
            </div>

            {/* Fields */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Fields</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addField}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-4">
                {embed.fields?.map((field) => (
                  <div key={field.id} className="flex items-start space-x-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={field.name}
                        onChange={(e) => updateField(field.id, 'name', e.target.value)}
                        placeholder="Field name"
                      />
                      <Input
                        value={field.value}
                        onChange={(e) => updateField(field.id, 'value', e.target.value)}
                        placeholder="Field value"
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.inline}
                          onCheckedChange={(checked: boolean) => updateField(field.id, 'inline', checked)}
                        />
                        <Label>Inline</Label>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeField(field.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 space-x-2">
        <NodeConfigPopoverCloseButton />
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
