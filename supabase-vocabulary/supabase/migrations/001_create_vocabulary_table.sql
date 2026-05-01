-- Run this in Supabase SQL Editor if the cards table doesn't exist yet
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  translation TEXT NOT NULL,
  phrase_example TEXT NOT NULL DEFAULT '',
  phrase_example_translation TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  source_lang TEXT NOT NULL DEFAULT 'Greek',
  target_lang TEXT NOT NULL DEFAULT 'Spanish',
  difficulty TEXT NOT NULL DEFAULT 'normal',
  tags TEXT[] NOT NULL DEFAULT '{}',
  last_review TEXT,
  next_review TEXT,
  ease_factor NUMERIC NOT NULL DEFAULT 2.5,
  interval INT NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cards"
  ON cards FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
