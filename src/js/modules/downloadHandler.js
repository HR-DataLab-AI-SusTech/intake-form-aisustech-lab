import { getFormConfig } from '../config/formConfig.js';

function getFilename(extension) {
  const formConfig = getFormConfig();
  const date = new Date().toISOString().split('T')[0];
  const prefix = formConfig.downloadFilenamePrefix || 'datalab-intake';
  return `${prefix}-${date}.${extension}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  try {
    document.body.appendChild(link);
    link.click();
  } finally {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function downloadMarkdown(markdownString) {
  const blob = new Blob([markdownString], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, getFilename('md'));
}

export function downloadCsv(csvString) {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, getFilename('csv'));
}