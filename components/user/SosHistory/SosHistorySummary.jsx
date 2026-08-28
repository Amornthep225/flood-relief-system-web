"use client";

import { cards } from "@/constants/cards";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SosHistorySummary({ summary }) {
    const { t } = useLanguage();

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className={cards.userSosHistory.summaryPrimary}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="mb-1 text-sm text-orange-100">
                            {t("sos.history.summary.total")}
                        </p>

                        <h2 className="text-3xl font-bold">
                            {summary.total}
                            <span className="ml-2 text-sm font-normal">
                                {t("sos.history.summary.times")}
                            </span>
                        </h2>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                        <span className="material-symbols-outlined text-2xl">
                            assignment
                        </span>
                    </div>
                </div>
            </div>

            <div className={cards.userSosHistory.summary}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="mb-1 text-sm text-white">
                            {t("sos.history.summary.completed")}
                        </p>

                        <h2 className="text-3xl font-bold text-white">
                            {summary.completed}
                            <span className="ml-2 text-sm font-normal text-white">
                                {t("sos.history.summary.times")}
                            </span>
                        </h2>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white">
                        <span className="material-symbols-outlined text-2xl">
                            check_circle
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
