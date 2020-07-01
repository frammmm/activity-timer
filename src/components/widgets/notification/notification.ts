export default class Notification {
  static isAvailable: boolean;
  static hasPermission: boolean;

  static init (): void {
    this.isAvailable = 'Notification' in window;

    if (this.isAvailable) {
      this.requestPermission();
    }
  }

  static async requestPermission (): Promise<void> {
    const permission = await window.Notification.requestPermission();

    this.hasPermission = permission === 'granted';
  }

  static create (content: string, options: NotificationOptions) {
    if (Notification.hasPermission) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(content, options);
      });
    }
  }
}
