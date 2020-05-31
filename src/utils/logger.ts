import { isProduction } from './variables';

export class Logger {
  static themes = {
    log: {
      primary: ['#434343', '#323232'],
      secondary: ['#323232', '#212121'],
      borders: ['#434343', '#212121']
    },
    error: {
      primary: ['#FF416C', '#FF4B2B'],
      secondary: ['#323232', '#212121'],
      borders: ['#FF4B2B', '#212121']
    },
    warn: {
      primary: ['#ffcc1b', '#ffd01a'],
      secondary: ['#323232', '#212121'],
      borders: ['#ffd91b', '#333a47']
    },
    info: {
      primary: ['#00bcd4', '#00deff'],
      secondary: ['#323232', '#212121'],
      borders: ['#00e0ff', '#212121']
    }
  };

  static print (theme, namespace: string, ...args): void {
    if (isProduction) {
      return;
    }

    console.log(
      `%cLogger${namespace ? `%c${namespace}` : ''}%c`,

      `background: linear-gradient(to right, ${theme.primary[0]} 0%, ${theme.primary[1]} 100%); ` +
      `border: 1px solid ${theme.borders[0]}; border-right: 0; padding: 1px 7px; ` +
      `border-radius: 3px 0 0 3px; color: #fff`,

      `background: linear-gradient(to right, ${theme.secondary[0]} 0%, ${theme.secondary[1]} 100%); ` +
      `border: 1px solid ${theme.borders[1]}; border-left: 0; padding: 1px 7px; ` +
      `border-radius: 0 3px 3px 0; color: #fff`,

      'background: transparent; padding: 2px;',
      ...args
    );
  }

  static log (namespace: string, ...args): void {
    this.print(this.themes.log, namespace, ...args);
  }

  static error (namespace: string, ...args): void {
    this.print(this.themes.error, namespace, ...args);
  }

  static warn (namespace: string, ...args): void {
    this.print(this.themes.warn, namespace, ...args);
  }

  static info (namespace: string, ...args): void {
    this.print(this.themes.info, namespace, ...args);
  }
}
