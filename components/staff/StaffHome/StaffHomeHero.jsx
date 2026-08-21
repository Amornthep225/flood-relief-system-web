"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { getPendingSosRequests } from "@/services/staff/sos";
import {
    formatPendingCaseBadge,
    getPendingCaseCount,
} from "./pendingCaseBadge";

const PENDING_CASE_REFRESH_MS = 30000;

export default function StaffHomeHero() {
    const [pendingCaseCount, setPendingCaseCount] =
        useState(0);

    const loadPendingCaseCount = useCallback(
        async () => {
            try {
                const response =
                    await getPendingSosRequests();

                setPendingCaseCount(
                    getPendingCaseCount(response)
                );
            } catch (error) {
                console.error(
                    "Load pending SOS count error:",
                    error
                );
            }
        },
        []
    );

    useEffect(() => {
        loadPendingCaseCount();

        const intervalId = window.setInterval(
            loadPendingCaseCount,
            PENDING_CASE_REFRESH_MS
        );

        window.addEventListener(
            "focus",
            loadPendingCaseCount
        );

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener(
                "focus",
                loadPendingCaseCount
            );
        };
    }, [loadPendingCaseCount]);

    return (
        <section className={cards.staffHome.hero}>
            <div className="absolute -right-10 -bottom-10 opacity-10">
                <span className="material-symbols-outlined text-[240px] text-white">
                    support_agent
                </span>
            </div>

            <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                        สวัสดีครับ เจ้าหน้าที่
                    </h1>
                    <p className="text-blue-100 text-lg mt-2">
                        เจ้าหน้าที่ประจำศูนย์ประสานงานกลาง
                    </p>
                </div>

                <Link
                    href="/staff/staff-sos"
                    className={`${buttons.staffHome.hero} relative`}
                >
                    <span className="material-symbols-outlined">
                        emergency
                    </span>
                    ดูรายการ SOS

                    {pendingCaseCount > 0 && (
                        <span
                            className="absolute -right-3 -top-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-black leading-none text-white shadow-lg ring-4 ring-white"
                            aria-label={`มีเคสใหม่ ${pendingCaseCount} เคส`}
                            title={`มีเคสใหม่ที่รอเจ้าหน้าที่รับงาน ${pendingCaseCount} เคส`}
                        >
                            {formatPendingCaseBadge(
                                pendingCaseCount
                            )}
                        </span>
                    )}
                </Link>
            </div>
        </section>
    );
}
