import { AppState, Card } from "./types";
import { todayStr } from "./srs";

const STORAGE_KEY = "flashcards_app_v1";

export const DEFAULT_STATE: AppState = {
  cards: [],
  settings: {
    preferredSourceLang: "Spanish",
    preferredTargetLang: "Greek",
    darkMode: false,
  },
  studyStreak: 0,
  lastStudyDate: null,
};

export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function makeCard(partial: Omit<Card, "id" | "createdAt" | "lastReview" | "nextReview" | "easeFactor" | "interval" | "reviewCount">): Card {
  return {
    ...partial,
    id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: todayStr(),
    lastReview: null,
    nextReview: null,
    easeFactor: 2.5,
    interval: 0,
    reviewCount: 0,
  };
}

export function updateStreak(state: AppState): AppState {
  const today = todayStr();
  if (state.lastStudyDate === today) return state;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const newStreak = state.lastStudyDate === yesterdayStr ? state.studyStreak + 1 : 1;
  return { ...state, studyStreak: newStreak, lastStudyDate: today };
}
