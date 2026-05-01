import { v4 as uuidv4 } from "uuid";
import { VOCABULARY } from "../../../flashcards-app/lib/vocabularyData";
import { CardRow } from "../types";

export function buildRows(userId: string): CardRow[] {
  return VOCABULARY.map((card) => ({
    id: uuidv4(),
    user_id: userId,
    term: card.term,
    translation: card.translation,
    phrase_example: card.phraseExample,
    phrase_example_translation: card.phraseExampleTranslation,
    image_url: card.imageUrl,
    source_lang: card.sourceLang,
    target_lang: card.targetLang,
    difficulty: card.difficulty,
    tags: card.tags,
    last_review: card.lastReview,
    next_review: card.nextReview,
    ease_factor: card.easeFactor,
    interval: card.interval,
    review_count: card.reviewCount,
    created_at: card.createdAt,
  }));
}
