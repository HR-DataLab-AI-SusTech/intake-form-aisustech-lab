import { getFormConfig } from '../config/formConfig.js';
import { renderPage } from './formRenderer.js';
import { validatePage } from './validation.js';
import { renderSummary } from './summaryRenderer.js';
import { renderLanding } from './landingRenderer.js';
import { setNavigateCallback } from './pageController.js';
import { hasAnyValues } from './stateManager.js';

let currentPage = 0;
let totalPages = 0;
let highestVisited = 0;
let isPopState = false;

let formContainer;
let btnPrev;
let btnNext;
let pageCounter;
let stepIndicator;
let formNavigation;

export function initNavigation() {
  const formConfig = getFormConfig();
  totalPages = formConfig.pages.length;

  formContainer = document.getElementById('form-container');
  btnPrev = document.getElementById('btn-prev');
  btnNext = document.getElementById('btn-next');
  pageCounter = document.getElementById('page-counter');
  stepIndicator = document.getElementById('step-indicator');
  formNavigation = document.getElementById('form-navigation');

  btnPrev.addEventListener('click', goToPreviousPage);
  btnNext.addEventListener('click', goToNextPage);

  window.addEventListener('popstate', (e) => {
    if (e.state && typeof e.state.page === 'number') {
      isPopState = true;
      currentPage = e.state.page;
      renderCurrentPage();
      isPopState = false;
    }
  });

  setNavigateCallback(navigateTo);

  buildStepIndicator();

  const startPage = getPageFromHash();
  currentPage = startPage;
  highestVisited = currentPage;
  pushHistoryState(currentPage, true);
  renderCurrentPage();
}

function getFormPageCount() {
  const formConfig = getFormConfig();
  return formConfig.pages.filter((p) => !p.isLanding && !p.isSummary).length;
}

function getFormPageIndex(index) {
  const formConfig = getFormConfig();
  let count = 0;
  for (let i = 0; i < index; i++) {
    const p = formConfig.pages[i];
    if (!p.isLanding && !p.isSummary) {
      count++;
    }
  }
  return count;
}

function getPageFromHash() {
  const formConfig = getFormConfig();
  const hash = window.location.hash.slice(1);
  if (hash) {
    const index = formConfig.pages.findIndex((p) => p.id === hash);
    if (index >= 0) {
      const page = formConfig.pages[index];
      if (page.isSummary && !hasAnyValues()) {
        return 0;
      }
      return index;
    }
  }
  return 0;
}

function pushHistoryState(index, replace) {
  if (isPopState) {
    return;
  }
  const formConfig = getFormConfig();
  const page = formConfig.pages[index];
  const hash = `#${page.id}`;
  const stateObj = { page: index };

  if (replace) {
    history.replaceState(stateObj, page.title, hash);
  } else {
    history.pushState(stateObj, page.title, hash);
  }
}

function navigateTo(pageIndex) {
  if (pageIndex >= 0 && pageIndex < totalPages && pageIndex <= highestVisited) {
    currentPage = pageIndex;
    pushHistoryState(currentPage, false);
    renderCurrentPage();
  }
}

function goToPreviousPage() {
  if (currentPage > 0) {
    currentPage--;
    pushHistoryState(currentPage, false);
    renderCurrentPage();
  }
}

function goToNextPage() {
  const formConfig = getFormConfig();
  const page = formConfig.pages[currentPage];

  if (!page.isSummary && !page.isLanding) {
    const result = validatePage(page);
    if (!result.valid) {
      return;
    }
  }

  if (currentPage < totalPages - 1) {
    currentPage++;
    if (currentPage > highestVisited) {
      highestVisited = currentPage;
    }
    pushHistoryState(currentPage, false);
    renderCurrentPage();
  }
}

function renderCurrentPage() {
  const formConfig = getFormConfig();
  const page = formConfig.pages[currentPage];

  stepIndicator.classList.remove('hidden');

  if (page.isLanding) {
    renderLanding(page, formContainer, () => goToNextPage());
    formNavigation.classList.add('hidden');
  } else {
    formNavigation.classList.remove('hidden');

    if (page.isSummary) {
      renderSummary(formContainer);
    } else {
      renderPage(page, formContainer);
    }

    updateButtons(currentPage);
    updatePageCounter(currentPage);
  }

  updateStepIndicator(currentPage);
}

function updateButtons(index) {
  const formConfig = getFormConfig();
  const page = formConfig.pages[index];
  const isLast = index === totalPages - 1;

  btnPrev.classList.toggle('btn-hidden', page.isLanding);
  btnPrev.textContent = `\u2190 ${formConfig.prevButtonText || 'Previous'}`;

  if (isLast) {
    btnNext.classList.add('hidden');
  } else {
    btnNext.classList.remove('hidden');
    btnNext.textContent = `${formConfig.nextButtonText || 'Next'} \u2192`;
    btnNext.classList.remove('btn-success');
    btnNext.classList.add('btn-primary');
  }
}

function updatePageCounter(index) {
  const formConfig = getFormConfig();
  const page = formConfig.pages[index];
  if (page.isSummary) {
    pageCounter.textContent = '';
    return;
  }
  const formIndex = getFormPageIndex(index);
  const formTotal = getFormPageCount();
  pageCounter.textContent = `Page ${formIndex + 1} of ${formTotal}`;
}

function buildStepIndicator() {
  const formConfig = getFormConfig();
  stepIndicator.innerHTML = '';

  for (let i = 0; i < totalPages; i++) {
    const page = formConfig.pages[i];

    const step = document.createElement('div');
    step.className = 'step';

    const circle = document.createElement('div');
    circle.className = 'step-circle';
    circle.dataset.step = i;
    circle.setAttribute('role', 'button');
    circle.setAttribute('tabindex', '0');

    if (page.isLanding) {
      circle.textContent = '\u2302';
      circle.setAttribute('aria-label', 'Home');
    } else if (page.isSummary) {
      circle.textContent = '\u2713';
      circle.setAttribute('aria-label', `Final step: ${page.title}`);
    } else {
      const hasLanding = formConfig.pages[0].isLanding;
      const displayNum = hasLanding ? i : i + 1;
      circle.textContent = displayNum;
      circle.setAttribute('aria-label', `Step ${displayNum}: ${page.title}`);
    }

    circle.addEventListener('click', () => navigateTo(i));
    circle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateTo(i);
      }
    });

    step.appendChild(circle);

    if (i < totalPages - 1) {
      const line = document.createElement('div');
      line.className = 'step-line';
      line.dataset.line = i;
      step.appendChild(line);
    }

    stepIndicator.appendChild(step);
  }
}

function updateStepIndicator(activeIndex) {
  for (let i = 0; i < totalPages; i++) {
    const circle = stepIndicator.querySelector(`[data-step="${i}"]`);
    if (!circle) {
      continue;
    }

    circle.classList.remove('active', 'completed', 'disabled');

    if (i === activeIndex) {
      circle.classList.add('active');
    } else if (i < activeIndex) {
      circle.classList.add('completed');
    }

    if (i > highestVisited) {
      circle.classList.add('disabled');
    }

    if (i < totalPages - 1) {
      const line = stepIndicator.querySelector(`[data-line="${i}"]`);
      if (line) {
        line.classList.toggle('completed', i < activeIndex);
      }
    }
  }
}
