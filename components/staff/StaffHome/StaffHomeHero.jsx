"use client";

import { useNativeUi } from "@/hooks/useNativeUi";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { getPendingSosRequests } from "@/services/staff/sos";
import { formatPendingCaseBadge } from "./pendingCaseBadge";

const PENDING_CASE_REFRESH_MS = 30000;

function normalizeRequests(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.requests)) return response.requests;
    return [];
}

export default function StaffHomeHero() {
    const { ui } = useNativeUi();

    const [pendingSosCount, setPendingSosCount] = useState(0);
    const [pendingReliefCount, setPendingReliefCount] = useState(0);

    const loadPendingCaseCount = useCallback(async () => {
        try {
            const response = await getPendingSosRequests();
            const requests = normalizeRequests(response);

            const emergencyRequests = requests.filter((request) =>
                String(request?.requestType || "Relief")
                    .trim()
                    .toLowerCase() === "emergency"
            );

            const reliefRequests = requests.filter((request) =>
                String(request?.requestType || "Relief")
                    .trim()
                    .toLowerCase() !== "emergency"
            );

            setPendingSosCount(emergencyRequests.length);
            setPendingReliefCount(reliefRequests.length);
        } catch (error) {
            console.error("Load pending request count error:", error);
        }
    }, []);

    useEffect(() => {
        loadPendingCaseCount();

        const intervalId = window.setInterval(
            loadPendingCaseCount,
            PENDING_CASE_REFRESH_MS
        );

        window.addEventListener("focus", loadPendingCaseCount);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("focus", loadPendingCaseCount);
        };
    }, [loadPendingCaseCount]);

    return (
        <section className={cards.staffHome.hero}>
            <div className="absolute -right-10 -bottom-10 opacity-10">
                <span className="material-symbols-outlined text-[240px] text-white">
                    support_agent
                </span>
            </div>

            <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
                <div>
                    <h1 className="text-3xl font-bold text-white md:text-5xl">
                        {ui("สวัสดีครับ เจ้าหน้าที่")}
                    </h1>

                    <p className="mt-2 text-lg text-blue-100">
                        {ui("เจ้าหน้าที่ประจำศูนย์ประสานงานกลาง")}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/staff/staff-sos"
                        className={`${buttons.staffHome.hero} relative min-w-[220px]`}
                    >
                        <span className="material-symbols-outlined">
                            emergency
                        </span>
                        {ui("ดูรายการ SOS")}

                        {pendingSosCount > 0 && (
                            <span
                                className="absolute -right-3 -top-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-black leading-none text-white shadow-lg ring-4 ring-white"
                                aria-label={ui(
                                    `มี SOS รอรับงาน ${pendingSosCount} เคส`
                                )}
                                title={ui(
                                    `มี SOS รอเจ้าหน้าที่รับงาน ${pendingSosCount} เคส`
                                )}
                            >
                                {formatPendingCaseBadge(pendingSosCount)}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/staff/relief-requests"
                        className={`${buttons.staffHome.hero} relative min-w-[220px]`}
                    >
                        <span className="material-symbols-outlined">
                            inventory_2
                        </span>
                        {ui("คำขอรับสิ่งของ")}

                        {pendingReliefCount > 0 && (
                            <span
                                className="absolute -right-3 -top-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-orange-500 px-2 text-xs font-black leading-none text-white shadow-lg ring-4 ring-white"
                                aria-label={ui(
                                    `มีคำขอรับสิ่งของ ${pendingReliefCount} รายการ`
                                )}
                                title={ui(
                                    `มีคำขอรับสิ่งของรอเจ้าหน้าที่รับงาน ${pendingReliefCount} รายการ`
                                )}
                            >
                                {formatPendingCaseBadge(pendingReliefCount)}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </section>
    );
}
