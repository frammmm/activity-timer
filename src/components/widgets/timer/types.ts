import { IEventBus } from '../../../utils';


export enum TimerState {
  'INITIAL',
  'FINISHED',
  'PLAYING',
  'PAUSE',
  'STOP'
}

export enum StageType {
  'ACTIVITY' = 'ACTIVITY',
  'REST' = 'REST'
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
  setDuration(type: StageType, value: number): void;
}

export type TTimerDurationSettings = {
  [type in StageType]: number;
}

export interface ITimerStage {
  key: StageType;
  name: string;
  duration: number;
  theme: string;
}

export interface ITimerStages {
  current: ITimerStage;
  prev: ITimerStage;
}
