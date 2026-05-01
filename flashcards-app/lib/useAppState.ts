"use client";
import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { Card, RatingKey, ViewMode } from "./types";
import { makeCard } from "./storage";
import { applyReview, getDueCards } from "./srs";
import { fetchCards, insertCard, insertCards, updateCard as dbUpdateCard, deleteCard as dbDeleteCard, upsertCard } from "./db";
import { supabase } from "./supabase";
import { VOCABULARY } from "./vocabularyData";

export function useAppState() {
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [studyStreak, setStudyStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("dashboard");
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) { setCards([]); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchCards(user.id)
      .then(setCards)
      .catch(console.error)
      .finally(() => setLoading(false));
    const streak = parseInt(localStorage.getItem(`streak_${user.id}`) ?? "0");
    const lastDate = localStorage.getItem(`lastStudy_${user.id}`) ?? null;
    setStudyStreak(streak);
    setLastStudyDate(lastDate);
  }, [user]);

  const saveStreak = useCallback((streak: number, date: string | null, uid: string) => {
    setStudyStreak(streak);
    setLastStudyDate(date);
    localStorage.setItem(`streak_${uid}`, String(streak));
    if (date) localStorage.setItem(`lastStudy_${uid}`, date);
  }, []);

  const addCard = useCallback(async (partial: Parameters<typeof makeCard>[0]) => {
    if (!user) return;
    const card = makeCard(partial);
    setCards(prev => [...prev, card]);
    await insertCard(card, user.id).catch(console.error);
  }, [user]);

  const updateCard = useCallback(async (updated: Card) => {
    if (!user) return;
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c));
    await dbUpdateCard(updated, user.id).catch(console.error);
  }, [user]);

  const deleteCard = useCallback(async (id: string) => {
    if (!user) return;
    setCards(prev => prev.filter(c => c.id !== id));
    await dbDeleteCard(id, user.id).catch(console.error);
  }, [user]);

  const reviewCard = useCallback(async (id: string, rating: RatingKey) => {
    if (!user) return;
    const updated = cards.find(c => c.id === id);
    if (!updated) return;
    const reviewed = applyReview(updated, rating);
    setCards(prev => prev.map(c => c.id === id ? reviewed : c));
    await upsertCard(reviewed, user.id).catch(console.error);
    const today = new Date().toISOString().split("T")[0];
    if (lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      const newStreak = lastStudyDate === yStr ? studyStreak + 1 : 1;
      saveStreak(newStreak, today, user.id);
    }
  }, [user, cards, studyStreak, lastStudyDate, saveStreak]);

  const loadVocabulary = useCallback(async () => {
    if (!user) return;
    const existingTerms = new Set(cards.map(c => c.term));
    const toAdd = VOCABULARY.filter(c => !existingTerms.has(c.term));
    if (!toAdd.length) return;
    const withIds: Card[] = toAdd.map(c => makeCard(c));
    setCards(prev => [...prev, ...withIds]);
    await insertCards(withIds, user.id).catch(console.error);
  }, [user, cards]);

  const resetAll = useCallback(async () => {
    if (!user) return;
    await Promise.all(cards.map(c => dbDeleteCard(c.id, user.id))).catch(console.error);
    setCards([]);
    saveStreak(0, null, user.id);
  }, [user, cards, saveStreak]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setView("dashboard");
  }, []);

  const dueCards = getDueCards(cards);

  return {
    user, loading,
    cards, studyStreak, lastStudyDate,
    view, setView,
    editingCard, setEditingCard,
    addCard, updateCard, deleteCard, reviewCard,
    loadVocabulary, resetAll, signOut,
    dueCards,
  };
}
