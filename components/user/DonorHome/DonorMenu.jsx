"use client";

import Link from "next/link";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";
import { useLanguage } from "@/contexts/LanguageContext";

const menu = [
    {
        key: "shortage",
        icon: "inventory_2",
        iconBox: "bg-orange-100 text-orange-600",
        href: "/user/donor-low-products",
    },
    {
        key: "tracking",
        icon: "package_2",
        iconBox: "bg-green-100 text-green-600",
        href: "/user/donor-tracking",
    },
    {
        key: "history",
        icon: "history",
        iconBox: "bg-blue-100 text-blue-600",
        href: "/user/donor-history",
    },
];

export default function DonorMenu() {
    const { t } = useLanguage();

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {menu.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cards.donorHome.menu}
                >
                    <div
                        className={`size-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${item.iconBox}`}
                    >
                        <span className="material-symbols-outlined text-5xl">
                            {item.icon}
                        </span>
                    </div>

                    <h3 className={`${colors.donor.primaryText} text-2xl font-extrabold mb-3`}>
                        {t(`donation.home.menu.${item.key}.title`)}
                    </h3>

                    <p className={`${colors.donor.secondaryText} text-base mb-6 leading-relaxed`}>
                        {t(`donation.home.menu.${item.key}.description`)}
                    </p>

                    <div className="mt-auto flex items-center text-sky-500 font-bold text-base">
                        {t(`donation.home.menu.${item.key}.action`)}
                        <span className="material-symbols-outlined ml-2 text-xl">
                            arrow_forward
                        </span>
                    </div>
                </Link>
            ))}
        </section>
    );
}
