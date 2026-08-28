"use client";

import Link from "next/link";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UserHero() {
    const { t } = useLanguage();

    return (
        <section className={cards.userHome.hero}>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[300px] -translate-y-20 translate-x-20 text-white">
                    shield
                </span>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t("home.greeting")}
                    </h1>

                    <p className="text-sky-50 text-lg opacity-95 leading-relaxed font-light">
                        {t("home.description")}
                    </p>
                </div>

                <Link href="/user/sos-form" className={buttons.userHome.sos}>
                    <span className="material-symbols-outlined text-red-500">
                        inventory_2
                    </span>
                    {t("home.reliefButton")}
                </Link>
            </div>
        </section>
    );
}
