import SVGTimer from './svg-timer';

import { DurationType, ITimer } from './types';


export const TimerSelector = '.timer';

export default class Timer {
  static init (container = document): void {
    const elements = [...container.querySelectorAll(TimerSelector)];

    elements.forEach(element => new Timer(element));
  }

  activityDurationInput: HTMLInputElement;
  restDurationInput: HTMLInputElement;
  icons: { [key: string]: SVGElement } = {};
  timer: ITimer;
  toggleButton: HTMLButtonElement;

  constructor(element: Element) {
    this.activityDurationInput = element.querySelector('.js-timer-activity-duration');
    this.restDurationInput = element.querySelector('.js-timer-rest-duration');
    this.toggleButton = element.querySelector('.js-timer-toggle') as HTMLButtonElement;

    this.timer = new SVGTimer(element);

    this.init();
  }

  init (): void {
    this.createIcons();
    this.bindEventHandlers();
    this.setValues();
  }

  bindEventHandlers (): void {
    this.timer.eventBus.on(['play', 'restart'], this.onTimerStart);
    this.timer.eventBus.on(['stop', 'pause', 'reset'], this.onTimerStop);

    this.activityDurationInput.addEventListener('input', this.onActivityDurationInputChange);
    this.restDurationInput.addEventListener('input', this.onRestDurationInputChange);

    this.toggleButton.addEventListener('click', this.onPlayButtonClick);
  }

  createIcons (): void {
    const playIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    playIcon.setAttribute('viewBox', '0 0 448 512');
    playIcon.setAttribute('width', '14');
    playIcon.setAttribute('height', '16');
    playIcon.setAttribute('style', 'margin-left: 1px;');

    const playIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    playIconPath.setAttribute('fill', 'currentColor');
    playIconPath.setAttribute('d', 'M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z');

    playIcon.appendChild(playIconPath);

    const pauseIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pauseIcon.setAttribute('viewBox', '0 0 448 512');
    pauseIcon.setAttribute('width', '14');
    pauseIcon.setAttribute('height', '16');

    const pauseIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pauseIconPath.setAttribute('fill', 'currentColor');
    pauseIconPath.setAttribute('d', 'M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z');

    pauseIcon.appendChild(pauseIconPath);

    this.icons.play = playIcon;
    this.icons.pause = pauseIcon;
  }

  onActivityDurationInputChange = (event): void => {
    this.timer.setDuration(DurationType.ACTIVITY_DURATION, parseInt(event.target.value) * 60000);
  }

  onRestDurationInputChange = (event): void => {
    this.timer.setDuration(DurationType.REST_DURATION, parseInt(event.target.value) * 60000);
  }

  onTimerStart = (): void => {
    this.setInputsDisabled(true);
    this.setToggleButtonDisabled(true);
    this.setToggleButtonIcon(this.icons.pause);
  }

  onTimerStop = (): void => {
    this.setInputsDisabled(false);
    this.setToggleButtonDisabled(false);
    this.setToggleButtonIcon(this.icons.play);
  }

  onPlayButtonClick = (): void => {
    this.timer.toggle();
  }

  setInputsDisabled (value): void {
    this.activityDurationInput.disabled = value;
    this.restDurationInput.disabled = value;
  }

  setToggleButtonDisabled (value): void {
    this.toggleButton.disabled = value;
  }

  setToggleButtonIcon (icon: SVGElement): void {
    this.toggleButton.innerHTML = '';
    this.toggleButton.appendChild(icon);
  }

  setValues (): void {
    this.activityDurationInput.value = `${this.timer.settings.ACTIVITY_DURATION / 60000}m`;
    this.restDurationInput.value = `${this.timer.settings.REST_DURATION / 60000}m`;
  }
}
