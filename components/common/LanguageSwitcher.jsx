"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1"
      aria-label={t("common.switchLanguage")}
    >
      {[
        { value: "th", label: "TH" },
        { value: "en", label: "EN" },
      ].map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          aria-pressed={language === option.value}
          className={`rounded-full px-2.5 py-1 text-xs font-black transition ${
            language === option.value
              ? "bg-sky-500 text-white shadow-sm"
              : "text-slate-500 hover:text-sky-600"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
