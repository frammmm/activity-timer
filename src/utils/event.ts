import { isArray, isString } from './helpers';

// export class EventBinder {
//   listeners: object;
//
//   constructor (listeners = {}) {
//     this.listeners = listeners;
//   }
//
//   bind (events: string | Array<string>, element: Element | Window | Document, callback: Function, capture: boolean | object) {
//     let _events;
//
//     if (isString(events)) {
//       _events = [events];
//     } else {
//       _events = events;
//     }
//
//     _events.forEach(event => {
//       this.listeners[event] = callback;
//
//       element.addEventListener(event, this.listeners[event], capture);
//     });
//   }
//
//   unbind (events: string | Array<string>, element: Element | Window | Document, capture: boolean | object = false) {
//     let _events;
//
//     if (isString(events)) {
//       _events = [events];
//     } else {
//       _events = events;
//     }
//
//     _events.forEach(event => {
//       element.removeEventListener(event, this.listeners[event], capture);
//     });
//   }
// }

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

    // Create the event's object if not yet created
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
