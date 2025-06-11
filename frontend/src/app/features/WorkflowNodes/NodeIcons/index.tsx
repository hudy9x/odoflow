import { Globe, Webhook as WebhookIcon, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DiscordIcon from './DiscordIcon';

// You can add SVG imports here if you need custom SVGs for other node types

export interface NodeIconMeta {
  icon: LucideIcon;
  bg: string; // Tailwind background color class
  color: string; // Tailwind text color class
}

export const nodeIconMap: Record<string, NodeIconMeta> = {
  discord: {
    icon: DiscordIcon,
    bg: '#5865F2',
    color: '#E0E3FF',
  },
  http: {
    icon: Globe,
    bg: '#0284C7',
    color: '#fff',
  },
  webhook: {
    icon: WebhookIcon,
    bg: '#e31c7b',
    color: '#fff',
  },
};

// Default for unknown types
export const defaultNodeIconMeta: NodeIconMeta = {
  icon: FileText,
  bg: 'bg-blue-50',
  color: 'text-blue-500',
};
