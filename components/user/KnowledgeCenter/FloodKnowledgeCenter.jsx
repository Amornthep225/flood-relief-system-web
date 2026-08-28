"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FloodKnowledgeCenter() {
  const { dictionary } = useLanguage();
  const knowledge = dictionary.knowledge;
  const items = knowledge.items;
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(items[0]?.id || "prepare");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.title, item.summary, ...item.keywords, ...item.tips].join(" ").toLowerCase().includes(q)
    );
  }, [query, items]);

  const selectedItem = filteredItems.find((item) => item.id === selectedId) || filteredItems[0] || null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-blue-600">{knowledge.eyebrow}</p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{knowledge.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{knowledge.intro}</p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="knowledge-search" className="mb-2 block text-sm font-medium text-slate-700">{knowledge.searchLabel}</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
          <input id="knowledge-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={knowledge.searchPlaceholder} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-base text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
          <div className="text-3xl">🔎</div>
          <p className="mt-3 font-semibold text-slate-800">{knowledge.notFoundTitle}</p>
          <p className="mt-1 text-sm text-slate-500">{knowledge.notFoundText}</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {filteredItems.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`flex min-w-0 items-start gap-3 rounded-2xl border p-4 text-left transition ${selectedItem?.id === item.id ? "border-blue-300 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"}`}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">{item.icon}</span>
                <span className="min-w-0"><span className="block font-semibold text-slate-900">{item.title}</span><span className="mt-1 block text-sm leading-5 text-slate-500">{item.summary}</span></span>
              </button>
            ))}
          </div>

          {selectedItem && (
            <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-start gap-4 border-b border-slate-100 pb-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl">{selectedItem.icon}</div>
                <div><h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{selectedItem.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">{selectedItem.summary}</p></div>
              </div>
              <h3 className="mb-4 font-semibold text-slate-900">{knowledge.tipsTitle}</h3>
              <div className="space-y-3">
                {selectedItem.tips.map((tip, index) => (
                  <div key={`${selectedItem.id}-${index}`} className="flex gap-3 rounded-2xl bg-slate-50 p-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{index + 1}</span><p className="pt-0.5 text-sm leading-6 text-slate-700 sm:text-base">{tip}</p></div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm leading-6 text-amber-900"><strong>{knowledge.noteLabel}</strong> {knowledge.note}</p></div>
            </article>
          )}
        </div>
      )}
    </section>
  );
}
