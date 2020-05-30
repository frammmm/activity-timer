import '@/styles/index.scss';

import(/* webpackChunkName: "chunk" */'./components/widgets/chunk/chunk');

console.log('Bundle loaded');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
