export enum TriggerType {
  WEBHOOK = 'WEBHOOK',
  SCHEDULED = 'SCHEDULED'
}

export interface ScheduleConfig {
  type: 'immediately' | 'regular' | 'daily';
  minutes?: number;
  time?: string;
}

export interface TriggerConfig {
  type: TriggerType;
  scheduleConfig?: ScheduleConfig;
}
