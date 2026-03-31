const STORAGE_KEY = 'datalab-intake-state';

const state = loadFromStorage();

function loadFromStorage() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveToStorage() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage unavailable — continue in-memory only
  }
}

export function setValue(id, value) {
  state[id] = value;
  saveToStorage();
}

export function getValue(id) {
  return state[id] || '';
}

export function getAllValues() {
  return { ...state };
}

export function hasAnyValues() {
  return Object.values(state).some((v) => v && v.trim());
}

export function clearState() {
  for (const key of Object.keys(state)) {
    delete state[key];
  }
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
