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
            <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-3 sm:h-auto sm:min-h-[72px] sm:px-6 sm:py-3 md:px-12">
                <Link href={homeHref} className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2a93d5] text-white sm:h-10 sm:w-10">
                        <span className="material-symbols-outlined text-2xl">waves</span>
                    </div>
                    <h2 className={`${theme.primaryText} hidden text-lg font-black uppercase tracking-tight sm:block sm:text-xl`}>
                        Flood Relief
                    </h2>
                </Link>

                <div className="ml-auto flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-3 md:gap-6">
                    <LanguageSwitcher />

                    {back && (
                        <Link
                            href={backHref}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-0 text-sm font-bold text-slate-500 transition-colors hover:bg-sky-50 hover:text-sky-600 sm:h-10 sm:w-auto sm:gap-1 sm:px-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            <span className="hidden sm:inline">{t("common.back")}</span>
                        </Link>
                    )}

                    {hotlineButton && (
                        <div className="flex shrink-0 flex-col items-center">
                            <span className={`${theme.emergencyText} hidden text-[10px] font-bold sm:block`}>
                                {t("common.emergencyHotline")}
                            </span>
                            <a href={`tel:${hotline}`} className={`${buttons.common.hotline} !h-9 !min-h-0 !w-auto !min-w-0 !rounded-xl !px-2.5 !py-0 !text-sm !leading-none sm:!h-auto sm:!px-4 sm:!py-2 sm:!text-base`}>
                                {hotline}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
