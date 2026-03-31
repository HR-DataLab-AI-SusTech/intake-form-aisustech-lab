import { getValue, setValue } from './stateManager.js';

export function renderPage(page, container) {
  container.innerHTML = '';

  const section = document.createElement('section');
  section.className = 'form-page';
  section.setAttribute('role', 'region');
  section.setAttribute('aria-label', page.title);

  const title = document.createElement('h2');
  title.className = 'page-title';
  title.textContent = page.title;
  title.tabIndex = -1;
  section.appendChild(title);

  if (page.subtitle) {
    const sub = document.createElement('p');
    sub.className = 'page-subtitle';
    sub.textContent = page.subtitle;
    section.appendChild(sub);
  }

  for (const field of page.fields) {
    const fieldEl = renderField(field);
    section.appendChild(fieldEl);
  }

  container.appendChild(section);
  title.focus();
}

function renderField(field) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-field';
  wrapper.dataset.fieldId = field.id;

  const label = document.createElement('label');
  label.className = 'form-label';
  label.setAttribute('for', field.id);

  const qNum = document.createElement('span');
  qNum.className = 'question-number';
  qNum.textContent = field.id.toUpperCase();
  label.appendChild(qNum);
  label.appendChild(document.createTextNode(` ${field.label}`));

  if (field.required) {
    const marker = document.createElement('span');
    marker.className = 'required-marker';
    marker.textContent = '*';
    marker.setAttribute('aria-hidden', 'true');
    label.appendChild(marker);
  }

  wrapper.appendChild(label);

  if (field.subtitle) {
    const sub = document.createElement('span');
    sub.className = 'field-subtitle';
    sub.textContent = field.subtitle;
    wrapper.appendChild(sub);
  }

  if (field.infoLink) {
    const link = document.createElement('a');
    link.className = 'info-link';
    link.href = field.infoLink.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = field.infoLink.text + ' \u2197';
    wrapper.appendChild(link);
  }

  switch (field.type) {
    case 'textarea':
      wrapper.appendChild(renderTextarea(field));
      break;
    case 'text':
      wrapper.appendChild(renderTextInput(field));
      break;
    case 'radio':
      wrapper.appendChild(renderRadioGroup(field));
      break;
    case 'checkbox':
      wrapper.appendChild(renderCheckboxGroup(field));
      break;
    case 'select':
      wrapper.appendChild(renderSelect(field));
      break;
  }

  return wrapper;
}

function renderTextarea(field) {
  const textarea = document.createElement('textarea');
  textarea.className = 'form-textarea';
  textarea.id = field.id;
  textarea.name = field.id;
  textarea.rows = field.rows || 4;
  textarea.value = getValue(field.id);
  if (field.placeholder) {
    textarea.placeholder = field.placeholder;
  }
  if (field.required) {
    textarea.setAttribute('aria-required', 'true');
  }

  textarea.addEventListener('input', () => {
    setValue(field.id, textarea.value);
    clearFieldError(field.id);
  });

  return textarea;
}

function renderTextInput(field) {
  const input = document.createElement('input');
  input.className = 'form-input';
  input.type = 'text';
  input.id = field.id;
  input.name = field.id;
  input.value = getValue(field.id);
  if (field.placeholder) {
    input.placeholder = field.placeholder;
  }
  if (field.required) {
    input.setAttribute('aria-required', 'true');
  }

  input.addEventListener('input', () => {
    setValue(field.id, input.value);
    clearFieldError(field.id);
  });

  return input;
}

function renderRadioGroup(field) {
  const group = document.createElement('fieldset');
  group.className = 'radio-group';
  group.id = `${field.id}-group`;
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-required', field.required ? 'true' : 'false');

  const legend = document.createElement('legend');
  legend.className = 'visually-hidden';
  legend.textContent = field.label;
  group.appendChild(legend);

  const currentValue = getValue(field.id);

  for (const option of field.options) {
    const optionLabel = document.createElement('label');
    optionLabel.className = 'radio-option';
    if (currentValue === option) {
      optionLabel.classList.add('selected');
    }

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = field.id;
    radio.value = option;
    radio.checked = currentValue === option;

    radio.addEventListener('change', () => {
      setValue(field.id, option);
      clearFieldError(field.id);
      group.querySelectorAll('.radio-option').forEach((el) => el.classList.remove('selected'));
      optionLabel.classList.add('selected');
    });

    const text = document.createElement('span');
    text.textContent = option;

    optionLabel.appendChild(radio);
    optionLabel.appendChild(text);
    group.appendChild(optionLabel);
  }

  return group;
}

function renderCheckboxGroup(field) {
  const group = document.createElement('fieldset');
  group.className = 'checkbox-group';
  group.id = `${field.id}-group`;
  group.setAttribute('aria-required', field.required ? 'true' : 'false');

  const legend = document.createElement('legend');
  legend.className = 'visually-hidden';
  legend.textContent = field.label;
  group.appendChild(legend);

  const currentValue = getValue(field.id);
  let selectedValues = [];
  try {
    selectedValues = currentValue ? JSON.parse(currentValue) : [];
  } catch {
    selectedValues = [];
  }

  for (const option of field.options) {
    const optionLabel = document.createElement('label');
    optionLabel.className = 'checkbox-option';
    if (selectedValues.includes(option)) {
      optionLabel.classList.add('selected');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = field.id;
    checkbox.value = option;
    checkbox.checked = selectedValues.includes(option);

    checkbox.addEventListener('change', () => {
      const checked = group.querySelectorAll('input[type="checkbox"]:checked');
      const values = Array.from(checked).map((cb) => cb.value);
      setValue(field.id, JSON.stringify(values));
      clearFieldError(field.id);
      group.querySelectorAll('.checkbox-option').forEach((el) => {
        const cb = el.querySelector('input[type="checkbox"]');
        el.classList.toggle('selected', cb.checked);
      });
    });

    const text = document.createElement('span');
    text.textContent = option;

    optionLabel.appendChild(checkbox);
    optionLabel.appendChild(text);
    group.appendChild(optionLabel);
  }

  return group;
}

function renderSelect(field) {
  const select = document.createElement('select');
  select.className = 'form-select';
  select.id = field.id;
  select.name = field.id;
  if (field.required) {
    select.setAttribute('aria-required', 'true');
  }

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = field.placeholder || 'Select an option...';
  defaultOption.disabled = true;
  select.appendChild(defaultOption);

  const currentValue = getValue(field.id);
  if (!currentValue) {
    defaultOption.selected = true;
  }

  for (const option of field.options) {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    opt.selected = currentValue === option;
    select.appendChild(opt);
  }

  select.addEventListener('change', () => {
    setValue(field.id, select.value);
    clearFieldError(field.id);
  });

  return select;
}

function clearFieldError(fieldId) {
  const wrapper = document.querySelector(`[data-field-id="${fieldId}"]`);
  if (!wrapper) {
    return;
  }

  const errorMsg = wrapper.querySelector('.error-message');
  if (errorMsg) {
    errorMsg.remove();
  }

  const input = wrapper.querySelector('.field-error');
  if (input) {
    input.classList.remove('field-error');
  }
}

