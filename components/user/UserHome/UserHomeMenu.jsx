"use client";

import Link from "next/link";
import { cards } from "@/constants/cards";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UserHomeMenu() {
    const { t, language } = useLanguage();

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
            icon: "location_on",
            iconBox: "bg-emerald-50 text-emerald-500",
            href: "/user/sos-tracking",
            actionText: t("home.menu.tracking.action"),
            actionIcon: "arrow_forward",
        },
        {
            title: language === "en" ? "SOS history" : "ประวัติ SOS",
            description:
                language === "en"
                    ? "Review and track your emergency SOS requests separately."
                    : "ดูและติดตามประวัติการแจ้งเหตุฉุกเฉิน SOS แยกโดยเฉพาะ",
            icon: "emergency",
            iconBox: "bg-red-50 text-red-500",
            href: "/user/sos-history",
            actionText: language === "en" ? "View SOS history" : "ดูประวัติ SOS",
            actionIcon: "arrow_forward",
        },
        {
            title:
                language === "en"
                    ? "Relief item history"
                    : "ประวัติขอสิ่งของ",
            description:
                language === "en"
                    ? "Review and track your relief item requests separately."
                    : "ดูและติดตามประวัติคำขอรับสิ่งของแยกจากรายการ SOS",
            icon: "inventory_2",
            iconBox: "bg-purple-50 text-purple-500",
            href: "/user/relief-history",
            actionText:
                language === "en" ? "View item history" : "ดูประวัติขอสิ่งของ",
            actionIcon: "arrow_forward",
        },
    ];

    return (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {menu.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${cards.userHome.menu} group cursor-pointer`}
                >
                    <div
                        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${item.iconBox}`}
                    >
                        <span className="material-symbols-outlined text-3xl">
                            {item.icon}
                        </span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-800">
                        {item.title}
                    </h3>
                    <p className="mb-8 text-sm font-light leading-relaxed text-slate-500">
                        {item.description}
                    </p>
                    <div className="mt-auto inline-flex items-center gap-2 font-bold text-sky-500 transition-all group-hover:gap-3">
                        {item.actionText}
                        <span className="material-symbols-outlined text-sm">
                            {item.actionIcon}
                        </span>
                    </div>
                </Link>
            ))}
        </section>
    );
}
