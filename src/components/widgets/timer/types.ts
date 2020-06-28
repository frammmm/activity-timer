import { IEventBus } from '../../../utils';


export enum TimerState {
  'INITIAL',
  'FINISHED',
  'PLAYING',
  'PAUSE',
  'STOP'
}

export enum DurationType {
  'ACTIVITY_DURATION' = 'ACTIVITY_DURATION',
  'REST_DURATION' = 'REST_DURATION'
}

export interface ITimer {
  element: Element;
  eventBus: IEventBus;
  settings: TTimerDurationSettings;
  startTime: number;
  state: TimerState;
  timeLeft: number;
  timerDuration: number;
  timer: NodeJS.Timeout;

  pause(): void;
  play(): void;
  stop(): void;
  toggle(): void;
  setDuration(type: DurationType, value: number): void;
}

export type TTimerDurationSettings = {
  [type in DurationType]: number;
}
