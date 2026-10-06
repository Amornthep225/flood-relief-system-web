"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const OPTIONS = [
    {
        key: "emergency",
        href: "/user/sos-history",
        icon: "emergency",
        labelTh: "ประวัติ SOS",
        labelEn: "SOS history",
        descriptionTh: "ดูเฉพาะการแจ้งเหตุฉุกเฉิน",
        descriptionEn: "Emergency requests only",
    },
    {
        key: "relief",
        href: "/user/relief-history",
        icon: "inventory_2",
        labelTh: "ประวัติขอสิ่งของ",
        labelEn: "Relief item history",
        descriptionTh: "ดูเฉพาะคำขอรับสิ่งของ",
        descriptionEn: "Relief item requests only",
    },
];

export default function HistoryTypeSwitcher({ activeType }) {
    const { language } = useLanguage();

    return (
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {OPTIONS.map((option) => {
                const active = activeType === option.key;

                return (
                    <Link
                        key={option.key}
                        href={option.href}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                            active
                                ? "border-sky-400 bg-sky-50 shadow-sm ring-2 ring-sky-100"
                                : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50"
                        }`}
                    >
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                active
                                    ? "bg-sky-500 text-white"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                        >
                            <span className="material-symbols-outlined">
                                {option.icon}
                            </span>
                        </div>

                        <div className="min-w-0">
                            <p
                                className={`font-black ${
                                    active ? "text-sky-700" : "text-slate-700"
                                }`}
                            >
                                {language === "en"
                                    ? option.labelEn
                                    : option.labelTh}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                                {language === "en"
                                    ? option.descriptionEn
                                    : option.descriptionTh}
                            </p>
                        </div>

                        {active && (
                            <span className="material-symbols-outlined ml-auto text-sky-500">
                                check_circle
                            </span>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
