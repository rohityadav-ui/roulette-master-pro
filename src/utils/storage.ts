import { SpinRecord } from '../types/roulette';

const STORAGE_KEY_SPINS = 'roulette_analyzer_spins_v2';
const STORAGE_KEY_LAST_RNG = 'roulette_analyzer_last_rng_v2';
const STORAGE_KEY_DISCLAIMER = 'roulette_analyzer_disclaimer_v2';

export function saveSessionToStorage(spins: SpinRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SPINS, JSON.stringify(spins));
  } catch (e) {
    console.error('Failed to save session to storage', e);
  }
}

export function loadSessionFromStorage(): SpinRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SPINS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load session from storage', e);
  }
  return [];
}

export function saveLastRng(num: number | null): void {
  try {
    if (num === null) {
      localStorage.removeItem(STORAGE_KEY_LAST_RNG);
    } else {
      localStorage.setItem(STORAGE_KEY_LAST_RNG, num.toString());
    }
  } catch (e) {
    console.error('Failed to save last rng', e);
  }
}

export function loadLastRng(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_RNG);
    if (raw !== null) {
      return parseInt(raw, 10);
    }
  } catch (e) {
    console.error('Failed to load last rng', e);
  }
  return null;
}

export function hasSeenDisclaimer(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_DISCLAIMER) === 'true';
  } catch {
    return false;
  }
}

export function markDisclaimerSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY_DISCLAIMER, 'true');
  } catch {
    // ignore
  }
}

export function exportSessionToCSV(spins: SpinRecord[]): void {
  if (spins.length === 0) return;
  const headers = ['SpinNumber', 'Value', 'Color', 'Parity', 'Dozen', 'Sector', 'Timestamp'];
  const rows = spins.map((s) => [
    s.spinNumber,
    s.value,
    s.color,
    s.isEven === null ? 'None' : s.isEven ? 'Even' : 'Odd',
    s.dozen ?? 'None',
    s.sector,
    new Date(s.timestamp).toLocaleString(),
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    encodeURIComponent([headers.join(','), ...rows.map((r) => r.join(','))].join('\n'));

  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `roulette_history_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
