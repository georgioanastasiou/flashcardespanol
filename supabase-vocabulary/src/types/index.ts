export interface CardRow {
  id: string;
  user_id: string;
  term: string;
  translation: string;
  phrase_example: string;
  phrase_example_translation: string;
  image_url: string;
  source_lang: string;
  target_lang: string;
  difficulty: string;
  tags: string[];
  last_review: string | null;
  next_review: string | null;
  ease_factor: number;
  interval: number;
  review_count: number;
  created_at: string;
}
