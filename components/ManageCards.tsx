"use client";
import { useState } from "react";
import { Card, ViewMode } from "@/lib/types";
import { isDue } from "@/lib/srs";

interface Props {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
  setView: (v: ViewMode) => void;
}

const LANG_COLORS: Record<string, string> = {
  Spanish: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  Greek:   "bg-blue-500/15 text-blue-300 border-blue-500/30",
};

const DIFF_COLORS: Record<string, string> = {
  easy:   "text-green-400",
  normal: "text-blue-400",
  hard:   "text-red-400",
};

export default function ManageCards({ cards, onEdit, onDelete, setView }: Props) {
  const [search, setSearch] = useState("");
  const [filterLang, setFilterLang] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = cards.filter(c => {
    const matchSearch = !search || [c.term, c.translation, ...c.tags].some(s =>
      s.toLowerCase().includes(search.toLowerCase())
    );
    const matchLang = filterLang === "all" || c.sourceLang === filterLang || c.targetLang === filterLang;
    return matchSearch && matchLang;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setView("dashboard")} className="text-slate-400 hover:text-white transition-colors text-sm">← Back</button>
          <h2 className="text-2xl font-bold text-white">Manage Cards</h2>
          <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-400 text-xs">{cards.length}</span>
        </div>
        <button
          onClick={() => setView("add")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 transition-all"
        >
          + Add Card
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cards…"
          className="flex-1 min-w-48 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
        />
        <select
          value={filterLang}
          onChange={e => setFilterLang(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-violet-500 transition-colors appearance-none cursor-pointer"
        >
          <option value="all">All Languages</option>
          <option value="Spanish">Spanish</option>
          <option value="Greek">Greek</option>
        </select>
      </div>

      {/* Cards list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg">{cards.length === 0 ? "No cards yet." : "No cards match your filters."}</p>
          {cards.length === 0 && (
            <button onClick={() => setView("add")} className="mt-4 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors">
              Add your first card
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(card => (
            <div
              key={card.id}
              className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-4 hover:border-slate-600 transition-colors flex gap-4 items-start"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-700">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt={card.term} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">🖼️</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-lg truncate">{card.term}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-cyan-400 font-medium truncate">{card.translation}</span>
                  {isDue(card) && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium">
                      Due
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-md text-xs border ${LANG_COLORS[card.sourceLang]}`}>{card.sourceLang}</span>
                  <span className="text-slate-600 text-xs">→</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs border ${LANG_COLORS[card.targetLang]}`}>{card.targetLang}</span>
                  <span className={`text-xs ${DIFF_COLORS[card.difficulty]}`}>● {card.difficulty}</span>
                  <span className="text-slate-500 text-xs">Reviews: {card.reviewCount}</span>
                </div>

                {card.phraseExample && (
                  <div className="text-slate-500 text-xs mt-1.5 italic truncate">"{card.phraseExample}"</div>
                )}

                {card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {card.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 text-xs border border-slate-600/40">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => onEdit(card)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors border border-slate-600"
                >
                  ✏️ Edit
                </button>
                {confirmDelete === card.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => { onDelete(card.id); setConfirmDelete(null); }}
                      className="px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors">
                      Yes
                    </button>
                    <button onClick={() => setConfirmDelete(null)}
                      className="px-2 py-1.5 rounded-lg bg-slate-600 hover:bg-slate-500 text-slate-300 text-xs transition-colors">
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(card.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors border border-red-500/20"
                  >
                    🗑️ Del
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
