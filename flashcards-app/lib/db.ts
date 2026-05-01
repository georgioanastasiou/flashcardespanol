import { supabase } from "./supabase";
import { Card } from "./types";

function toRow(card: Card, userId: string) {
  return {
    id: card.id,
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
  };
}

function fromRow(row: Record<string, unknown>): Card {
  return {
    id: row.id as string,
    term: row.term as string,
    translation: row.translation as string,
    phraseExample: (row.phrase_example as string) ?? "",
    phraseExampleTranslation: (row.phrase_example_translation as string) ?? "",
    imageUrl: (row.image_url as string) ?? "",
    sourceLang: row.source_lang as Card["sourceLang"],
    targetLang: row.target_lang as Card["targetLang"],
    difficulty: (row.difficulty as Card["difficulty"]) ?? "normal",
    tags: (row.tags as string[]) ?? [],
    lastReview: (row.last_review as string) ?? null,
    nextReview: (row.next_review as string) ?? null,
    easeFactor: (row.ease_factor as number) ?? 2.5,
    interval: (row.interval as number) ?? 0,
    reviewCount: (row.review_count as number) ?? 0,
    createdAt: row.created_at as string,
  };
}

export async function fetchCards(userId: string): Promise<Card[]> {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function insertCard(card: Card, userId: string): Promise<void> {
  const { error } = await supabase.from("cards").insert(toRow(card, userId));
  if (error) throw error;
}

export async function updateCard(card: Card, userId: string): Promise<void> {
  const { error } = await supabase
    .from("cards")
    .update(toRow(card, userId))
    .eq("id", card.id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function deleteCard(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function upsertCard(card: Card, userId: string): Promise<void> {
  const { error } = await supabase
    .from("cards")
    .upsert(toRow(card, userId));
  if (error) throw error;
}

export async function insertCards(cards: Card[], userId: string): Promise<void> {
  const rows = cards.map(c => toRow(c, userId));
  const { error } = await supabase.from("cards").insert(rows);
  if (error) throw error;
}
