"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import Swal from "sweetalert2";
import RoleGuard from "@/components/RoleGuard/RoleGuard";

import AdminSosHeader from "./AdminSosHeader";
import AdminSosSummary from "./AdminSosSummary";
import AdminSosFilters from "./AdminSosFilters";
import AdminSosTable from "./AdminSosTable";
import AdminSosPagination from "./AdminSosPagination";
import AdminSosSkeleton from "./AdminSosSkeleton";
import AdminSosEmpty from "./AdminSosEmpty";
import AdminAssignSosModal from "./AdminAssignSosModal";
import AdminSosDetailModal from "./AdminSosDetailModal";

import {
    assignSosRequest,
    getActiveStaffs,
    getAllSosRequests,
    getSosRequestById,
} from "@/services/admin/sos";

const PAGE_SIZE = 10;

function normalizeArray(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.requests)) return response.requests;
    if (Array.isArray(response?.staffs)) return response.staffs;
    return [];
}

function normalizeSos(item) {
    return {
        id:
            item.id ??
            item.sosRequestId ??
            "",
        userId:
            item.userId ??
            "",
        name:
            item.userFullName ??
            item.userName ??
            item.fullName ??
            "-",
        phone:
            item.userPhoneNumber ??
            item.userPhone ??
            item.phoneNumber ??
            "-",
        address:
            item.addressDetail ??
            item.address ??
            "-",
        latitude: Number(item.latitude ?? 0),
        longitude: Number(item.longitude ?? 0),
        priority:
            item.priority ??
            "Normal",
        requestType:
            item.requestType ??
            "Relief",
        emergencyType:
            item.emergencyType ??
            null,
        status:
            item.status ??
            "Pending",
        centerId:
            item.centerId ??
            "",
        centerName:
            item.centerName ??
            "-",
        assignedStaffId:
            item.assignedStaffId ??
            null,
        assignedStaffName:
            item.assignedStaffName ??
            item.staffName ??
            "",
        userRemark:
            item.userRemark ??
            item.remark ??
            "",
        staffRemark:
            item.staffRemark ??
            "",
        createdAt:
            item.createdAt ??
            null,
        updatedAt:
            item.updatedAt ??
            null,
    };
}

function normalizeStaff(item) {
    return {
        id:
            item.id ??
            item.staffId ??
            "",
        fullName:
            item.fullName ??
            item.name ??
            "-",
        phoneNumber:
            item.phoneNumber ??
            item.phone ??
            "-",
        centerId:
            item.centerId ??
            "",
        centerName:
            item.centerName ??
            item.center?.centerName ??
            "-",
        isActive:
            item.isActive !== false,
    };
}

function statusGroup(status) {
    const value = String(status || "")
        .trim()
        .toLowerCase();

    if (["pending"].includes(value)) {
        return "waiting";
    }

    if (
        [
            "accepted",
            "preparing",
            "delivering",
            "inprogress",
            "in-progress",
        ].includes(value)
    ) {
        return "progress";
    }

    if (["completed", "delivered"].includes(value)) {
        return "completed";
    }

    if (["cancelled", "canceled"].includes(value)) {
        return "cancelled";
    }

    return value;
}

function isEmergencySos(item) {
    return (
        String(item?.requestType || "Relief")
            .trim()
            .toLowerCase() === "emergency"
    );
}

