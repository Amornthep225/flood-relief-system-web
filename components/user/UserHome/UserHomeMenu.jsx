"use client";

import Link from "next/link";
import { cards } from "@/constants/cards";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UserHomeMenu() {
    const { t } = useLanguage();

    const menu = [
        {
            title: t("home.menu.knowledge.title"),
            description: t("home.menu.knowledge.description"),
            icon: "school",
            iconBox: "bg-sky-50 text-sky-500",
            href: "/user/users-knowledge",
            actionText: t("home.menu.knowledge.action"),
            actionIcon: "book",
        },
        {
            title: t("home.menu.tracking.title"),
            description: t("home.menu.tracking.description"),
            icon: "history",
            iconBox: "bg-emerald-50 text-emerald-500",
            href: "/user/sos-tracking",
            actionText: t("home.menu.tracking.action"),
            actionIcon: "arrow_forward",
        },
        {
            title: t("home.menu.history.title"),
            description: t("home.menu.history.description"),
            icon: "assignment",
            iconBox: "bg-purple-50 text-purple-500",
            href: "/user/sos-history",
            actionText: t("home.menu.history.action"),
            actionIcon: "arrow_forward",
        },
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${cards.userHome.menu} group cursor-pointer`}
                >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105 ${item.iconBox}`}>
                        <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800">{item.title}</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed font-light text-sm">{item.description}</p>
                    <div className="mt-auto inline-flex items-center gap-2 text-sky-500 font-bold transition-all group-hover:gap-3">
                        {item.actionText}
                        <span className="material-symbols-outlined text-sm">{item.actionIcon}</span>
                    </div>
                </Link>
            ))}
        </section>
    );
}
