"use client";
import { Card, ViewMode } from "@/lib/types";
import { getDueCards, getWeeklyStudied, getProgressPercent } from "@/lib/srs";

interface Props {
  cards: Card[];
  studyStreak: number;
  userName: string;
  userAvatar: string;
  setView: (v: ViewMode) => void;
  resetAll: () => void;
  signOut: () => void;
}

export default function Dashboard({ cards, studyStreak, userName, userAvatar, setView, resetAll, signOut }: Props) {
  const due = getDueCards(cards);
  const weekly = getWeeklyStudied(cards);
  const progress = getProgressPercent(cards);
  const total = cards.length;

  const stats = [
    { label: "Total Cards",       value: total,          icon: "🗂️", color: "from-violet-500 to-purple-600" },
    { label: "Due Today",         value: due.length,     icon: "📅", color: "from-rose-500 to-red-600"     },
    { label: "Studied This Week", value: weekly,         icon: "📈", color: "from-blue-500 to-cyan-600"    },
    { label: "Progress",          value: `${progress}%`, icon: "🎯", color: "from-emerald-500 to-green-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        {userAvatar
          ? <img src={userAvatar} alt="avatar" className="w-16 h-16 rounded-full border-2 border-violet-500/50 mx-auto mb-3" />
          : <div className="text-6xl mb-3">🧠</div>
        }
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          LinguaCards
        </h1>
        {userName && (
          <p className="text-slate-400 mt-1 text-base">Welcome back, <span className="text-slate-300 font-medium">{userName.split(" ")[0]}</span> 👋</p>
        )}
        <p className="text-slate-500 mt-1 text-sm">Master Spanish & Greek with spaced repetition</p>
        {studyStreak > 0 && (
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium">
            🔥 {studyStreak}-day streak!
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-5 hover:border-slate-600 transition-colors">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-slate-400 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 font-medium">Overall Mastery</span>
            <span className="text-slate-400 text-sm">{progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Due alert */}
      {due.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30 p-5 flex items-center justify-between">
          <div>
            <div className="text-white font-semibold text-lg">
              📚 {due.length} card{due.length !== 1 ? "s" : ""} due for review
            </div>
            <div className="text-slate-400 text-sm mt-1">Keep your streak going!</div>
          </div>
          <button
            onClick={() => setView("study")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-violet-500/20"
          >
            Study Now →
          </button>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ActionCard
          icon="🎓"
          title="Study Session"
          desc={due.length > 0 ? `${due.length} cards waiting` : "All caught up!"}
          disabled={due.length === 0}
          onClick={() => setView("study")}
          gradient="from-violet-600 to-purple-700"
        />
        <ActionCard
          icon="➕"
          title="Add New Card"
          desc="Expand your deck"
          onClick={() => setView("add")}
          gradient="from-emerald-600 to-teal-700"
        />
        <ActionCard
          icon="📋"
          title="Manage Cards"
          desc={`${total} card${total !== 1 ? "s" : ""} in deck`}
          onClick={() => setView("manage")}
          gradient="from-blue-600 to-cyan-700"
        />
      </div>

      {/* Bottom actions */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <button
          onClick={() => { if (confirm("Delete ALL your cards? This cannot be undone.")) resetAll(); }}
          className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors border border-red-500/20"
        >
          🗑️ Reset All Cards
        </button>
        <button
          onClick={() => { if (confirm("Sign out?")) signOut(); }}
          className="px-5 py-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-400 text-sm font-medium transition-colors border border-slate-600/40 sm:hidden"
        >
          👋 Sign Out
        </button>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, gradient, disabled }: {
  icon: string; title: string; desc: string;
  onClick: () => void; gradient: string; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl p-5 text-left transition-all border ${
        disabled
          ? "bg-slate-800/30 border-slate-700/30 opacity-50 cursor-not-allowed"
          : `bg-gradient-to-br ${gradient} border-transparent hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] shadow-lg`
      }`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-white font-semibold text-lg">{title}</div>
      <div className="text-white/70 text-sm mt-1">{desc}</div>
    </button>
  );
}