export default function AdminSos() {
    const [cases, setCases] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [assignCase, setAssignCase] = useState(null);
    const [detailCase, setDetailCase] = useState(null);
    const [assigning, setAssigning] = useState(false);

    const loadData = useCallback(async (showLoading = true) => {
        const controller = new AbortController();

        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const [sosResult, staffResult] =
                await Promise.allSettled([
                    getAllSosRequests(controller.signal),
                    getActiveStaffs(controller.signal),
                ]);

            if (sosResult.status === "rejected") {
                throw sosResult.reason;
            }

            const sosList = normalizeArray(sosResult.value)
                .map(normalizeSos)
                .sort((first, second) => {
                    const firstEmergency = isEmergencySos(first);
                    const secondEmergency = isEmergencySos(second);

                    if (firstEmergency !== secondEmergency) {
                        return firstEmergency ? -1 : 1;
                    }

                    return (
                        new Date(second.createdAt || 0) -
                        new Date(first.createdAt || 0)
                    );
                });

            const staffList =
                staffResult.status === "fulfilled"
                    ? normalizeArray(staffResult.value)
                          .map(normalizeStaff)
                          .filter((staff) => staff.isActive)
                    : [];

            setCases(sosList);
            setStaffs(staffList);
        } catch (error) {
            if (error?.name === "AbortError") {
                return;
            }

            console.error("โหลดข้อมูล SOS Admin ไม่สำเร็จ:", error);

            await Swal.fire({
                icon: "error",
                title: "โหลดข้อมูลไม่สำเร็จ",
                text:
                    error?.message ||
                    "ไม่สามารถโหลดข้อมูล SOS ได้",
                confirmButtonText: "ตกลง",
            });
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
                setRefreshing(false);
            }
        }

        return () => controller.abort();
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        setPage(1);
    }, [searchText, filter]);

    const summary = useMemo(() => {
        const waiting = cases.filter(
            (item) => statusGroup(item.status) === "waiting"
        ).length;

        const progress = cases.filter(
            (item) => statusGroup(item.status) === "progress"
        ).length;

        const completed = cases.filter(
            (item) => statusGroup(item.status) === "completed"
        ).length;

        const critical = cases.filter(
            (item) => isEmergencySos(item)
        ).length;

        return {
            total: cases.length,
            waiting,
            progress,
            completed,
            critical,
        };
    }, [cases]);

    const filteredCases = useMemo(() => {
        const keyword = searchText
            .trim()
            .toLowerCase();

        return cases.filter((item) => {
            const searchableText = [
                item.id,
                item.name,
                item.phone,
                item.address,
                item.centerName,
                item.assignedStaffName,
                item.userRemark,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchSearch =
                !keyword ||
                searchableText.includes(keyword);

            const matchStatus =
                filter === "all" ||
                statusGroup(item.status) === filter;

            return matchSearch && matchStatus;
        });
    }, [
        cases,
        searchText,
        filter,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCases.length / PAGE_SIZE)
    );

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const paginatedCases = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;

        return filteredCases.slice(
            start,
            start + PAGE_SIZE
        );
    }, [filteredCases, page]);

    const openDetails = async (item) => {
        try {
            const detail = await getSosRequestById(item.id);
            setDetailCase(normalizeSos(detail));
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "โหลดรายละเอียดไม่สำเร็จ",
                text:
                    error?.message ||
                    "ไม่สามารถโหลดรายละเอียดเคสได้",
                confirmButtonText: "ตกลง",
            });
        }
    };

    const handleAssign = async ({
        caseItem,
        staffId,
        staffRemark,
    }) => {
        try {
            setAssigning(true);

            const result = await assignSosRequest(
                caseItem.id,
                staffId,
                {
                    staffRemark,
                }
            );

            const selectedStaff = staffs.find(
                (staff) => staff.id === staffId
            );

            setCases((current) =>
                current.map((item) =>
                    item.id === caseItem.id
                        ? {
                              ...item,
                              status:
                                  result?.status ||
                                  result?.data?.status ||
                                  "Accepted",
                              assignedStaffId: staffId,
                              assignedStaffName:
                                  selectedStaff?.fullName ||
                                  result?.assignedStaffName ||
                                  result?.data?.assignedStaffName ||
                                  "-",
                          }
                        : item
                )
            );

            setAssignCase(null);

            await Swal.fire({
                icon: "success",
                title: "มอบหมายงานสำเร็จ",
                text: `เคส ${caseItem.id} ถูกมอบหมายให้ ${selectedStaff?.fullName || "เจ้าหน้าที่"} แล้ว`,
                confirmButtonText: "ตกลง",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "มอบหมายงานไม่สำเร็จ",
                text:
                    error?.message ||
                    "ไม่สามารถมอบหมายเจ้าหน้าที่ได้",
                confirmButtonText: "ตกลง",
            });

            await loadData(false);
        } finally {
            setAssigning(false);
        }
    };

    if (loading) {
        return (
            <RoleGuard
                role="Admin"
                storageKey="admin"
                loginPath="/admin-login"
            >
                <AdminSosSkeleton />
            </RoleGuard>
        );
    }

    return (
        <RoleGuard
            role="Admin"
            storageKey="admin"
            loginPath="/admin-login"
        >
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <AdminSosHeader
                    onRefresh={() => loadData(false)}
                    refreshing={refreshing}
                />

                <main className="mx-auto w-full max-w-[1500px] space-y-6 p-4 md:p-8">
                    <AdminSosSummary summary={summary} />

                    <AdminSosFilters
                        searchText={searchText}
                        onSearchChange={setSearchText}
                        filter={filter}
                        onFilterChange={setFilter}
                    />

                    {paginatedCases.length === 0 ? (
                        <AdminSosEmpty />
                    ) : (
                        <>
                            <AdminSosTable
                                cases={paginatedCases}
                                onView={openDetails}
                                onAssign={setAssignCase}
                            />

                            <AdminSosPagination
                                page={page}
                                totalPages={totalPages}
                                totalItems={filteredCases.length}
                                pageSize={PAGE_SIZE}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </main>

                <AdminAssignSosModal
                    caseItem={assignCase}
                    staffs={staffs}
                    assigning={assigning}
                    onClose={() => setAssignCase(null)}
                    onConfirm={handleAssign}
                />

                <AdminSosDetailModal
                    caseItem={detailCase}
                    onClose={() => setDetailCase(null)}
                />
            </div>
        </RoleGuard>
    );
}
