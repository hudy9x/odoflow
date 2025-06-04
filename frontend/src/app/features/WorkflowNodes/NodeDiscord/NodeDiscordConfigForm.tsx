import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getNodeConfig } from '@/app/services/node.service';
import { NodeDiscordConfigFormContent } from './NodeDiscordConfigFormContent';
import { DiscordNodeConfig, MessageType, DiscordEmbed } from './types';

interface NodeDiscordConfigFormProps {
  nodeId: string;
}

export function NodeDiscordConfigForm({ nodeId }: NodeDiscordConfigFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<DiscordNodeConfig>();

  useEffect(() => {
    async function loadNodeConfig() {
      try {
        const response = await getNodeConfig(nodeId);
        if (response.success) {
          const { config: responseConfig } = response.config;
          setConfig({
            webhookUrl: (responseConfig?.webhookUrl as string) || '',
            messageType: (responseConfig?.messageType as MessageType) || MessageType.SIMPLE,
            username: (responseConfig?.username as string) || '',
            avatarUrl: (responseConfig?.avatarUrl as string) || '',
            content: (responseConfig?.content as string) || '',
            tts: (responseConfig?.tts as boolean) || false,
            embeds: (responseConfig?.embeds as DiscordEmbed[]) || []
          } as DiscordNodeConfig);
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

  return <NodeDiscordConfigFormContent nodeId={nodeId} initialConfig={config} />;
}
