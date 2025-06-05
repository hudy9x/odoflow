export enum TriggerType {
  WEBHOOK = 'WEBHOOK',
  REGULAR = 'REGULAR',
  DAILY = 'DAILY'
}

export interface TriggerConfig {
  type: TriggerType;
  minutes?: number;
  time?: string;
}
