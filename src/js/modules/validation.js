import { getValue } from './stateManager.js';

export function validatePage(page) {
  const errors = [];

  for (const field of page.fields) {
    if (!field.required) {
      continue;
    }

    const value = getValue(field.id).trim();

    if (!value) {
      errors.push({
        fieldId: field.id,
        message: 'This field is required.',
      });
    }
  }

  showErrors(errors);
  announceErrors(errors);

  return { valid: errors.length === 0, errors };
}

function showErrors(errors) {
  document.querySelectorAll('.error-message').forEach((el) => el.remove());
  document.querySelectorAll('.field-error').forEach((el) => {
    el.classList.remove('field-error');
    el.removeAttribute('aria-describedby');
  });

  for (const error of errors) {
    const wrapper = document.querySelector(`[data-field-id="${error.fieldId}"]`);
    if (!wrapper) {
      continue;
    }

    const errorId = `${error.fieldId}-error`;

    const input =
      wrapper.querySelector('textarea') ||
      wrapper.querySelector('input[type="text"]') ||
      wrapper.querySelector('select') ||
      wrapper.querySelector('.radio-group') ||
      wrapper.querySelector('.checkbox-group');

    if (input) {
      input.classList.add('field-error');
      input.setAttribute('aria-describedby', errorId);
    }

    const msg = document.createElement('span');
    msg.className = 'error-message';
    msg.id = errorId;
    msg.setAttribute('role', 'alert');
    msg.textContent = error.message;
    wrapper.appendChild(msg);
  }

  if (errors.length > 0) {
    const firstWrapper = document.querySelector(`[data-field-id="${errors[0].fieldId}"]`);
    if (firstWrapper) {
      const focusTarget =
        firstWrapper.querySelector('textarea') ||
        firstWrapper.querySelector('input[type="text"]') ||
        firstWrapper.querySelector('input[type="radio"]') ||
        firstWrapper.querySelector('input[type="checkbox"]') ||
        firstWrapper.querySelector('select');
      if (focusTarget) {
        focusTarget.focus();
      }
    }
  }
}

function announceErrors(errors) {
  const liveRegion = document.getElementById('validation-live');
  if (!liveRegion) {
    return;
  }

  if (errors.length > 0) {
    liveRegion.textContent = `${errors.length} field(s) require your attention.`;
  } else {
    liveRegion.textContent = '';
  }
}
