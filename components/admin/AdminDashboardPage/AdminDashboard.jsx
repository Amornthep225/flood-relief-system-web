"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import Swal from "sweetalert2";
import RoleGuard from "@/components/RoleGuard/RoleGuard";

import AdminDashboardHeader from "./AdminDashboardHeader";
import AdminDashboardStats from "./AdminDashboardStats";
import AdminReliefChart from "./AdminReliefChart";
import AdminStatusChart from "./AdminStatusChart";
import AdminRecentActivities from "./AdminRecentActivities";
import AdminDashboardSkeleton from "./AdminDashboardSkeleton";

import {
    getAllDonations,
    getAllInventories,
    getAllSosRequests,
    getAllStaffs,
    getLowStockInventories,
} from "@/services/admin/dashboard";

function normalizeArray(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (Array.isArray(response?.requests)) {
        return response.requests;
    }

    if (Array.isArray(response?.staffs)) {
        return response.staffs;
    }

    if (Array.isArray(response?.donations)) {
        return response.donations;
    }

    if (Array.isArray(response?.inventories)) {
        return response.inventories;
    }

    if (Array.isArray(response?.data?.items)) {
        return response.data.items;
    }

    if (Array.isArray(response?.data?.inventories)) {
        return response.data.inventories;
    }

    return [];
}

function getInventoryQuantity(item) {
    const quantity = Number(
        item?.quantity ??
        item?.currentQuantity ??
        item?.stockQuantity ??
        item?.availableQuantity ??
        item?.balance ??
        0
    );

    return Number.isFinite(quantity)
        ? quantity
        : 0;
}

