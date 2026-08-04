"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";
import Link from "next/link";

import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import { colors } from "@/constants/colors";

import PublicNavbar from "@/components/common/public-navbar";
import Footer from "@/components/common/Footer/PublicFooter";

import { getHomeStatistics } from "@/services/public/home";

const theme = colors.blue;

const LINKS = {
    userLogin: "/user/users-login",
    staffLogin: "/staff/staff-login",
};

const DEFAULT_STATISTICS = {
    totalDonors: 0,
    completedSosRequests: 0,
};

function formatNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("th-TH");
}

export default function Home() {
    const [
        statistics,
        setStatistics,
    ] = useState(DEFAULT_STATISTICS);

    const [
        statisticsLoading,
        setStatisticsLoading,
    ] = useState(true);

    useEffect(() => {
        const controller =
            new AbortController();

        const loadStatistics =
            async () => {
                try {
                    setStatisticsLoading(
                        true
                    );

                    const response =
                        await getHomeStatistics(
                            controller.signal
                        );

                    setStatistics({
                        totalDonors:
                            Number(
                                response
                                    ?.totalDonors ??
                                    0
                            ),

                        completedSosRequests:
                            Number(
                                response
                                    ?.completedSosRequests ??
                                    0
                            ),
                    });
                } catch (error) {
                    if (
                        error?.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "โหลดสถิติหน้าแรกไม่สำเร็จ:",
                        error
                    );

                    setStatistics(
                        DEFAULT_STATISTICS
                    );
                } finally {
                    if (
                        !controller.signal
                            .aborted
                    ) {
                        setStatisticsLoading(
                            false
                        );
                    }
                }
            };

        loadStatistics();

        return () => {
            controller.abort();
        };
    }, []);

    const stats = useMemo(
        () => [
            {
                icon:
                    "volunteer_activism",

                number:
                    formatNumber(
                        statistics.totalDonors
                    ),

                title:
                    "ผู้ร่วมบริจาค",

                subtitle:
                    "Number of Donors",
            },

            {
                icon:
                    "verified",

                number:
                    formatNumber(
                        statistics
                            .completedSosRequests
                    ),

                title:
                    "เคสที่ช่วยเหลือสำเร็จ",

                subtitle:
                    "Completed Relief Cases",
            },
        ],
        [statistics]
    );

    return (
        <div
            className={`min-h-screen flex flex-col ${theme.page}`}
        >
            <PublicNavbar
                hotline="1784"
                options={{
                    back: false,
                }}
            />

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
                <div className="max-w-[1140px] w-full flex flex-col items-center text-center">
                    <section className="mb-10">
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${theme.badge}`}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute h-full w-full rounded-full bg-sky-500 opacity-75" />

                                <span className="relative rounded-full h-2 w-2 bg-sky-500" />
                            </span>

                            ศูนย์รวมความช่วยเหลือและบริจาคบรรเทาสาธารณภัย
                        </div>

                        <h1
                            className={`${theme.primaryText} tracking-tight text-4xl md:text-6xl font-black leading-tight mb-4`}
                        >
                            ศูนย์รวมความช่วยเหลือและบริจาคบรรเทาน้ำท่วม
                        </h1>

                        <p
                            className={`${theme.secondaryText} text-lg max-w-2xl mx-auto`}
                        >
                            ช่องทางหลักสำหรับการขอความช่วยเหลือด่วน
                            และการบริจาคสิ่งของเพื่อผู้ประสบภัย
                            เราพร้อมประสานงานและส่งต่อความช่วยเหลือ
                            ให้ถึงมือผู้ที่ต้องการโดยเร็วที่สุด
                        </p>
                    </section>

                    <section className="w-full max-w-[800px] mb-12">
                        <div
                            className={
                                cards.home
                                    .actionWrapper
                            }
                        >
                            <Link
                                href={
                                    LINKS.userLogin
                                }
                                className={
                                    cards.home
                                        .action
                                }
                            >
                                <div className="relative flex items-center justify-center gap-6 md:gap-10">
                                    <div
                                        className={
                                            cards.home
                                                .actionIcon
                                        }
                                    >
                                        <span className="material-symbols-outlined text-5xl md:text-7xl">
                                            emergency_share
                                        </span>
                                    </div>

                                    <div className="h-16 md:h-20 w-[2px] bg-white/30 rounded-full" />

                                    <div
                                        className={
                                            cards.home
                                                .actionIcon
                                        }
                                    >
                                        <span className="material-symbols-outlined text-5xl md:text-7xl">
                                            volunteer_activism
                                        </span>
                                    </div>
                                </div>

                                <div className="relative flex flex-col items-center gap-3">
                                    <span className="text-3xl md:text-6xl font-black tracking-tight">
                                        ขอความช่วยเหลือ
                                        / บริจาคสิ่งของ
                                    </span>

                                    <span className="text-sm md:text-lg font-bold opacity-80 uppercase tracking-[0.3em]">
                                        Request Help
                                        or Donate Items
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </section>

                    <section className="flex justify-center w-full px-4 mb-20">
                        <Link
                            href={
                                LINKS.staffLogin
                            }
                            className={
                                buttons.home
                                    .staff
                            }
                        >
                            <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
                                admin_panel_settings
                            </span>

                            <div className="text-left">
                                <div className="text-[10px] font-bold uppercase opacity-70 mb-1">
                                    Official Portal
                                </div>

                                <div className="text-lg font-extrabold">
                                    สำหรับเจ้าหน้าที่
                                </div>
                            </div>
                        </Link>
                    </section>

                    <section className="w-full">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-blue-200" />

                            <h4
                                className={`${theme.primaryText}/60 text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap`}
                            >
                                สรุปผลการดำเนินงาน
                                (Impact Statistics)
                            </h4>

                            <div className="h-px flex-1 bg-blue-200" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {stats.map(
                                (
                                    item
                                ) => (
                                    <div
                                        key={
                                            item.title
                                        }
                                        className={
                                            cards.stat
                                        }
                                    >
                                        <div
                                            className={
                                                cards.statIcon
                                            }
                                        >
                                            <span className="material-symbols-outlined text-3xl">
                                                {
                                                    item.icon
                                                }
                                            </span>
                                        </div>

                                        <div
                                            className={`${theme.primaryText} text-3xl md:text-4xl font-black mb-1`}
                                        >
                                            {statisticsLoading
                                                ? "..."
                                                : item.number}
                                        </div>

                                        <div
                                            className={`${theme.mutedText} text-sm font-bold uppercase tracking-wide`}
                                        >
                                            {
                                                item.title
                                            }
                                        </div>

                                        <div
                                            className={`${theme.blueText} mt-2 text-xs font-bold`}
                                        >
                                            {
                                                item.subtitle
                                            }
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                </div>
            </main>

            <Footer theme={theme} />
        </div>
    );
}