"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, RatingKey, ViewMode } from "@/lib/types";
import { RATINGS } from "@/lib/srs";

interface Props {
  dueCards: Card[];
  reviewCard: (id: string, rating: RatingKey) => void;
  setView: (v: ViewMode) => void;
}

export default function StudyMode({ dueCards, reviewCard, setView }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(false);
  const [sessionCards] = useState<Card[]>(() => [...dueCards]);
  const [sessionDone, setSessionDone] = useState(false);
  const [imgError, setImgError] = useState(false);

  const card = sessionCards[index];
  const total = sessionCards.length;

  const flip = useCallback(() => {
    if (!rated) setFlipped(f => !f);
  }, [rated]);

  const handleRate = useCallback((rating: RatingKey) => {
    if (!card || rated) return;
    reviewCard(card.id, rating);
    setRated(true);
    setTimeout(() => {
      if (index + 1 >= total) {
        setSessionDone(true);
      } else {
        setIndex(i => i + 1);
        setFlipped(false);
        setRated(false);
        setImgError(false);
      }
    }, 300);
  }, [card, rated, reviewCard, index, total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      if (e.key === "ArrowRight" && flipped) handleRate("good");
      if (flipped) {
        if (e.key === "1") handleRate("again");
        if (e.key === "2") handleRate("hard");
        if (e.key === "3") handleRate("good");
        if (e.key === "4") handleRate("easy");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flip, flipped, handleRate]);

  if (total === 0 || sessionDone) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="text-7xl">{total === 0 ? "🎉" : "✅"}</div>
        <h2 className="text-3xl font-bold text-white">
          {total === 0 ? "All caught up!" : "Session Complete!"}
        </h2>
        <p className="text-slate-400 text-lg max-w-sm">
          {total === 0
            ? "No cards are due for review right now. Come back later or add new cards."
            : `You reviewed ${total} card${total !== 1 ? "s" : ""}. Great work! 🔥`}
        </p>
        <button
          onClick={() => setView("dashboard")}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setView("dashboard")} className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2">
          ← Back
        </button>
        <div className="text-center">
          <div className="text-slate-300 font-medium">Card {index + 1} of {total}</div>
          <div className="text-slate-500 text-xs mt-0.5">{total - index - 1} remaining</div>
        </div>
        <div className="text-slate-500 text-xs text-right">
          <span className="text-slate-400">⌨️</span> Space to flip
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${((index) / total) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={flip}
      >
        <div
          className="relative transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "460px",
          }}
        >
          {/* Front */}
          <CardFace side="front" card={card} imgError={imgError} setImgError={setImgError} />
          {/* Back */}
          <CardFace side="back" card={card} imgError={imgError} setImgError={setImgError} />
        </div>
      </div>

      {/* Rating buttons */}
      {flipped ? (
        <div className="space-y-3">
          <p className="text-center text-slate-400 text-sm">How well did you know this?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {RATINGS.map(r => (
              <button
                key={r.key}
                onClick={() => handleRate(r.key)}
                disabled={rated}
                className={`${r.color} text-white rounded-xl py-3 px-4 font-semibold transition-all active:scale-95 disabled:opacity-50 flex flex-col items-center gap-1 shadow-md`}
              >
                <span className="text-xl">{r.emoji}</span>
                <span>{r.label}</span>
                <span className="text-xs opacity-75">+{r.days}d &nbsp; [{r.shortcut}]</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={flip}
            className="px-10 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-all border border-slate-600 text-lg"
          >
            Reveal Answer
          </button>
          <p className="text-slate-500 text-xs mt-2">or press Space / Enter</p>
        </div>
      )}
    </div>
  );
}

function CardFace({ side, card, imgError, setImgError }: {
  side: "front" | "back";
  card: Card;
  imgError: boolean;
  setImgError: (v: boolean) => void;
}) {
  const isFront = side === "front";
  return (
    <div
      className="absolute inset-0 rounded-3xl overflow-hidden bg-slate-800 border border-slate-700/60 shadow-2xl p-0"
      style={{ backfaceVisibility: "hidden", transform: isFront ? "rotateY(0deg)" : "rotateY(180deg)" }}
    >
      {/* Image */}
      <div className="relative h-52 bg-slate-900 overflow-hidden">
        {card.imageUrl && !imgError ? (
          <img
            src={card.imageUrl}
            alt={card.term}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <span className="text-6xl opacity-30">🖼️</span>
          </div>
        )}
        {/* lang badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <LangBadge lang={card.sourceLang} />
          <span className="text-slate-400 text-xs self-center">→</span>
          <LangBadge lang={card.targetLang} />
        </div>
        {/* face label */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white/70 text-xs font-medium">
          {isFront ? "Front" : "Back"}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {isFront ? (
          <>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{card.term}</div>
              <div className="text-slate-500 text-sm mt-1">{card.sourceLang}</div>
            </div>
            {card.phraseExample && (
              <div className="rounded-xl bg-slate-700/50 border border-slate-600/30 px-4 py-3">
                <div className="text-slate-400 text-xs mb-1 font-medium uppercase tracking-wide">Example</div>
                <div className="text-slate-200 italic">"{card.phraseExample}"</div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="text-slate-400 text-sm">{card.targetLang} translation</div>
              <div className="text-3xl font-bold text-cyan-400 mt-1">{card.translation}</div>
            </div>
            {card.phraseExampleTranslation && (
              <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-4 py-3">
                <div className="text-cyan-400/70 text-xs mb-1 font-medium uppercase tracking-wide">Translation</div>
                <div className="text-slate-200 italic">"{card.phraseExampleTranslation}"</div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {card.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-slate-700/60 text-slate-400 text-xs border border-slate-600/40">
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LangBadge({ lang }: { lang: string }) {
  const colors: Record<string, string> = {
    Spanish: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Greek:   "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium border backdrop-blur-sm ${colors[lang] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30"}`}>
      {lang}
    </span>
  );
}
