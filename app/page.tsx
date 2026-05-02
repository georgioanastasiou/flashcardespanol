"use client";

import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/useAppState";
import Dashboard from "@/components/Dashboard";
import StudyMode from "@/components/StudyMode";
import CardForm from "@/components/CardForm";
import ManageCards from "@/components/ManageCards";
import LoginScreen from "@/components/LoginScreen";
import { ViewMode } from "@/lib/types";

const NAV_ITEMS: { view: ViewMode; label: string; icon: string }[] = [
  { view: "dashboard", label: "Home",  icon: "🏠" },
  { view: "study",     label: "Study", icon: "��" },
  { view: "add",       label: "Add",   icon: "➕" },
  { view: "manage",    label: "Cards", icon: "📋" },
];

export default function Home() {
  const {
    user, loading,
    cards, studyStreak,
    view, setView,
    editingCard, setEditingCard,
    addCard, updateCard, deleteCard, reviewCard,
    resetAll, signOut,
    dueCards,
  } = useAppState();

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.classList.remove("page-enter");
    void el.offsetWidth;
    el.classList.add("page-enter");
  }, [view]);

  // Full-screen loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">🧠</div>
          <div className="text-slate-400 text-lg">Loading LinguaCards…</div>
        </div>
      </div>
    );
  }

  // Not logged in → show login screen
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => setView("dashboard")}
            className="flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🧠</span>
            <span className="hidden sm:block text-lg bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              LinguaCards
            </span>
          </button>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.view}
                onClick={() => { setEditingCard(null); setView(item.view); }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  view === item.view
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:block">{item.label}</span>
                {item.view === "study" && dueCards.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                    {dueCards.length > 99 ? "99+" : dueCards.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User avatar + sign out */}
          <div className="flex items-center gap-2">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="w-8 h-8 rounded-full border border-slate-600"
              />
            )}
            <button
              onClick={signOut}
              className="hidden sm:block text-slate-500 hover:text-slate-300 text-xs transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <div ref={contentRef} className="page-enter">

          {view === "dashboard" && (
            <Dashboard
              cards={cards}
              studyStreak={studyStreak}
              userName={user.user_metadata?.full_name ?? user.email ?? ""}
              userAvatar={user.user_metadata?.avatar_url ?? ""}
              setView={setView}
              resetAll={resetAll}
              signOut={signOut}
            />
          )}

          {view === "study" && (
            <StudyMode
              dueCards={dueCards}
              reviewCard={reviewCard}
              setView={setView}
            />
          )}

          {view === "add" && (
            <CardForm
              mode="add"
              setView={setView}
              onSave={data => { addCard(data); setView("manage"); }}
              onCancel={() => setView("dashboard")}
            />
          )}

          {view === "edit" && editingCard && (
            <CardForm
              mode="edit"
              initial={editingCard}
              setView={setView}
              onSave={data => {
                updateCard({ ...editingCard, ...data });
                setEditingCard(null);
                setView("manage");
              }}
              onCancel={() => { setEditingCard(null); setView("manage"); }}
            />
          )}

          {view === "manage" && (
            <ManageCards
              cards={cards}
              setView={setView}
              onEdit={card => { setEditingCard(card); setView("edit"); }}
              onDelete={deleteCard}
            />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 px-6 text-center text-slate-600 text-xs">
        LinguaCards · {cards.length} card{cards.length !== 1 ? "s" : ""} ·{" "}
        {dueCards.length > 0
          ? <span className="text-rose-500">{dueCards.length} due today</span>
          : <span className="text-emerald-600">All caught up!</span>
        }
        {studyStreak > 0 && (
          <span className="ml-2 text-orange-500">🔥 {studyStreak}-day streak</span>
        )}
      </footer>

    </div>
  );
}
