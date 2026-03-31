import { getFormConfig } from '../config/formConfig.js';
import { getValue, clearState } from './stateManager.js';
import { generateMarkdown } from './markdownGenerator.js';
import { generateCsv } from './csvGenerator.js';
import { downloadMarkdown, downloadCsv } from './downloadHandler.js';
import { goToPage } from './pageController.js';

function getSummaryPage() {
  const formConfig = getFormConfig();
  return formConfig.pages.find((p) => p.isSummary) || {};
}

export function renderSummary(container) {
  const formConfig = getFormConfig();
  container.innerHTML = '';

  const summaryPage = getSummaryPage();
  const section = document.createElement('div');
  section.className = 'summary-page';

  const title = document.createElement('h2');
  title.className = 'page-title';
  title.textContent = summaryPage.summaryPageTitle || 'Review Your Answers';
  title.tabIndex = -1;
  section.appendChild(title);

  let pageIndex = 0;

  for (const page of formConfig.pages) {
    if (page.isSummary || page.isLanding) {
      continue;
    }

    const sectionEl = document.createElement('div');
    sectionEl.className = 'summary-section';

    const header = document.createElement('div');
    header.className = 'summary-section-header';

    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'summary-section-title';
    sectionTitle.textContent = page.title;

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-link';
    editBtn.textContent = summaryPage.editButtonText || 'Edit';
    editBtn.setAttribute('aria-label', `Edit ${page.title}`);
    const targetPage = pageIndex;
    editBtn.addEventListener('click', () => {
      goToPage(targetPage);
    });

    header.appendChild(sectionTitle);
    header.appendChild(editBtn);
    sectionEl.appendChild(header);

    for (const field of page.fields) {
      const fieldEl = document.createElement('div');
      fieldEl.className = 'summary-field';

      const labelEl = document.createElement('div');
      labelEl.className = 'summary-label';
      labelEl.textContent = `${field.id.toUpperCase()}: ${field.label}`;

      const valueEl = document.createElement('div');
      valueEl.className = 'summary-value';
      const value = getValue(field.id);
      if (value) {
        valueEl.textContent = formatDisplayValue(field, value);
      } else {
        valueEl.textContent = summaryPage.emptyFieldText || 'No answer provided';
        valueEl.classList.add('empty');
      }

      fieldEl.appendChild(labelEl);
      fieldEl.appendChild(valueEl);
      sectionEl.appendChild(fieldEl);
    }

    section.appendChild(sectionEl);
    pageIndex++;
  }

  // Download section
  const downloadSection = document.createElement('div');
  downloadSection.className = 'download-section';

  const downloadText = document.createElement('p');
  downloadText.textContent =
    summaryPage.downloadInstructions ||
    'Review your answers above, then download the form.';

  downloadSection.appendChild(downloadText);

  const btnGroup = document.createElement('div');
  btnGroup.className = 'download-btn-group';

  btnGroup.appendChild(
    createDownloadButton('Markdown', 'btn-success', () => {
      const md = generateMarkdown();
      downloadMarkdown(md);
    }),
  );

  btnGroup.appendChild(
    createDownloadButton('CSV', 'btn-secondary-light', () => {
      const csv = generateCsv();
      downloadCsv(csv);
    }),
  );

  downloadSection.appendChild(btnGroup);

  const startOverBtn = document.createElement('button');
  startOverBtn.className = 'btn btn-secondary start-over-btn';
  startOverBtn.textContent = summaryPage.startOverButtonText || 'Start Over';
  startOverBtn.setAttribute('aria-label', 'Clear all answers and start over');
  startOverBtn.addEventListener('click', () => {
    clearState();
    goToPage(0);
  });
  downloadSection.appendChild(startOverBtn);

  section.appendChild(downloadSection);

  container.appendChild(section);
  title.focus();
}

function createDownloadButton(label, cssClass, onClick) {
  const btn = document.createElement('button');
  btn.className = `btn ${cssClass}`;
  btn.textContent = `Download ${label}`;
  btn.setAttribute('aria-label', `Download form as ${label} file`);

  btn.addEventListener('click', () => {
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Downloading...';
    try {
      onClick();
      btn.textContent = 'Downloaded!';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
      }, 2000);
    } catch {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });

  return btn;
}

function formatDisplayValue(field, value) {
  if (field.type === 'checkbox') {
    try {
      const arr = JSON.parse(value);
      return arr.join(', ');
    } catch {
      return value;
    }
  }
  return value;
}
