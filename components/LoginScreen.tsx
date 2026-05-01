"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-slate-800/60 border border-slate-700/50 p-10 shadow-2xl text-center space-y-8">
          {/* Logo */}
          <div className="space-y-3">
            <div className="text-7xl">🧠</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              LinguaCards
            </h1>
            <p className="text-slate-400 text-base">
              Master Spanish & Greek with spaced repetition
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-2">
            {[
              { icon: "🔁", label: "Spaced Repetition" },
              { icon: "☁️", label: "Cloud Sync" },
              { icon: "📱", label: "Any Device" },
            ].map((f) => (
              <div key={f.label} className="rounded-2xl bg-slate-700/40 border border-slate-600/30 p-3 space-y-1">
                <div className="text-2xl">{f.icon}</div>
                <div className="text-slate-400 text-xs">{f.label}</div>
              </div>
            ))}
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-base transition-all active:scale-95 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" />
                Redirecting…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <p className="text-slate-600 text-xs">
            Your cards are saved securely in the cloud and synced across all your devices.
          </p>
        </div>
      </div>
    </div>
  );
}
