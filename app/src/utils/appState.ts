import type { AppState } from "../types.js";

const APP_STATE_KEY = "easypantry_state";

export function loadAppState(): AppState {
  const stored = localStorage.getItem(APP_STATE_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function saveAppState(state: AppState): void {
  localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
}

export function updateAppState(updates: Partial<AppState>): void {
  const state = loadAppState();
  saveAppState({ ...state, ...updates });
}
