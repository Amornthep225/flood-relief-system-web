"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LowProductsEmpty() {
    const { t } = useLanguage();

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <span className="material-symbols-outlined text-5xl">
                    inventory
                </span>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-700">
                {t("donation.lowStock.emptyTitle")}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                {t("donation.lowStock.emptyText")}
            </p>
        </div>
    );
}
