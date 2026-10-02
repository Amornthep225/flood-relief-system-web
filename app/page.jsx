"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import { colors } from "@/constants/colors";
import PublicNavbar from "@/components/common/public-navbar";
import Footer from "@/components/common/Footer/PublicFooter";
import { getHomeStatistics } from "@/services/public/home";
import { useLanguage } from "@/contexts/LanguageContext";

const theme = colors.blue;
const LINKS = {
  userLogin: "/user/users-login",
  staffLogin: "/staff/staff-login",
};
const DEFAULT_STATISTICS = {
  totalDonors: 0,
  completedSosRequests: 0,
};

export default function Home() {
  const { language, t } = useLanguage();
  const [statistics, setStatistics] = useState(DEFAULT_STATISTICS);
  const [statisticsLoading, setStatisticsLoading] = useState(true);

  const formatNumber = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return "0";
    return number.toLocaleString(language === "th" ? "th-TH" : "en-US");
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadStatistics = async () => {
      try {
        setStatisticsLoading(true);
        const response = await getHomeStatistics(controller.signal);
        setStatistics({
          totalDonors: Number(response?.totalDonors ?? 0),
          completedSosRequests: Number(response?.completedSosRequests ?? 0),
        });
      } catch (error) {
        if (error?.name === "AbortError") return;
        console.error("Failed to load home statistics:", error);
        setStatistics(DEFAULT_STATISTICS);
      } finally {
        if (!controller.signal.aborted) setStatisticsLoading(false);
      }
    };

    loadStatistics();
    return () => controller.abort();
  }, []);

  const stats = useMemo(
    () => [
      {
        icon: "volunteer_activism",
        number: formatNumber(statistics.totalDonors),
        title: t("publicHome.donors"),
        subtitle: t("publicHome.donorsEn"),
      },
      {
        icon: "verified",
        number: formatNumber(statistics.completedSosRequests),
        title: t("publicHome.completedCases"),
        subtitle: t("publicHome.completedCasesEn"),
      },
    ],
    [statistics, language, t]
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-mainPageBackground">
      <PublicNavbar hotline="1784" options={{ back: false }} />

      <main className="flex flex-1 flex-col items-center justify-center px-3 py-8 sm:px-4 sm:py-12 md:py-20">
        <div className="max-w-[1140px] w-full flex flex-col items-center text-center">
          <section className="mb-7 sm:mb-10">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${theme.badge}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-sky-500 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-sky-500" />
              </span>
              {t("publicHome.badge")}
            </div>

            <h1 className={`${theme.primaryText} tracking-tight text-3xl sm:text-4xl md:text-6xl font-black leading-tight mb-4`}>
              {t("publicHome.title")}
            </h1>

            <p className={`${theme.secondaryText} mx-auto max-w-2xl text-base leading-7 sm:text-lg`}>
              {t("publicHome.description")}
            </p>
          </section>

          <section className="mb-9 w-full max-w-[800px] sm:mb-12">
            <div className={cards.home.actionWrapper}>
              <Link href={LINKS.userLogin} className={cards.home.action}>
                <div className="relative flex items-center justify-center gap-4 sm:gap-6 md:gap-10">
                  <div className={cards.home.actionIcon}>
                    <span className="material-symbols-outlined text-4xl sm:text-5xl md:text-7xl">emergency_share</span>
                  </div>
                  <div className="h-12 w-[2px] rounded-full bg-white/30 sm:h-16 md:h-20" />
                  <div className={cards.home.actionIcon}>
                    <span className="material-symbols-outlined text-4xl sm:text-5xl md:text-7xl">volunteer_activism</span>
                  </div>
                </div>

                <div className="relative flex flex-col items-center gap-3">
                  <span className="text-2xl font-black tracking-tight sm:text-3xl md:text-6xl">
                    {t("publicHome.mainAction")}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80 sm:text-sm sm:tracking-[0.3em] md:text-lg">
                    {t("publicHome.mainActionEn")}
                  </span>
                </div>
              </Link>
            </div>
          </section>

          <section className="mb-12 flex w-full justify-center px-1 sm:mb-20 sm:px-4">
            <Link href={LINKS.staffLogin} className={buttons.home.staff}>
              <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
                admin_panel_settings
              </span>
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase opacity-70 mb-1">
                  {t("publicHome.officialPortal")}
                </div>
                <div className="text-lg font-extrabold">
                  {t("publicHome.staffPortal")}
                </div>
              </div>
            </Link>
          </section>

          <section className="w-full">
            <div className="mb-6 flex items-center justify-center gap-2 sm:mb-8 sm:gap-4">
              <div className="h-px flex-1 bg-blue-200" />
              <h4 className={`${theme.primaryText}/60 text-[10px] font-black uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.2em] sm:whitespace-nowrap`}>
                {t("publicHome.impact")} ({t("publicHome.impactEn")})
              </h4>
              <div className="h-px flex-1 bg-blue-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((item) => (
                <div key={item.title} className={cards.stat}>
                  <div className={cards.statIcon}>
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <div className={`${theme.primaryText} text-3xl md:text-4xl font-black mb-1`}>
                    {statisticsLoading ? "..." : item.number}
                  </div>
                  <div className={`${theme.mutedText} text-sm font-bold uppercase tracking-wide`}>
                    {item.title}
                  </div>
                  <div className={`${theme.blueText} mt-2 text-xs font-bold`}>
                    {item.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer className="bg-mainWhite" />
    </div>
  );
}
