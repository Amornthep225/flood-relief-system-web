"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function UserRemark({ value, onChange }) {
    const { t } = useLanguage();
    return (
        <section className="space-y-5">
            <textarea rows={4} maxLength={500} value={value} onChange={(event) => onChange(event.target.value)} placeholder={t("sos.relief.remarkPlaceholder")} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
            <p className="text-right text-xs text-slate-400">{value.length}/500</p>
        </section>
    );
}
