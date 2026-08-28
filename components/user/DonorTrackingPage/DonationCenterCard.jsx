"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { translateMasterDataText } from "@/locales/uiPhrases";

export default function DonationCenterCard({ donation }) {
    const { language, t } = useLanguage();

    if (!donation || !donation.center) return null;

    const { center } = donation;

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                    {t("donation.tracking.centerTitle")}
                </h2>
                <span className="material-symbols-outlined text-sky-500">
                    location_on
                </span>
            </div>

            <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-base">
                    {translateMasterDataText(
                        center.centerName || "",
                        language
                    )}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                    {center.address}
                </p>

                {center.phoneNumber && (
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 pt-1">
                        <span className="material-symbols-outlined text-sm text-slate-400">
                            call
                        </span>
                        {t("donation.tracking.phone", {
                            phone: center.phoneNumber,
                        })}
                    </p>
                )}
            </div>

            {center.latitude && center.longitude && (
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${center.latitude},${center.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 text-center text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-sky-600 active:scale-[0.99] transition-all shadow-xs"
                >
                    <span className="material-symbols-outlined text-base">
                        map
                    </span>
                    {t("donation.tracking.openMap")}
                </a>
            )}
        </div>
    );
}
