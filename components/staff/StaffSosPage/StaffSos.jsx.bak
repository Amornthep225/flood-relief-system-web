"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Swal from "sweetalert2";

import StaffSosHeader from "./StaffSosHeader";
import StaffSosFilter from "./StaffSosFilter";
import StaffSosSummary from "./StaffSosSummary";
import StaffSosTabs from "./StaffSosTabs";
import StaffSosList from "./StaffSosList";
import ConfirmModal from "./ConfirmModal";
import GpsModal from "./GpsModal";
import DetailsModal from "./DetailsModal";
import StaffSosSkeleton from "./StaffSosSkeleton";

import {
    acceptSosRequest,
    getStaffSosRequestById,
    getStaffSosRequests,
} from "@/services/staff/sos";

const INITIAL_FILTERS = {
    startDate: "",
    endDate: "",
    status: "",
};

const PRIORITY_ORDER = {
    critical: 1,
    urgent: 2,
    normal: 3,
};

const STATUS_ORDER = {
    pending: 1,
    delivering: 2,
    preparing: 3,
    accepted: 4,
    completed: 5,
    cancelled: 6,
    rejected: 7,
};

function normalizeSortValue(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function sortSosRequests(requests) {
    return [...requests].sort((first, second) => {
        const firstPriority =
            PRIORITY_ORDER[
                normalizeSortValue(first.priority)
            ] ?? 99;

        const secondPriority =
            PRIORITY_ORDER[
                normalizeSortValue(second.priority)
            ] ?? 99;

        if (firstPriority !== secondPriority) {
            return firstPriority - secondPriority;
        }

        const firstStatus =
            STATUS_ORDER[
                normalizeSortValue(first.status)
            ] ?? 99;

        const secondStatus =
            STATUS_ORDER[
                normalizeSortValue(second.status)
            ] ?? 99;

        if (firstStatus !== secondStatus) {
            return firstStatus - secondStatus;
        }

        return (
            new Date(second.createdAt || 0).getTime() -
            new Date(first.createdAt || 0).getTime()
        );
    });
}

export default function StaffSos() {
    const hasLoaded = useRef(false);

    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("waiting");
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [accepting, setAccepting] = useState(false);

    const [confirmRequest, setConfirmRequest] = useState(null);
    const [gpsRequest, setGpsRequest] = useState(null);
    const [detailRequest, setDetailRequest] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const loadRequests = useCallback(
        async ({
            showLoading = true,
            filterParams = filters,
        } = {}) => {
            try {
                if (showLoading) {
                    setLoading(true);
                } else {
                    setRefreshing(true);
                }

                const response =
                    await getStaffSosRequests(filterParams);

                const data = normalizeRequests(response);

                const sorted = sortSosRequests(data);

                setRequests(sorted);
            } catch (error) {
                console.error(
                    "โหลดรายการ SOS ไม่สำเร็จ:",
                    error
                );

                await Swal.fire({
                    icon: "error",
                    title: "โหลดข้อมูลไม่สำเร็จ",
                    text:
                        error.message ||
                        "ไม่สามารถโหลดรายการ SOS ได้",
                    confirmButtonText: "ตกลง",
                });
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [filters]
    );

    useEffect(() => {
        if (hasLoaded.current) {
            return;
        }

        hasLoaded.current = true;
        loadRequests({
            filterParams: INITIAL_FILTERS,
        });
    }, [loadRequests]);

    const summary = useMemo(() => {
        const waiting = requests.filter((request) =>
            isWaitingStatus(request.status)
        ).length;

        const progress = requests.filter((request) =>
            isProgressStatus(request.status)
        ).length;

        const completed = requests.filter((request) =>
            isCompletedStatus(request.status)
        ).length;

        return {
            total: requests.length,
            waiting,
            progress,
            completed,
        };
    }, [requests]);

    const visibleRequests = useMemo(() => {
        if (activeTab === "waiting") {
            return requests.filter((request) =>
                isWaitingStatus(request.status)
            );
        }

        if (activeTab === "progress") {
            return requests.filter((request) =>
                isProgressStatus(request.status)
            );
        }

        if (activeTab === "completed") {
            return requests.filter((request) =>
                isCompletedStatus(request.status)
            );
        }

        return requests;
    }, [requests, activeTab]);

    const handleFilterSearch = (nextFilters) => {
        setFilters(nextFilters);
        setActiveTab("waiting");

        loadRequests({
            filterParams: nextFilters,
        });
    };

    const handleResetFilters = () => {
        setFilters(INITIAL_FILTERS);
        setActiveTab("waiting");

        loadRequests({
            filterParams: INITIAL_FILTERS,
        });
    };

    const handleConfirmAccept = async () => {
        if (!confirmRequest?.id) {
            return;
        }

        try {
            setAccepting(true);

            await acceptSosRequest(confirmRequest.id);

            setConfirmRequest(null);
            setActiveTab("progress");

            await loadRequests({
                showLoading: false,
                filterParams: filters,
            });

            await Swal.fire({
                icon: "success",
                title: "รับงานเรียบร้อย",
                text: `คุณได้รับผิดชอบเคส #${confirmRequest.id} แล้ว`,
                confirmButtonText: "ตกลง",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "รับงานไม่สำเร็จ",
                text:
                    error.message ||
                    "ไม่สามารถรับงานนี้ได้",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setAccepting(false);
        }
    };

    const handleOpenDetail = async (request) => {
        if (!request?.id) {
            return;
        }

        try {
            setDetailLoading(true);
            setDetailRequest(request);

            const detail = await getStaffSosRequestById(
                request.id
            );

            setDetailRequest(detail);
        } catch (error) {
            setDetailRequest(null);

            await Swal.fire({
                icon: "error",
                title: "โหลดรายละเอียดไม่สำเร็จ",
                text:
                    error.message ||
                    "ไม่สามารถโหลดรายละเอียดเคสได้",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setDetailLoading(false);
        }
    };

    if (loading) {
        return <StaffSosSkeleton />;
    }

    return (
        <section className="w-full space-y-6">
            <StaffSosHeader
                refreshing={refreshing}
                onRefresh={() =>
                    loadRequests({
                        showLoading: false,
                        filterParams: filters,
                    })
                }
            />

            <StaffSosFilter
                filters={filters}
                onSearch={handleFilterSearch}
                onReset={handleResetFilters}
            />

            <StaffSosSummary summary={summary} />

            <StaffSosTabs
                activeTab={activeTab}
                onChange={setActiveTab}
                summary={summary}
            />

            <StaffSosList
                requests={visibleRequests}
                activeTab={activeTab}
                onAccept={setConfirmRequest}
                onOpenGps={setGpsRequest}
                onOpenDetail={handleOpenDetail}
            />

            {confirmRequest && (
                <ConfirmModal
                    request={confirmRequest}
                    loading={accepting}
                    onClose={() =>
                        setConfirmRequest(null)
                    }
                    onConfirm={handleConfirmAccept}
                />
            )}

            {gpsRequest && (
                <GpsModal
                    request={gpsRequest}
                    onClose={() => setGpsRequest(null)}
                />
            )}

            {detailRequest && (
                <DetailsModal
                    request={detailRequest}
                    loading={detailLoading}
                    onClose={() =>
                        setDetailRequest(null)
                    }
                />
            )}
        </section>
    );
}

function normalizeRequests(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.requests)) {
        return response.requests;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
}

function normalizeStatus(status) {
    return String(status || "")
        .trim()
        .toLowerCase();
}

function isWaitingStatus(status) {
    return normalizeStatus(status) === "pending";
}

function isProgressStatus(status) {
    return [
        "accepted",
        "preparing",
        "delivering",
    ].includes(normalizeStatus(status));
}

function isCompletedStatus(status) {
    return normalizeStatus(status) === "completed";
}