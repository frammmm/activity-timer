import { isArray } from './helpers';

export interface IEventBus {
  on (events: string | Array<string>, closure: Function): void;
  emit (events: string | Array<string>, context?: any): void;
}

export class EventBus {
  listeners: object;

  constructor (listeners = {}) {
    this.listeners = listeners;
  }

  on (events: string | Array<string>, closure: Function) {
    if (isArray(events)) {
      return (events as Array<string>).forEach(event => this.on(event, closure));
    }

    if (!this.listeners[events as string]) {
      this.listeners[events as string] = [];
    }

    const index = this.listeners[events as string].push(closure) - 1;

    return {
      off () {
        delete this.listeners[events as string][index];
      }
    };
  }

  emit (events: string | Array<string>, context) {
    if (isArray(event)) {
      return (events as Array<string>).forEach(event => this.emit(event, context));
    }

    if (!this.listeners[events as string]) {
      return;
    }

    this.listeners[events as string].forEach(closure => closure(context));
  }
}
