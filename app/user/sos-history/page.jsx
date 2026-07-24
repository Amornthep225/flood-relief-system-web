"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Swal from "sweetalert2";

import UserLayout from "@/components/layout/UserLayout";
import SosHistorySummary from "@/components/user/SosHistory/SosHistorySummary";
import SosHistoryTabs from "@/components/user/SosHistory/SosHistoryTabs";
import SosHistoryList from "@/components/user/SosHistory/SosHistoryList";
import SosHistoryState from "@/components/user/SosHistory/SosHistoryState";
import SosHistoryFilter from "@/components/user/SosHistory/SosHistoryFilter";

import { getMySosRequests } from "@/services/user/sos";
import { colors } from "@/constants/colors";

// --- Helper Functions (ย้ายขึ้นมาไว้ด้านบนสุด) ---
function normalizeStatus(status) {
    return String(status || "")
        .trim()
        .toLowerCase();
}

function isActiveStatus(status) {
    const normalized = normalizeStatus(status);
    return ["pending", "accepted", "preparing", "delivering"].includes(
        normalized
    );
}

export default function SosHistoryPage() {
    const hasLoaded = useRef(false);

    // Tab Filter State ('all', 'active', 'completed', 'cancelled')
    const [selectedFilter, setSelectedFilter] = useState("all");

    // Data State
    const [requests, setRequests] = useState([]);

    // Date/Status Filter State
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        status: "",
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ฟังก์ชันโหลดข้อมูลหลัก
    const loadRequests = useCallback(
        async ({ showLoading = true, filterParams = filters } = {}) => {
            try {
                if (showLoading) {
                    setLoading(true);
                } else {
                    setRefreshing(true);
                }

                const data = await getMySosRequests(filterParams);
                const requestList = Array.isArray(data) ? data : [];

                // เรียงลำดับจากสร้างล่าสุดขึ้นก่อน
                const sortedRequests = [...requestList].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setRequests(sortedRequests);
            } catch (error) {
                console.error("โหลดประวัติไม่สำเร็จ:", error);

                await Swal.fire({
                    icon: "error",
                    title: "โหลดข้อมูลไม่สำเร็จ",
                    text: error.message || "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#3085d6",
                });
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [filters]
    );

    // Initial Data Fetch
    useEffect(() => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;

        loadRequests();
    }, [loadRequests]);

    // คัดกรองข้อมูลตาม Tab ที่เลือก
    const filteredRequests = useMemo(() => {
        if (selectedFilter === "active") {
            return requests.filter((req) => isActiveStatus(req.status));
        }

        if (selectedFilter === "completed") {
            return requests.filter(
                (req) => normalizeStatus(req.status) === "completed"
            );
        }

        if (selectedFilter === "cancelled") {
            return requests.filter(
                (req) => normalizeStatus(req.status) === "cancelled"
            );
        }

        return requests;
    }, [requests, selectedFilter]);

    // คำนวณยอดสรุป (Summary Card) จากข้อมูลทั้งหมดที่ดึงมาจาก API
    const summary = useMemo(() => {
        const completed = requests.filter(
            (req) => normalizeStatus(req.status) === "completed"
        ).length;

        const active = requests.filter((req) =>
            isActiveStatus(req.status)
        ).length;

        const cancelled = requests.filter(
            (req) => normalizeStatus(req.status) === "cancelled"
        ).length;

        return {
            total: requests.length,
            completed,
            active,
            cancelled,
        };
    }, [requests]);

    // Reset Filters
    const resetFilters = () => {
        const resetState = {
            startDate: "",
            endDate: "",
            status: "",
        };

        setFilters(resetState);
        loadRequests({ filterParams: resetState });
    };

    return (
        <UserLayout
            homeHref="/user/sos-home"
            backHref="/user/sos-home"
            logoutHref="/user/users-login"
        >
            <section className={`w-full p-4 md:p-6 ${colors.history.page}`}>
                {/* Header Section */}
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
                        onClick={() => loadRequests({ showLoading: false })}
                        disabled={refreshing || loading}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        <span
                            className={`material-symbols-outlined text-xl ${refreshing ? "animate-spin" : ""
                                }`}
                        >
                            refresh
                        </span>
                        {refreshing ? "กำลังอัปเดต..." : "อัปเดตข้อมูล"}
                    </button>
                </div>

                {/* Content Section */}
                {loading ? (
                    <SosHistoryState
                        icon="progress_activity"
                        title="กำลังโหลดประวัติ..."
                        description="กรุณารอสักครู่ ระบบกำลังดึงข้อมูลของคุณ"
                        spinning
                    />
                ) : (
                    <div className="space-y-6">
                        <SosHistoryFilter
                            filters={filters}
                            onSearch={(value) => {
                                setFilters(value);
                                loadRequests({ filterParams: value });
                            }}
                            onReset={resetFilters}
                        />

                        <SosHistorySummary summary={summary} />

                        <SosHistoryTabs
                            selectedFilter={selectedFilter}
                            onFilterChange={setSelectedFilter}
                            summary={summary}
                        />

                        <SosHistoryList
                            requests={filteredRequests}
                            selectedFilter={selectedFilter}
                        />
                    </div>
                )}
            </section>
        </UserLayout>
    );
}