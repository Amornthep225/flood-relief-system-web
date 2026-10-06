"use client";

import { useEffect, useMemo, useState } from "react";
import DonationSummary from "./DonationSummary";
import DonationTabs from "./DonationTabs";
import DonationHistoryList from "./DonationHistoryList";
import DonationHistorySkeleton from "./DonationHistorySkeleton";
import { getMyDonations } from "@/services/user/donation";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateUiText } from "@/locales/uiPhrases";

const completedStatuses = ["completed", "received", "success"];
const PAGE_SIZE = 8;

function isCompleted(donation) {
    return completedStatuses.includes(
        String(donation.status || "")
            .trim()
            .toLowerCase()
    );
}

function normalizeDonations(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.donations))
        return response.donations;
    if (Array.isArray(response?.data)) return response.data;
    return [];
}

export default function DonationHistory() {
    const { language, t } = useLanguage();
    const [donations, setDonations] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
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

            setErrorMessage("");

            const response = await getMyDonations();
            const data = normalizeDonations(response)
                .filter((item) => item?.id)
                .sort(
                    (a, b) =>
                        new Date(b.createdAt || 0) -
                        new Date(a.createdAt || 0)
                );

            setDonations(data);
        } catch (error) {
            setErrorMessage(
                translateUiText(error?.message || "", language) ||
                t("donation.history.loadError")
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
                (item) =>
                    new Date(item.createdAt) >= start
            );
        }

        if (filters.endDate) {
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(
                (item) =>
                    new Date(item.createdAt) <= end
            );
        }

        if (activeTab === "completed") {
            result = result.filter(isCompleted);
        }

        if (activeTab === "processing") {
            result = result.filter(
                (item) => !isCompleted(item)
            );
        }

        return result;
    }, [donations, filters, activeTab]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredDonations.length / PAGE_SIZE)
    );

    const paginatedDonations = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredDonations.slice(
            startIndex,
            startIndex + PAGE_SIZE
        );
    }, [currentPage, filteredDonations]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const counts = useMemo(() => {
        const completed =
            filteredDonations.filter(isCompleted).length;

        return {
            all: filteredDonations.length,
            processing:
                filteredDonations.length - completed,
            completed,
        };
    }, [filteredDonations]);

    const totalItems = filteredDonations.reduce(
        (total, item) =>
            total +
            (item.items || []).reduce(
                (sum, donationItem) =>
                    sum +
                    Number(donationItem.quantity || 0),
                0
            ),
        0
    );

    const setToday = () => {
        const today =
            new Date().toISOString().split("T")[0];

        setFilters({
            startDate: today,
            endDate: today,
        });
        setCurrentPage(1);
    };

    const setLast7Days = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);

        setFilters({
            startDate:
                start.toISOString().split("T")[0],
            endDate: end.toISOString().split("T")[0],
        });
        setCurrentPage(1);
    };

    const setThisMonth = () => {
        const now = new Date();
        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        setFilters({
            startDate:
                start.toISOString().split("T")[0],
            endDate: now.toISOString().split("T")[0],
        });
        setCurrentPage(1);
    };

    if (isLoading) {
        return <DonationHistorySkeleton />;
    }

    return (
        <section className="min-h-[100dvh] w-full bg-[#eef8ff] rounded-3xl p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {t("donation.history.title")}
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            {t("donation.history.subtitle")}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadDonations(false)}
                        disabled={refreshing}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm hover:text-sky-600 disabled:opacity-50"
                    >
                        {refreshing
                            ? t("donation.history.refreshing")
                            : t("donation.history.refresh")}
                    </button>
                </div>

                {errorMessage && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-bold text-slate-800">
                        {t("donation.history.searchTitle")}
                    </h2>

                    <div className="mb-5 flex gap-3 flex-wrap">
                        <button
                            type="button"
                            onClick={setToday}
                            className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-600"
                        >
                            {t("donation.history.today")}
                        </button>

                        <button
                            type="button"
                            onClick={setLast7Days}
                            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold"
                        >
                            {t("donation.history.last7Days")}
                        </button>

                        <button
                            type="button"
                            onClick={setThisMonth}
                            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold"
                        >
                            {t("donation.history.thisMonth")}
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(event) => {
                                setFilters({
                                    ...filters,
                                    startDate:
                                        event.target.value,
                                });
                                setCurrentPage(1);
                            }}
                            className="rounded-xl border px-4 py-3"
                        />

                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(event) => {
                                setFilters({
                                    ...filters,
                                    endDate:
                                        event.target.value,
                                });
                                setCurrentPage(1);
                            }}
                            className="rounded-xl border px-4 py-3"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setFilters({
                                startDate: "",
                                endDate: "",
                            });
                            setCurrentPage(1);
                        }}
                        className="mt-4 rounded-xl bg-slate-100 px-5 py-2 text-sm font-bold"
                    >
                        {t("donation.history.reset")}
                    </button>
                </div>

                <DonationSummary
                    totalDonations={counts.all}
                    totalItems={totalItems}
                />

                <div className="mt-6 border-b border-slate-200">
                    <DonationTabs
                        activeTab={activeTab}
                        onChange={(tab) => {
                            setActiveTab(tab);
                            setCurrentPage(1);
                        }}
                        counts={counts}
                    />
                </div>

                <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                    <DonationHistoryList
                        donations={paginatedDonations}
                    />

                    {filteredDonations.length > 0 && (
                        <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                {language === "en"
                                    ? `Showing ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(
                                          currentPage * PAGE_SIZE,
                                          filteredDonations.length
                                      )} of ${filteredDonations.length}`
                                    : `แสดง ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(
                                          currentPage * PAGE_SIZE,
                                          filteredDonations.length
                                      )} จาก ${filteredDonations.length} รายการ`}
                            </p>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.max(1, page - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {language === "en"
                                        ? "Previous"
                                        : "ก่อนหน้า"}
                                </button>

                                <span className="text-sm font-bold text-slate-700">
                                    {language === "en"
                                        ? `Page ${currentPage} / ${totalPages}`
                                        : `หน้า ${currentPage} / ${totalPages}`}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(
                                                totalPages,
                                                page + 1
                                            )
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {language === "en"
                                        ? "Next"
                                        : "ถัดไป"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
