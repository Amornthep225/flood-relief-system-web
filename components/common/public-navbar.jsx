"use client";

import Link from "next/link";
import { buttons } from "@/constants/buttons";
import { colors } from "@/constants/colors";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PublicNavbar({
    hotline = "1784",
    homeHref = "/",
    theme = colors.role,
    backHref = "/",
    pageClass = "",
    options = {},
}) {
    const { t } = useLanguage();
    const {
        back = true,
        hotlineButton = true,
    } = options;

    return (
        <nav className={`sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm ${pageClass}`}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
                <Link href={homeHref} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#2a93d5] rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-2xl">waves</span>
                    </div>
                    <h2 className={`${theme.primaryText} text-xl font-black uppercase tracking-tight`}>
                        Flood Relief
                    </h2>
                </Link>

                <div className="flex items-center gap-4 md:gap-6">
                    <LanguageSwitcher />

                    {back && (
                        <Link
                            href={backHref}
                            className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            {t("common.back")}
                        </Link>
                    )}

                    {hotlineButton && (
                        <div className="flex flex-col items-center">
                            <span className={`${theme.emergencyText} text-[10px] font-bold`}>
                                {t("common.emergencyHotline")}
                            </span>
                            <a href={`tel:${hotline}`} className={buttons.common.hotline}>
                                {hotline}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
