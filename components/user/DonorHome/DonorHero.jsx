"use client";

import Link from "next/link";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DonorHero() {
    const { t } = useLanguage();

    return (
        <section className={cards.donorHome.hero}>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-white text-center md:text-left">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-5xl font-black mb-4">
                        {t("donation.home.greeting")}
                    </h1>

                    <p className="text-blue-100 text-lg md:text-xl leading-relaxed">
                        {t("donation.home.description")}
                    </p>
                </div>

                <div className="flex-shrink-0">
                    <Link
                        href="/user/donor-form"
                        className={buttons.donorHome.primary}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            volunteer_activism
                        </span>
                        {t("donation.home.donateNow")}
                    </Link>
                </div>
            </div>

            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none flex items-center justify-end pr-8">
                <span className="material-symbols-outlined text-[240px] leading-none">
                    water_drop
                </span>
            </div>
        </section>
    );
}
