import { getFormConfig } from '../config/formConfig.js';
import { getAllValues } from './stateManager.js';

export function generateCsv() {
  const formConfig = getFormConfig();
  const values = getAllValues();

  const rows = [['Section', 'Question ID', 'Question', 'Answer']];

  for (const page of formConfig.pages) {
    if (page.isSummary || page.isLanding) {
      continue;
    }

    for (const field of page.fields) {
      const rawValue = values[field.id] || '';
      let displayValue = rawValue;

      if (field.type === 'checkbox' && rawValue) {
        try {
          displayValue = JSON.parse(rawValue).join('; ');
        } catch {
          displayValue = rawValue;
        }
      }

      rows.push([page.title, field.id.toUpperCase(), field.label, displayValue]);
    }
  }

  return rows.map((row) => row.map(escapeCsvField).join(',')).join('\n');
}

function escapeCsvField(value) {
  let str = String(value);

  // Prevent Excel formula injection
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
