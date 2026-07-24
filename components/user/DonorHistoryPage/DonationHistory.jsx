"use client";

import { useEffect, useMemo, useState } from "react";
import DonationSummary from "./DonationSummary";
import DonationTabs from "./DonationTabs";
import DonationHistoryList from "./DonationHistoryList";
import DonationHistorySkeleton from "./DonationHistorySkeleton";
import { getMyDonations } from "@/services/user/donation";

const completedStatuses = ["completed", "received", "success"];

function isCompleted(donation) {
    return completedStatuses.includes(
        String(donation.status || "")
            .trim()
            .toLowerCase()
    );
}

function normalizeDonations(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.donations)) return response.donations;
    if (Array.isArray(response?.data)) return response.data;
    return [];
}

export default function DonationHistory() {
    const [donations, setDonations] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const loadDonations = async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);
            else setRefreshing(true);

            const response = await getMyDonations();
            const data = normalizeDonations(response)
                .filter((item) => item?.id)
                .sort(
                    (a, b) =>
                        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                );

            setDonations(data);
        } catch (error) {
            setErrorMessage(
                error?.message || "ไม่สามารถโหลดประวัติการบริจาคได้"
            );
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDonations();
    }, []);

    const filteredDonations = useMemo(() => {
        let result = [...donations];

        if (filters.startDate) {
            const start = new Date(filters.startDate);
            start.setHours(0, 0, 0, 0);
            result = result.filter(
                (item) => new Date(item.createdAt) >= start
            );
        }

        if (filters.endDate) {
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(
                (item) => new Date(item.createdAt) <= end
            );
        }

        if (activeTab === "completed") {
            result = result.filter(isCompleted);
        }

        if (activeTab === "processing") {
            result = result.filter((item) => !isCompleted(item));
        }

        return result;
    }, [donations, filters, activeTab]);

    const counts = useMemo(() => {
        const completed = filteredDonations.filter(isCompleted).length;

        return {
            all: filteredDonations.length,
            processing: filteredDonations.length - completed,
            completed,
        };
    }, [filteredDonations]);

    const totalItems = filteredDonations.reduce(
        (total, item) =>
            total +
            (item.items || []).reduce(
                (sum, i) => sum + Number(i.quantity || 0),
                0
            ),
        0
    );

    const setToday = () => {
        const today = new Date().toISOString().split("T")[0];
        setFilters({
            startDate: today,
            endDate: today,
        });
    };

    const setLast7Days = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);

        setFilters({
            startDate: start.toISOString().split("T")[0],
            endDate: end.toISOString().split("T")[0],
        });
    };

    const setThisMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);

        setFilters({
            startDate: start.toISOString().split("T")[0],
            endDate: now.toISOString().split("T")[0],
        });
    };

    if (isLoading) {
        return <DonationHistorySkeleton />;
    }

    return (
        <section className="min-h-screen w-full bg-[#eef8ff] rounded-3xl p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            ประวัติการบริจาค
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            ตรวจสอบรายการบริจาคทั้งหมดของคุณ
                        </p>
                    </div>

                    <button
                        onClick={() => loadDonations(false)}
                        disabled={refreshing}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm hover:text-sky-600 disabled:opacity-50"
                    >
                        {refreshing ? "กำลังอัปเดต..." : "↻ อัปเดตข้อมูล"}
                    </button>
                </div>

                {/* Filter */}
                <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-bold text-slate-800">
                        🔍 ค้นหาประวัติการบริจาค
                    </h2>

                    <div className="mb-5 flex gap-3 flex-wrap">
                        <button
                            onClick={setToday}
                            className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-600"
                        >
                            วันนี้
                        </button>

                        <button
                            onClick={setLast7Days}
                            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold"
                        >
                            7 วันล่าสุด
                        </button>

                        <button
                            onClick={setThisMonth}
                            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold"
                        >
                            เดือนนี้
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    startDate: e.target.value,
                                })
                            }
                            className="rounded-xl border px-4 py-3"
                        />

                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    endDate: e.target.value,
                                })
                            }
                            className="rounded-xl border px-4 py-3"
                        />
                    </div>

                    <button
                        onClick={() =>
                            setFilters({
                                startDate: "",
                                endDate: "",
                            })
                        }
                        className="mt-4 rounded-xl bg-slate-100 px-5 py-2 text-sm font-bold"
                    >
                        รีเซ็ต
                    </button>
                </div>

                <DonationSummary
                    totalDonations={counts.all}
                    totalItems={totalItems}
                />

                <div className="mt-6 border-b border-slate-200">
                    <DonationTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        counts={counts}
                    />
                </div>

                <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                    <DonationHistoryList donations={filteredDonations} />
                </div>
            </div>
        </section>
    );
}