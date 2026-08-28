"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function PrioritySelector({ value, onChange }) {
    const { t } = useLanguage();

    return (
        <section className="space-y-5">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
                <option value="Normal">{t("sos.extras.priority.normal")}</option>
                <option value="Urgent">{t("sos.extras.priority.urgent")}</option>
                <option value="Critical">
                    {t("sos.extras.priority.critical")}
                </option>
            </select>
        </section>
    );
}
