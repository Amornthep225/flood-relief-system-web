"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";

import UserLayout from "@/components/layout/UserLayout";
import SosHistorySummary from "@/components/user/SosHistory/SosHistorySummary";
import SosHistoryTabs from "@/components/user/SosHistory/SosHistoryTabs";
import SosHistoryList from "@/components/user/SosHistory/SosHistoryList";
import SosHistoryState from "@/components/user/SosHistory/SosHistoryState";

import { getMySosRequests } from "@/services/user/sos";
import { colors } from "@/constants/colors";

export default function SosHistoryPage() {
    const hasLoaded = useRef(false);

    const [requests, setRequests] = useState([]);
    const [selectedFilter, setSelectedFilter] =
        useState("all");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] =
        useState(false);

    const loadRequests = async ({
        showLoading = true,
    } = {}) => {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const data = await getMySosRequests();

            const requestList = Array.isArray(data)
                ? data
                : [];

            const sortedRequests = [
                ...requestList,
            ].sort(
                (first, second) =>
                    new Date(
                        second.createdAt
                    ).getTime() -
                    new Date(
                        first.createdAt
                    ).getTime()
            );

            setRequests(sortedRequests);
        } catch (error) {
            console.error(
                "โหลดประวัติคำขอไม่สำเร็จ:",
                error
            );

            await Swal.fire({
                icon: "error",
                title: "โหลดข้อมูลไม่สำเร็จ",
                text:
                    error.message ||
                    "ไม่สามารถโหลดประวัติคำขอได้",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (hasLoaded.current) {
            return;
        }

        hasLoaded.current = true;
        loadRequests();
    }, []);

    const summary = useMemo(() => {
        const completedRequests =
            requests.filter(
                (request) =>
                    normalizeStatus(
                        request.status
                    ) === "completed"
            ).length;

        const activeRequests =
            requests.filter((request) =>
                isActiveStatus(request.status)
            ).length;

        const cancelledRequests =
            requests.filter(
                (request) =>
                    normalizeStatus(
                        request.status
                    ) === "cancelled"
            ).length;

        return {
            total: requests.length,
            completed: completedRequests,
            active: activeRequests,
            cancelled: cancelledRequests,
        };
    }, [requests]);

    const filteredRequests = useMemo(() => {
        if (selectedFilter === "active") {
            return requests.filter((request) =>
                isActiveStatus(request.status)
            );
        }

        if (selectedFilter === "completed") {
            return requests.filter(
                (request) =>
                    normalizeStatus(
                        request.status
                    ) === "completed"
            );
        }

        if (selectedFilter === "cancelled") {
            return requests.filter(
                (request) =>
                    normalizeStatus(
                        request.status
                    ) === "cancelled"
            );
        }

        return requests;
    }, [requests, selectedFilter]);

    return (
        <UserLayout
            homeHref="/user/sos-home"
            backHref="/user/sos-home"
            logoutHref="/user/users-login"
        >
            <section
                className={`w-full ${colors.history.page}`}
            >
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            ประวัติการขอความช่วยเหลือ
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            ตรวจสอบคำขอความช่วยเหลือทั้งหมดของคุณ
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            loadRequests({
                                showLoading: false,
                            })
                        }
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span
                            className={`material-symbols-outlined text-xl ${
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }`}
                        >
                            refresh
                        </span>

                        {refreshing
                            ? "กำลังอัปเดต..."
                            : "อัปเดตข้อมูล"}
                    </button>
                </div>

                {loading ? (
                    <SosHistoryState
                        icon="progress_activity"
                        title="กำลังโหลดประวัติ..."
                        description="กรุณารอสักครู่"
                        spinning
                    />
                ) : (
                    <>
                        <SosHistorySummary
                            summary={summary}
                        />

                        <SosHistoryTabs
                            selectedFilter={
                                selectedFilter
                            }
                            onFilterChange={
                                setSelectedFilter
                            }
                            summary={summary}
                        />

                        <SosHistoryList
                            requests={
                                filteredRequests
                            }
                            selectedFilter={
                                selectedFilter
                            }
                        />
                    </>
                )}
            </section>
        </UserLayout>
    );
}

function normalizeStatus(status) {
    return String(status || "")
        .trim()
        .toLowerCase();
}

function isActiveStatus(status) {
    const normalized =
        normalizeStatus(status);

    return [
        "pending",
        "accepted",
        "preparing",
        "delivering",
    ].includes(normalized);
}