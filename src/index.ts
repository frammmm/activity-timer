import '@/styles/index.scss';

import Timer from './components/widgets/timer/timer';

import { isProduction } from './utils/variables';

const modules = [
  Timer
];

function initDynamicModule(module): void {
  module?.default?.init();
}

function initModules (): void {
  modules.forEach(module => module.init());
}

if (document.readyState !== 'loading') {
  window.addEventListener('load', initModules);
} else {
  document.addEventListener('DOMContentLoaded', initModules);
}

if (isProduction && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
