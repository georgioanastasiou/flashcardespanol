export type Language = "Spanish" | "Greek";
export type Difficulty = "easy" | "normal" | "hard";
export type RatingKey = "again" | "hard" | "good" | "easy";
export type ViewMode = "dashboard" | "study" | "add" | "edit" | "manage";

export interface Card {
  id: string;
  term: string;
  translation: string;
  phraseExample: string;
  phraseExampleTranslation: string;
  imageUrl: string;
  sourceLang: Language;
  targetLang: Language;
  difficulty: Difficulty;
  tags: string[];
  lastReview: string | null;
  nextReview: string | null;
  easeFactor: number;
  interval: number;
  reviewCount: number;
  createdAt: string;
}

export interface AppState {
  cards: Card[];
  settings: {
    preferredSourceLang: Language;
    preferredTargetLang: Language;
    darkMode: boolean;
  };
  studyStreak: number;
  lastStudyDate: string | null;
}

export interface ReviewRating {
  label: string;
  emoji: string;
  color: string;
  days: number;
  key: RatingKey;
  shortcut: string;
}
