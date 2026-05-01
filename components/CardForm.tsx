"use client";
import { useState } from "react";
import { Card, Language, Difficulty, ViewMode } from "@/lib/types";

type FormData = Omit<Card, "id" | "createdAt" | "lastReview" | "nextReview" | "easeFactor" | "interval" | "reviewCount">;

const LANGS: Language[] = ["Spanish", "Greek"];
const DIFFS: { value: Difficulty; label: string; color: string }[] = [
  { value: "easy",   label: "Easy",   color: "border-green-500 text-green-400" },
  { value: "normal", label: "Normal", color: "border-blue-500 text-blue-400" },
  { value: "hard",   label: "Hard",   color: "border-red-500 text-red-400" },
];

interface Props {
  initial?: Card;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  setView: (v: ViewMode) => void;
  mode: "add" | "edit";
}

const empty: FormData = {
  term: "", translation: "", phraseExample: "", phraseExampleTranslation: "",
  imageUrl: "", sourceLang: "Spanish", targetLang: "Greek",
  difficulty: "normal", tags: [],
};

export default function CardForm({ initial, onSave, onCancel, mode }: Props) {
  const [form, setForm] = useState<FormData>(
    initial ? {
      term: initial.term, translation: initial.translation,
      phraseExample: initial.phraseExample, phraseExampleTranslation: initial.phraseExampleTranslation,
      imageUrl: initial.imageUrl, sourceLang: initial.sourceLang, targetLang: initial.targetLang,
      difficulty: initial.difficulty, tags: initial.tags,
    } : empty
  );
  const [tagInput, setTagInput] = useState("");
  const [imgPreviewError, setImgPreviewError] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.term.trim()) e.term = "Term is required";
    if (!form.translation.trim()) e.translation = "Translation is required";
    if (form.sourceLang === form.targetLang) e.targetLang = "Source and target must differ";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form);
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors text-sm">← Back</button>
        <h2 className="text-2xl font-bold text-white">{mode === "add" ? "Add New Card" : "Edit Card"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Languages */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-5 space-y-4">
          <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Languages</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Source Language" error={undefined}>
              <Select value={form.sourceLang} onChange={v => set("sourceLang", v as Language)} options={LANGS} />
            </Field>
            <Field label="Target Language" error={errors.targetLang}>
              <Select value={form.targetLang} onChange={v => set("targetLang", v as Language)} options={LANGS} />
            </Field>
          </div>
        </div>

        {/* Term & Translation */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-5 space-y-4">
          <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Vocabulary</h3>
          <Field label={`Term (${form.sourceLang})`} error={errors.term}>
            <Input value={form.term} onChange={v => set("term", v)} placeholder="e.g. Gato" />
          </Field>
          <Field label={`Translation (${form.targetLang})`} error={errors.translation}>
            <Input value={form.translation} onChange={v => set("translation", v)} placeholder="e.g. Cat" />
          </Field>
        </div>

        {/* Examples */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-5 space-y-4">
          <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Phrase Examples <span className="text-slate-500 font-normal normal-case">(optional)</span></h3>
          <Field label={`Example in ${form.sourceLang}`} error={undefined}>
            <Input value={form.phraseExample} onChange={v => set("phraseExample", v)} placeholder="e.g. El gato duerme en el sofá." />
          </Field>
          <Field label={`Example in ${form.targetLang}`} error={undefined}>
            <Input value={form.phraseExampleTranslation} onChange={v => set("phraseExampleTranslation", v)} placeholder="e.g. The cat sleeps on the sofa." />
          </Field>
        </div>

        {/* Image */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-5 space-y-4">
          <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Image <span className="text-slate-500 font-normal normal-case">(optional)</span></h3>
          <Field label="Image URL" error={undefined}>
            <Input
              value={form.imageUrl}
              onChange={v => { set("imageUrl", v); setImgPreviewError(false); }}
              placeholder="https://example.com/image.jpg"
            />
          </Field>
          {form.imageUrl && (
            <div className="h-32 rounded-xl overflow-hidden bg-slate-700">
              {!imgPreviewError ? (
                <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" onError={() => setImgPreviewError(true)} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">Invalid image URL</div>
              )}
            </div>
          )}
        </div>

        {/* Tags & Difficulty */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-5 space-y-4">
          <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Metadata <span className="text-slate-500 font-normal normal-case">(optional)</span></h3>
          {/* Difficulty */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Difficulty</label>
            <div className="flex gap-3">
              {DIFFS.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => set("difficulty", d.value)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                    form.difficulty === d.value
                      ? `${d.color} bg-slate-700`
                      : "border-slate-600 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          {/* Tags */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="animals, nouns…"
                className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
              <button type="button" onClick={addTag} className="px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 text-sm transition-colors">
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/60 border border-slate-600/40 text-slate-300 text-xs">
                    {t}
                    <button type="button" onClick={() => set("tags", form.tags.filter(x => x !== t))} className="text-slate-500 hover:text-red-400 transition-colors">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-colors border border-slate-600">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-violet-500/20">
            {mode === "add" ? "✨ Add Card" : "💾 Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-slate-400 text-sm mb-2">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors appearance-none cursor-pointer"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
