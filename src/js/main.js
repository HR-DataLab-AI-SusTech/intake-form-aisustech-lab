import { formConfig } from './config/formConfig.js';
import { initNavigation } from './modules/navigation.js';
import { hasAnyValues } from './modules/stateManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const titleEl = document.querySelector('.header-title');
  if (titleEl) {
    titleEl.textContent = formConfig.title;
  }

  const subtitleEl = document.querySelector('.header-subtitle');
  if (subtitleEl && formConfig.subtitle) {
    subtitleEl.textContent = formConfig.subtitle;
  }

  document.title = formConfig.title;

  initNavigation();
});

window.addEventListener('beforeunload', (e) => {
  if (hasAnyValues()) {
    e.preventDefault();
  }
});
