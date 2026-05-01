import { Card, RatingKey, ReviewRating } from "./types";

export const RATINGS: ReviewRating[] = [
  { key: "again", label: "Again",  emoji: "🔴", color: "bg-red-500 hover:bg-red-600",    days: 1,  shortcut: "1" },
  { key: "hard",  label: "Hard",   emoji: "🟡", color: "bg-yellow-500 hover:bg-yellow-600", days: 3,  shortcut: "2" },
  { key: "good",  label: "Good",   emoji: "🔵", color: "bg-blue-500 hover:bg-blue-600",   days: 10, shortcut: "3" },
  { key: "easy",  label: "Easy",   emoji: "🟢", color: "bg-green-500 hover:bg-green-600",  days: 30, shortcut: "4" },
];

const QUALITY_MAP: Record<RatingKey, number> = {
  again: 0,
  hard:  2,
  good:  4,
  easy:  5,
};

export function applyReview(card: Card, rating: RatingKey): Card {
  const today = todayStr();
  const q = QUALITY_MAP[rating];
  let { easeFactor, interval, reviewCount } = card;

  // SM-2 ease factor update
  const newEase = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  // Interval calculation
  let newInterval: number;
  if (q < 3) {
    newInterval = 1; // reset
  } else if (reviewCount === 0) {
    newInterval = 1;
  } else if (reviewCount === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEase);
  }

  // Override with fixed intervals per spec
  const fixedIntervals: Record<RatingKey, number> = { again: 1, hard: 3, good: 10, easy: 30 };
  newInterval = fixedIntervals[rating];

  const nextReview = addDays(today, newInterval);

  return {
    ...card,
    lastReview: today,
    nextReview,
    easeFactor: newEase,
    interval: newInterval,
    reviewCount: reviewCount + 1,
  };
}

export function isDue(card: Card): boolean {
  if (!card.nextReview) return true;
  return card.nextReview <= todayStr();
}

export function getDueCards(cards: Card[]): Card[] {
  return cards.filter(isDue);
}

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function getWeeklyStudied(cards: Card[]): number {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];
  return cards.filter(c => c.lastReview && c.lastReview >= weekAgoStr).length;
}

export function getProgressPercent(cards: Card[]): number {
  if (!cards.length) return 0;
  const learned = cards.filter(c => c.reviewCount > 0 && c.interval >= 10).length;
  return Math.round((learned / cards.length) * 100);
}
