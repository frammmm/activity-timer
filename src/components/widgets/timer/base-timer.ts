import { EventBus, IEventBus, KeyCodes, Logger } from '../../../utils';

import { ITimer, ITimerStages, StageType, TimerState, TTimerDurationSettings } from './types';


export default class BaseTimer implements ITimer {
  #settingsKey = 'activity-timer:settings';

  element: Element;
  eventBus: IEventBus;
  settings: TTimerDurationSettings;
  settingsProxy: TTimerDurationSettings;
  stages: ITimerStages;
  startTime: number;
  state: TimerState = TimerState.INITIAL;
  timeLeft: number;
  timerDuration: number;
  timer: NodeJS.Timeout;

  constructor(element: Element) {
    this.element = element;
    this.eventBus = new EventBus();

    this._init();
  }

  _init (): void {
    this.revealTimer();
    this.restoreUserSettings();
    this._bindEventHandlers();

    this.settingsProxy = new Proxy(this.settings, {
      set: (target, property, value): boolean => {
        target[property] = value;

        this.updateStagesDuration();
        this.saveUserSettings();

        return true;
      }
    });

    this.stages = {
      current: {
        key: StageType.ACTIVITY,
        name: 'Activity',
        duration: this.settings[StageType.ACTIVITY],
        theme: 'orange'
      },
      prev: {
        key: StageType.REST,
        name: 'Rest',
        duration: this.settings[StageType.REST],
        theme: 'green'
      }
    };
  }

  _bindEventHandlers (): void {
    window.addEventListener('keydown', this.onWindowKeyDown);
  }

  onWindowKeyDown = (event: KeyboardEvent): void => {
    const { keyCode } = event;

    const key = Object.entries(KeyCodes).find((entry) => entry[1] === keyCode)[0];

    Logger.log('Timer', event, key);

    switch (key) {
      case 'space': this.onSpacePress(); break;
      case 'esc': this.onEscPress(); break;
      default: break;
    }
  }

  onEscPress (): void {
    this.reset();
  }

  onSpacePress (): void {
    this.toggle();
  }

  pause (): void {
    if (this.state === TimerState.PAUSE) {
      return;
    }

    this.timeLeft = this.timeLeft - (Date.now() - this.startTime);
    this.state = TimerState.PAUSE;

    this.resetTimeout();

    this.eventBus.emit('pause');
  }

  async play (): Promise<void> {
    if (this.state === TimerState.PLAYING) {
      return;
    }

    if (this.state === TimerState.FINISHED) {
      await new Promise(resolve => {
        this.eventBus.emit('restart', () => {
          this.state = TimerState.INITIAL;

          this.switchStages();

          resolve();
        });
      });
    }

    if (this.state !== TimerState.PAUSE) {
      this.timeLeft = this.stages.current.duration;
      this.timerDuration = this.stages.current.duration;

      this.eventBus.emit('start', this.stages);
    }

    this.startTime = Date.now();
    this.state = TimerState.PLAYING;

    this.runTimeout();

    this.eventBus.emit('play');
  }

  reset = (): void => {
    if ([TimerState.STOP, TimerState.INITIAL].includes(this.state)) {
      return;
    }

    this.timeLeft = this.timeLeft - (Date.now() - this.startTime);
    this.state = TimerState.STOP;

    this.resetTimeout();

    this.eventBus.emit('reset');
  }

  stop = (): void => {
    if (this.state === TimerState.FINISHED) {
      return;
    }

    this.state = TimerState.FINISHED;

    this.eventBus.emit('stop');
  }

  toggle = (): void => {
    if (this.state !== TimerState.PLAYING) {
      this.play();
    } else {
      this.pause();
    }
  }

  revealTimer (): void {
    this.element.classList.remove('is-hidden');
  }

  resetTimeout (): void {
    clearTimeout(this.timer);
  }

  runTimeout (): void {
    if (this.timer) {
      this.resetTimeout();
    }

    this.timer = setTimeout(this.stop, this.timeLeft);
  }

  get defaultSettings (): TTimerDurationSettings {
    return {
      [StageType.ACTIVITY]: 1000 * 60 * 30,
      [StageType.REST]: 1000 * 60 * 10
    };
  }

  get timeLeftPercentage (): number {
    return this.timeLeft / this.timerDuration;
  }

  restoreUserSettings (): void {
    const settings = localStorage.getItem(this.#settingsKey);

    if (settings) {
      this.settings = JSON.parse(settings);
    } else {
      this.settings = this.defaultSettings;
    }
  }

  saveUserSettings (): void {
    const settings = this.serializeUserSettings();

    localStorage.setItem(this.#settingsKey, settings);
  }

  serializeUserSettings (): string {
    return JSON.stringify(this.settings);
  }

  setDuration (type: StageType, value: number): void {
    this.settingsProxy[type] = value;

    this.reset();
  }

  switchStages (): void {
    const stages = { ...this.stages };

    this.stages = {
      current: stages.prev,
      prev: stages.current
    };
  }

  updateStagesDuration (): void {
    this.stages = {
      current: {
        ...this.stages.current,
        duration: this.settings[this.stages.current.key]
      },
      prev: {
        ...this.stages.prev,
        duration: this.settings[this.stages.prev.key]
      }
    };
  }
}
