import anime from 'animejs';

import { Logger, polarToCartesian } from '../../../utils';

import BaseTimer from './base-timer';

import { ITimerStages } from './types';

interface ISvgSize {
  width: number;
  height: number;
}

export default class SVGTimer extends BaseTimer {
  svg: SVGElement;
  svgBasePath: SVGPathElement;
  svgTimerPath: SVGPathElement;
  svgDefs: SVGDefsElement;
  svgSize: ISvgSize;

  strokeDashOffset: number;

  constructor(element: Element) {
    super(element);

    Logger.log('Timer', 'Using SVG timer');

    this.init();
  }

  init (): void {
    this.createSvg();
    this.createSvgPaths();

    this.bindEventHandlers();
  }

  bindEventHandlers (): void {
    this.eventBus.on('pause', this.onPause);
    this.eventBus.on('play', this.onPlay);
    this.eventBus.on('reset', this.onReset);
    this.eventBus.on('restart', this.onRestart);
    this.eventBus.on('start', this.onStart);
  }

  createSvg (): void {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('timer-svg');

    const { width, height } = this.element.getBoundingClientRect();

    this.svgSize = {
      height: Math.floor(height),
      width: Math.floor(width)
    };

    this.svg.setAttribute('width', this.svgSize.width.toString());
    this.svg.setAttribute('height', this.svgSize.height.toString());

    this.svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    const shadowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    shadowFilter.setAttribute('id', 'shadow');

    const blurFilter = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blurFilter.setAttribute('stdDeviation', '6');

    const blendFilter = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
    blendFilter.setAttribute('in', 'SourceGraphic');

    shadowFilter.appendChild(blurFilter);
    shadowFilter.appendChild(blendFilter);

    this.svgDefs.appendChild(shadowFilter);
    this.svg.appendChild(this.svgDefs);
    this.element.appendChild(this.svg);
  }

  createSvgPaths (): void {
    const centerX = this.svgSize.width / 2;
    const centerY = this.svgSize.height / 2;
    const radius = 165;
    const baseStartAngle = 285;
    const baseEndAngle = 255;

    const baseStart = polarToCartesian(
      centerX,
      centerY,
      radius,
      baseStartAngle
    );

    const baseEnd = polarToCartesian(
      centerX,
      centerY,
      radius,
      baseEndAngle
    );

    this.svgBasePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgBasePath.setAttribute('class', 'timer-svg__base');
    this.svgBasePath.setAttribute('d', [
      'M', baseStart.x, baseStart.y,
      'A', radius, radius, 0, 1, 1, baseEnd.x, baseEnd.y
    ].join(' '));

    this.svgTimerPath = this.svgBasePath.cloneNode(true) as SVGPathElement;
    this.svgTimerPath.setAttribute('class', 'timer-svg__filler');
    this.svgTimerPath.setAttribute('filter', 'url(#shadow)');

    this.strokeDashOffset = this.svgTimerPath.getTotalLength();

    this.svgTimerPath.style.strokeDasharray = this.strokeDashOffset.toString();
    this.svgTimerPath.style.strokeDashoffset = this.strokeDashOffset.toString();

    this.svg.appendChild(this.svgBasePath);
    this.svg.appendChild(this.svgTimerPath);
  }

  onPause = (): void => {
    this.svgTimerPath.style.strokeDashoffset = `${this.strokeDashOffset * this.timeLeftPercentage}`;
  }

  onPlay = (): void => {
    this.svgTimerPath.style.transitionTimingFunction = 'linear';
    this.svgTimerPath.style.transitionDuration = `${this.timerDuration * this.timeLeftPercentage}ms`;
    this.svgTimerPath.style.strokeDashoffset = '0';
  }

  onReset = (): void => {
    this.svgTimerPath.style.strokeDashoffset = `${this.strokeDashOffset * this.timeLeftPercentage}`;
    this.svgTimerPath.style.transitionDuration = '500ms';
    this.svgTimerPath.style.transitionTimingFunction = 'cubic-bezier(0.25, 1, 0.5, 1)';
    this.svgTimerPath.style.strokeDashoffset = `${this.strokeDashOffset - 0.01}`;

    anime({
      targets: this.svgTimerPath,
      strokeWidth: [20, 0],
      easing: 'easeOutQuart',
      delay: 200,
      duration: 500,
      complete: () => {
        this.svgTimerPath.style.strokeDashoffset = this.strokeDashOffset.toString();
      }
    });
  }

  onRestart = (callback): void => {
    this.svgTimerPath.style.transitionDuration = '600ms';
    this.svgTimerPath.style.transitionTimingFunction = 'cubic-bezier(0.25, 1, 0.5, 1)';
    this.svgTimerPath.style.strokeDashoffset = `${-this.strokeDashOffset}`;

    anime({
      targets: this.svgTimerPath,
      strokeWidth: [20, 2],
      easing: 'easeOutQuart',
      delay: 200,
      duration: 500,
      complete: () => {
        this.svgTimerPath.style.transitionDuration = '0ms';
        this.svgTimerPath.style.strokeDashoffset = this.strokeDashOffset.toString();

        setTimeout(callback);
      }
    });
  }

  onStart = (stages: ITimerStages): void => {
    this.setTimerPathTheme(stages.current.theme, stages.prev.theme);

    anime({
      targets: this.svgTimerPath,
      strokeWidth: [0, 20],
      easing: 'easeOutQuart',
      duration: 500,
    });
  }

  setTimerPathTheme (theme, prevTheme): void {
    this.svgTimerPath.classList.remove(`is-${prevTheme}`);
    this.svgTimerPath.classList.add(`is-${theme}`);
  }
}
