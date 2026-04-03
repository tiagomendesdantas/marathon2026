import type { AppState, RunLog } from '../types';
import { PLAN_START_DATE } from '../data/trainingPlan';

const STORAGE_KEY = 'marathon2026';

function getDefaultState(): AppState {
  return { logs: {}, planStartDate: PLAN_START_DATE };
}

export function getAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return JSON.parse(raw) as AppState;
  } catch {
    return getDefaultState();
  }
}

export function saveAppState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getRunLog(date: string): RunLog | undefined {
  return getAppState().logs[date];
}

export function saveRunLog(log: RunLog): void {
  const state = getAppState();
  state.logs[log.date] = log;
  saveAppState(state);
}

export function deleteRunLog(date: string): void {
  const state = getAppState();
  delete state.logs[date];
  saveAppState(state);
}

export function exportData(): string {
  return JSON.stringify(getAppState(), null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json) as AppState;
    if (!data.logs || !data.planStartDate) return false;
    saveAppState(data);
    return true;
  } catch {
    return false;
  }
}
