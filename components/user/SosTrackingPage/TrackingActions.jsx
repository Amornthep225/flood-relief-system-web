"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function TrackingActions() {
    const { t } = useLanguage();

    return (
        <div className="p-6 bg-slate-50 border-t border-slate-100">
            <a
                href="tel:1784"
                className="w-full bg-slate-800 hover:bg-slate-900 active:scale-[0.99] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-800/20 flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined">support_agent</span>
                {t("sos.tracking.centralContact")}
            </a>
        </div>
    );
}
