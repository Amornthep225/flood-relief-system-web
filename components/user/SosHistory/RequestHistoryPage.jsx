"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Swal from "sweetalert2";

import UserLayout from "@/components/layout/UserLayout";
import HistoryTypeSwitcher from "./HistoryTypeSwitcher";
import SosHistorySummary from "./SosHistorySummary";
import SosHistoryTabs from "./SosHistoryTabs";
import SosHistoryList from "./SosHistoryList";
import SosHistoryState from "./SosHistoryState";
import SosHistoryFilter from "./SosHistoryFilter";

import { getMySosRequests } from "@/services/user/sos";
import { colors } from "@/constants/colors";
import { useLanguage } from "@/contexts/LanguageContext";

const PAGE_SIZE = 8;

function normalizeStatus(status) {
    return String(status || "").trim().toLowerCase();
}

function isActiveStatus(status) {
    const normalized = normalizeStatus(status);
    return ["pending", "accepted", "preparing", "delivering"].includes(
        normalized
    );
}

function isEmergencyRequest(request) {
    return (
        String(request?.requestType || "Relief").trim().toLowerCase() ===
        "emergency"
    );
}

export default function RequestHistoryPage({ historyType = "emergency" }) {
    const { t, language } = useLanguage();
    const hasLoaded = useRef(false);

    const isEmergencyMode = historyType === "emergency";

    const [selectedFilter, setSelectedFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [requests, setRequests] = useState([]);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        status: "",
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const copy = useMemo(() => {
        if (language === "en") {
            return isEmergencyMode
                ? {
                      title: "SOS history",
                      subtitle:
                          "Review and track all emergency SOS requests you have submitted.",
                      loadError: "Failed to load SOS history.",
                  }
                : {
                      title: "Relief item request history",
                      subtitle:
                          "Review and track all requests for relief items you have submitted.",
                      loadError: "Failed to load relief item request history.",
                  };
        }

        return isEmergencyMode
            ? {
                  title: "ประวัติ SOS",
                  subtitle:
                      "ตรวจสอบและติดตามเฉพาะรายการแจ้งเหตุฉุกเฉิน SOS ของคุณ",
                  loadError: "ไม่สามารถโหลดประวัติ SOS ได้",
              }
            : {
                  title: "ประวัติการขอสิ่งของ",
                  subtitle:
                      "ตรวจสอบและติดตามเฉพาะรายการขอรับสิ่งของของคุณ",
                  loadError: "ไม่สามารถโหลดประวัติการขอสิ่งของได้",
              };
    }, [isEmergencyMode, language]);

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

                const sortedRequests = [...requestList].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setRequests(sortedRequests);
            } catch (error) {
                console.error("Failed to load request history:", error);

                await Swal.fire({
                    icon: "error",
                    title: t("sos.history.loadFailedTitle"),
                    text: error?.message || copy.loadError,
                    confirmButtonText: t("sos.history.ok"),
                    confirmButtonColor: "#3085d6",
                });
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [copy.loadError, filters, t]
    );

    useEffect(() => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;
        loadRequests();
    }, [loadRequests]);

    // แยกข้อมูลเป็นคนละหน้าอย่างชัดเจน
    const typedRequests = useMemo(() => {
        return requests.filter((request) => {
            const emergency = isEmergencyRequest(request);
            return isEmergencyMode ? emergency : !emergency;
        });
    }, [isEmergencyMode, requests]);

    const filteredRequests = useMemo(() => {
        if (selectedFilter === "active") {
            return typedRequests.filter((req) => isActiveStatus(req.status));
        }

        if (selectedFilter === "completed") {
            return typedRequests.filter(
                (req) => normalizeStatus(req.status) === "completed"
            );
        }

        if (selectedFilter === "cancelled") {
            return typedRequests.filter(
                (req) => normalizeStatus(req.status) === "cancelled"
            );
        }

        return typedRequests;
    }, [selectedFilter, typedRequests]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredRequests.length / PAGE_SIZE)
    );

    const paginatedRequests = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredRequests.slice(
            startIndex,
            startIndex + PAGE_SIZE
        );
    }, [currentPage, filteredRequests]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const summary = useMemo(() => {
        const completed = typedRequests.filter(
            (req) => normalizeStatus(req.status) === "completed"
        ).length;

        const active = typedRequests.filter((req) =>
            isActiveStatus(req.status)
        ).length;

        const cancelled = typedRequests.filter(
            (req) => normalizeStatus(req.status) === "cancelled"
        ).length;

        return {
            total: typedRequests.length,
            completed,
            active,
            cancelled,
        };
    }, [typedRequests]);

    const resetFilters = () => {
        const resetState = {
            startDate: "",
            endDate: "",
            status: "",
        };

        setFilters(resetState);
        setCurrentPage(1);
        loadRequests({ filterParams: resetState });
    };

    return (
        <UserLayout
            homeHref="/user/sos-home"
            backHref="/select-role"
            logoutHref="/user/users-login"
            showHome={false}
        >
            <section className={`w-full p-4 md:p-6 ${colors.history.page}`}>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {copy.title}
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            {copy.subtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadRequests({ showLoading: false })}
                        disabled={refreshing || loading}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                        <span
                            className={`material-symbols-outlined text-xl ${
                                refreshing ? "animate-spin" : ""
                            }`}
                        >
                            refresh
                        </span>
                        {refreshing
                            ? t("sos.history.updating")
                            : t("sos.history.update")}
                    </button>
                </div>

                <HistoryTypeSwitcher activeType={historyType} />

                {loading ? (
                    <SosHistoryState
                        icon="progress_activity"
                        title={t("sos.history.loadingTitle")}
                        description={t("sos.history.loadingText")}
                        spinning
                    />
                ) : (
                    <div className="space-y-6">
                        <SosHistoryFilter
                            historyType={historyType}
                            filters={filters}
                            onSearch={(value) => {
                                setFilters(value);
                                setCurrentPage(1);
                                loadRequests({ filterParams: value });
                            }}
                            onReset={resetFilters}
                        />

                        <SosHistorySummary
                            historyType={historyType}
                            summary={summary}
                        />

                        <SosHistoryTabs
                            selectedFilter={selectedFilter}
                            onFilterChange={(filter) => {
                                setSelectedFilter(filter);
                                setCurrentPage(1);
                            }}
                            summary={summary}
                        />

                        <SosHistoryList
                            requests={paginatedRequests}
                            selectedFilter={selectedFilter}
                        />

                        {filteredRequests.length > 0 && (
                            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">
                                    {language === "en"
                                        ? `Showing ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(
                                              currentPage * PAGE_SIZE,
                                              filteredRequests.length
                                          )} of ${filteredRequests.length}`
                                        : `แสดง ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(
                                              currentPage * PAGE_SIZE,
                                              filteredRequests.length
                                          )} จาก ${filteredRequests.length} รายการ`}
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
                )}
            </section>
        </UserLayout>
    );
}
