export enum MessageType {
  SIMPLE = 'simple',
  EMBED = 'embed'
}

export enum EmbedFieldType {
  TITLE = 'title',
  DESCRIPTION = 'description',
  FIELDS = 'fields',
  AUTHOR = 'author',
  FOOTER = 'footer',
  THUMBNAIL = 'thumbnail'
}

export interface EmbedField {
  id: string;
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
}

export interface EmbedFooter {
  text: string;
  icon_url?: string;
}

export interface EmbedThumbnail {
  url: string;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: EmbedField[];
  author?: EmbedAuthor;
  footer?: EmbedFooter;
  thumbnail?: EmbedThumbnail;
}

export interface DiscordNodeConfig {
  webhookUrl: string;
  username?: string;
  avatarUrl?: string;
  messageType: MessageType;
  content?: string;
  tts?: boolean;
  embeds?: DiscordEmbed[];
}