function normalizeStatus(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function statusGroup(value) {
    const status = normalizeStatus(value);

    if (status === "pending") {
        return "waiting";
    }

    if (
        [
            "accepted",
            "preparing",
            "delivering",
            "inprogress",
            "in-progress",
        ].includes(status)
    ) {
        return "progress";
    }

    if (
        [
            "completed",
            "delivered",
        ].includes(status)
    ) {
        return "completed";
    }

    return status;
}

function normalizePriority(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function toDateKey(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function buildLastDays(days) {
    const result = [];

    const formatter =
        new Intl.DateTimeFormat(
            "th-TH",
            {
                weekday: "short",
            }
        );

    for (
        let index = days - 1;
        index >= 0;
        index -= 1
    ) {
        const date = new Date();

        date.setHours(0, 0, 0, 0);
        date.setDate(
            date.getDate() - index
        );

        result.push({
            key: toDateKey(date),
            label:
                formatter.format(date),
        });
    }

    return result;
}

function createActivityFromSos(item) {
    const priority =
        normalizePriority(
            item.priority
        );

    return {
        id: `sos-${item.id}`,

        title:
            `SOS #${item.id}`,

        detail:
            item.userRemark ||
            item.addressDetail ||
            "มีคำขอความช่วยเหลือใหม่",

        createdAt:
            item.createdAt,

        icon:
            priority === "critical"
                ? "crisis_alert"
                : "warning",

        iconStyle:
            priority === "critical"
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-orange-50 text-orange-600 border-orange-100",

        badge:
            priority === "critical"
                ? "วิกฤต"
                : priority ===
                    "urgent"
                  ? "เร่งด่วน"
                  : null,
    };
}

function createActivityFromDonation(
    item
) {
    return {
        id:
            `donation-${item.id}`,

        title:
            `รายการบริจาค #${item.id}`,

        detail:
            normalizeStatus(
                item.status
            ) === "received"
                ? "รับของบริจาคเข้าคลังแล้ว"
                : "มีรายการบริจาคใหม่",

        createdAt:
            item.updatedAt ||
            item.createdAt,

        icon: "inventory_2",

        iconStyle:
            "bg-blue-50 text-blue-600 border-blue-100",

        badge: null,
    };
}

export default function AdminDashboard() {
    const [
        sosRequests,
        setSosRequests,
    ] = useState([]);

    const [
        staffs,
        setStaffs,
    ] = useState([]);

    const [
        inventories,
        setInventories,
    ] = useState([]);

    const [
        lowStockItems,
        setLowStockItems,
    ] = useState([]);

    const [
        donations,
        setDonations,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        rangeDays,
        setRangeDays,
    ] = useState(7);

    const [
        updatedAt,
        setUpdatedAt,
    ] = useState(null);

    const loadDashboard =
        useCallback(
            async (
                signal,
                showLoading = true
            ) => {
                try {
                    if (showLoading) {
                        setLoading(true);
                    } else {
                        setRefreshing(true);
                    }

                    const results =
                        await Promise.allSettled(
                            [
                                getAllSosRequests(
                                    signal
                                ),

                                getAllStaffs(
                                    signal
                                ),

                                getAllInventories(
                                    signal
                                ),

                                getLowStockInventories(
                                    signal
                                ),

                                getAllDonations(
                                    signal
                                ),
                            ]
                        );

                    const [
                        sosResult,
                        staffResult,
                        inventoryResult,
                        lowStockResult,
                        donationResult,
                    ] = results;

                    if (
                        sosResult.status ===
                        "rejected"
                    ) {
                        throw sosResult.reason;
                    }

                    setSosRequests(
                        normalizeArray(
                            sosResult.value
                        )
                    );

                    setStaffs(
                        staffResult.status ===
                            "fulfilled"
                            ? normalizeArray(
                                  staffResult.value
                              )
                            : []
                    );

                    if (
                        inventoryResult.status ===
                        "fulfilled"
                    ) {
                        setInventories(
                            normalizeArray(
                                inventoryResult.value
                            )
                        );
                    } else {
                        console.error(
                            "โหลดข้อมูลคลังสินค้าไม่สำเร็จ:",
                            inventoryResult.reason
                        );

                        setInventories([]);
                    }

                    setLowStockItems(
                        lowStockResult.status ===
                            "fulfilled"
                            ? normalizeArray(
                                  lowStockResult.value
                              )
                            : []
                    );

                    setDonations(
                        donationResult.status ===
                            "fulfilled"
                            ? normalizeArray(
                                  donationResult.value
                              )
                            : []
                    );

                    setUpdatedAt(
                        new Date()
                    );
                } catch (error) {
                    if (
                        error?.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "โหลด Dashboard ไม่สำเร็จ:",
                        error
                    );

                    await Swal.fire({
                        icon: "error",

                        title:
                            "โหลดข้อมูลไม่สำเร็จ",

                        text:
                            error?.message ||
                            "ไม่สามารถโหลดข้อมูล Dashboard ได้",

                        confirmButtonText:
                            "ตกลง",
                    });
                } finally {
                    if (
                        !signal?.aborted
                    ) {
                        setLoading(false);
                        setRefreshing(false);
                    }
                }
            },
            []
        );

    useEffect(() => {
        const controller =
            new AbortController();

        loadDashboard(
            controller.signal
        );

        return () => {
            controller.abort();
        };
    }, [loadDashboard]);

    const summary = useMemo(() => {
        const waiting =
            sosRequests.filter(
                (item) =>
                    statusGroup(
                        item.status
                    ) === "waiting"
            ).length;

        const progress =
            sosRequests.filter(
                (item) =>
                    statusGroup(
                        item.status
                    ) === "progress"
            ).length;

        const completed =
            sosRequests.filter(
                (item) =>
                    statusGroup(
                        item.status
                    ) === "completed"
            ).length;

        const critical =
            sosRequests.filter(
                (item) =>
                    normalizePriority(
                        item.priority
                    ) === "critical"
            ).length;

        const activeStaff =
            staffs.filter(
                (item) =>
                    item.isActive !==
                    false
            ).length;

        const totalInventory =
            inventories.reduce(
                (sum, item) =>
                    sum +
                    getInventoryQuantity(
                        item
                    ),
                0
            );

        const receivedDonations =
            donations.filter(
                (item) =>
                    normalizeStatus(
                        item.status
                    ) === "received"
            ).length;

        return {
            totalSos:
                sosRequests.length,

            waiting,
            progress,
            completed,
            critical,
            activeStaff,

            totalInventory,

            lowStock:
                lowStockItems.length,

            receivedDonations,
        };
    }, [
        sosRequests,
        staffs,
        inventories,
        lowStockItems,
        donations,
    ]);

    const chartData =
        useMemo(() => {
            const days =
                buildLastDays(
                    rangeDays
                );

            const requestCounts =
                new Map(
                    days.map(
                        (day) => [
                            day.key,
                            0,
                        ]
                    )
                );

            const completedCounts =
                new Map(
                    days.map(
                        (day) => [
                            day.key,
                            0,
                        ]
                    )
                );

            sosRequests.forEach(
                (item) => {
                    const key =
                        toDateKey(
                            item.createdAt
                        );

                    if (
                        requestCounts.has(
                            key
                        )
                    ) {
                        requestCounts.set(
                            key,

                            requestCounts.get(
                                key
                            ) + 1
                        );
                    }

                    if (
                        statusGroup(
                            item.status
                        ) === "completed"
                    ) {
                        const completedKey =
                            toDateKey(
                                item.updatedAt ||
                                    item.createdAt
                            );

                        if (
                            completedCounts.has(
                                completedKey
                            )
                        ) {
                            completedCounts.set(
                                completedKey,

                                completedCounts.get(
                                    completedKey
                                ) + 1
                            );
                        }
                    }
                }
            );

            return {
                labels:
                    days.map(
                        (day) =>
                            day.label
                    ),

                requests:
                    days.map(
                        (day) =>
                            requestCounts.get(
                                day.key
                            ) || 0
                    ),

                completed:
                    days.map(
                        (day) =>
                            completedCounts.get(
                                day.key
                            ) || 0
                    ),
            };
        }, [
            sosRequests,
            rangeDays,
        ]);

    const recentActivities =
        useMemo(() => {
            return [
                ...sosRequests.map(
                    createActivityFromSos
                ),

                ...donations.map(
                    createActivityFromDonation
                ),
            ]
                .filter(
                    (item) =>
                        item.createdAt
                )
                .sort(
                    (
                        first,
                        second
                    ) =>
                        new Date(
                            second.createdAt
                        ) -
                        new Date(
                            first.createdAt
                        )
                )
                .slice(0, 8);
        }, [
            sosRequests,
            donations,
        ]);

    if (loading) {
        return (
            <RoleGuard
                role="Admin"
                storageKey="admin"
                loginPath="/admin-login"
            >
                <AdminDashboardSkeleton />
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
                <AdminDashboardHeader
                    updatedAt={
                        updatedAt
                    }
                    refreshing={
                        refreshing
                    }
                    onRefresh={() => {
                        const controller =
                            new AbortController();

                        loadDashboard(
                            controller.signal,
                            false
                        );
                    }}
                />

                <main className="mx-auto w-full max-w-[1500px] space-y-8 p-4 md:p-8">
                    <AdminDashboardStats
                        summary={
                            summary
                        }
                    />

                    <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <AdminReliefChart
                            chartData={
                                chartData
                            }
                            rangeDays={
                                rangeDays
                            }
                            onRangeChange={
                                setRangeDays
                            }
                        />

                        <AdminStatusChart
                            waiting={
                                summary.waiting
                            }
                            progress={
                                summary.progress
                            }
                            completed={
                                summary.completed
                            }
                        />
                    </section>

                    <AdminRecentActivities
                        activities={
                            recentActivities
                        }
                    />
                </main>
            </div>
        </RoleGuard>
    );
}