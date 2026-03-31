let navigateCallback = null;

export function setNavigateCallback(fn) {
  navigateCallback = fn;
}

export function goToPage(pageIndex) {
  if (navigateCallback) {
    navigateCallback(pageIndex);
  }
}
