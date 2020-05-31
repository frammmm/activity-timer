import { Logger } from '../../../utils/logger';

export const TimerSelector = '.timer';

export default class Timer {
  static init (container = document): void {
    const elements = [...container.querySelectorAll(TimerSelector)];

    elements.forEach(element => new Timer(element));
  }

  constructor(element: Element) {
    Logger.log('Timer constructor', element);
    Logger.error('Timer constructor', element);
    Logger.warn('Timer constructor', element);
    Logger.info('Timer constructor', element);
  }
}
