export function downloadMarkdown(markdownString, filenamePrefix) {
  const date = new Date().toISOString().split('T')[0];
  const prefix = filenamePrefix || 'datalab-intake';
  const filename = `${prefix}-${date}.md`;

  const blob = new Blob([markdownString], { type: 'text/markdown;charset=utf-8' });
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
