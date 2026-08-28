"use client";

import { cards } from "@/constants/cards";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DonationSummary({
    totalDonations = 0,
    totalItems = 0,
}) {
    const { t } = useLanguage();

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className={cards.donorHistory.summaryPrimary}>
                <p className="mb-1 text-sm text-slate-500">
                    {t("donation.history.summaryDonated")}
                </p>

                <h2 className="text-3xl font-bold">
                    {t("donation.history.times", {
                        count: totalDonations,
                    })}
                </h2>
            </div>

            <div className={cards.donorHistory.summary}>
                <p className="mb-1 text-sm text-slate-500">
                    {t("donation.history.summaryItems")}
                </p>

                <h2 className="text-3xl font-bold">
                    {totalItems}

                    <span className="ml-1 text-sm font-normal text-slate-500">
                        {t("donation.history.pieces")}
                    </span>
                </h2>
            </div>
        </div>
    );
}
