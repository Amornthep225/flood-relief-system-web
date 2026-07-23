"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import {
    getCenterById,
    getInventoryByCenter,
    getInventoryTransactions,
    stockIn,
    stockOut,
} from "@/services/admin/center-inventory";
import AdminInventoryHeader from "./AdminInventoryHeader";
import AdminInventorySummary from "./AdminInventorySummary";
import AdminInventoryFilters from "./AdminInventoryFilters";
import AdminInventoryTable from "./AdminInventoryTable";
import InventoryTransactionTable from "./InventoryTransactionTable";
import AdminInventoryPagination from "./AdminInventoryPagination";
import InventoryActionModal from "./InventoryActionModal";
import AdminInventorySkeleton from "./AdminInventorySkeleton";
import AdminInventoryEmpty from "./AdminInventoryEmpty";

const PAGE_SIZE = 10;

function normalizeArray(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

function normalizeInventory(item) {
    const quantity = Number(
        item.quantity ??
            item.currentQuantity ??
            0
    );

    const minimumQuantity = Number(
        item.minimumQuantity ??
            item.minQuantity ??
            0
    );

    return {
        id: item.id ?? "",
        centerId:
            item.centerId ??
            item.center?.id ??
            "",
        centerName:
            item.centerName ??
            item.center?.centerName ??
            "",
        reliefItemId:
            item.reliefItemId ??
            item.reliefItem?.id ??
            "",
        reliefItemName:
            item.reliefItemName ??
            item.reliefItem?.name ??
            "-",
        categoryName:
            item.categoryName ??
            item.reliefCategoryName ??
            item.reliefItem?.categoryName ??
            "",
        unit:
            item.unit ??
            item.reliefItem?.unit ??
            "",
        quantity,
        minimumQuantity,
        stockStatus:
            item.stockStatus ??
            (quantity === 0
                ? "OutOfStock"
                : quantity <= minimumQuantity
                  ? "LowStock"
                  : "Normal"),
        updatedAt:
            item.updatedAt ??
            item.createdAt ??
            null,
    };
}

function normalizeTransaction(item) {
    return {
        id: item.id ?? "",
        transactionType:
            item.transactionType ??
            item.type ??
            "-",
        reliefItemName:
            item.reliefItemName ??
            item.reliefItem?.name ??
            "-",
        quantity:
            Number(item.quantity ?? 0),
        quantityBefore:
            item.quantityBefore ?? null,
        quantityAfter:
            item.quantityAfter ?? null,
        referenceType:
            item.referenceType ?? "-",
        referenceId:
            item.referenceId ?? "-",
        note: item.note ?? "",
        createdAt:
            item.createdAt ?? null,
    };
}

export default function AdminInventory() {
    const searchParams = useSearchParams();
    const centerId =
        searchParams.get("centerId") ?? "";

    const [center, setCenter] =
        useState(null);
    const [items, setItems] =
        useState([]);
    const [transactions, setTransactions] =
        useState([]);
    const [activeTab, setActiveTab] =
        useState("inventory");
    const [searchText, setSearchText] =
        useState("");
    const [statusFilter, setStatusFilter] =
        useState("all");
    const [page, setPage] =
        useState(1);
    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);
    const [error, setError] =
        useState("");
    const [modal, setModal] =
        useState(null);

    const loadData = useCallback(
        async () => {
            if (!centerId) {
                setError(
                    "ไม่พบ centerId ใน URL"
                );
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const [
                    centerResult,
                    inventoryResult,
                    transactionResult,
                ] = await Promise.allSettled([
                    getCenterById(centerId),
                    getInventoryByCenter(
                        centerId
                    ),
                    getInventoryTransactions(
                        centerId
                    ),
                ]);

                if (
                    centerResult.status ===
                    "rejected"
                ) {
                    throw centerResult.reason;
                }

                if (
                    inventoryResult.status ===
                    "rejected"
                ) {
                    throw inventoryResult.reason;
                }

                setCenter(
                    centerResult.value
                );

                setItems(
                    normalizeArray(
                        inventoryResult.value
                    ).map(
                        normalizeInventory
                    )
                );

                setTransactions(
                    transactionResult.status ===
                    "fulfilled"
                        ? normalizeArray(
                              transactionResult.value
                          ).map(
                              normalizeTransaction
                          )
                        : []
                );
            } catch (requestError) {
                setError(
                    requestError?.message ||
                        "เกิดข้อผิดพลาดในการโหลดข้อมูลคลัง"
                );
            } finally {
                setLoading(false);
            }
        },
        [centerId]
    );

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        setPage(1);
    }, [
        searchText,
        statusFilter,
        activeTab,
    ]);

    const filteredItems = useMemo(() => {
        const keyword = searchText
            .trim()
            .toLowerCase();

        return items.filter((item) => {
            const matchSearch =
                !keyword ||
                [
                    item.reliefItemId,
                    item.reliefItemName,
                    item.categoryName,
                    item.unit,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                    .includes(keyword);

            const matchStatus =
                statusFilter === "all" ||
                item.stockStatus ===
                    statusFilter;

            return (
                matchSearch &&
                matchStatus
            );
        });
    }, [
        items,
        searchText,
        statusFilter,
    ]);

    const filteredTransactions =
        useMemo(() => {
            const keyword = searchText
                .trim()
                .toLowerCase();

            return transactions.filter(
                (item) =>
                    !keyword ||
                    [
                        item.transactionType,
                        item.reliefItemName,
                        item.referenceType,
                        item.referenceId,
                        item.note,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase()
                        .includes(keyword)
            );
        }, [
            transactions,
            searchText,
        ]);

    const currentRows =
        activeTab === "inventory"
            ? filteredItems
            : filteredTransactions;

    const totalPages = Math.max(
        1,
        Math.ceil(
            currentRows.length /
                PAGE_SIZE
        )
    );

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const paginatedRows = useMemo(() => {
        const start =
            (page - 1) * PAGE_SIZE;

        return currentRows.slice(
            start,
            start + PAGE_SIZE
        );
    }, [currentRows, page]);

    const summary = useMemo(() => {
        return {
            totalItems: items.length,
            totalQuantity:
                items.reduce(
                    (sum, item) =>
                        sum +
                        item.quantity,
                    0
                ),
            lowStock:
                items.filter(
                    (item) =>
                        item.stockStatus ===
                        "LowStock"
                ).length,
            outOfStock:
                items.filter(
                    (item) =>
                        item.stockStatus ===
                        "OutOfStock"
                ).length,
        };
    }, [items]);

    function openStockModal(
        mode,
        item
    ) {
        setModal({
            mode,
            item,
        });
    }

    async function submitStockAction(
        values
    ) {
        try {
            setSaving(true);

            const payload = {
                centerId,
                reliefItemId:
                    values.reliefItemId,
                quantity: Number(
                    values.quantity
                ),
                note:
                    values.note.trim(),
            };

            if (
                !payload.reliefItemId
            ) {
                throw new Error(
                    "ไม่พบรหัสสิ่งของ"
                );
            }

            if (
                !Number.isInteger(
                    payload.quantity
                ) ||
                payload.quantity <= 0
            ) {
                throw new Error(
                    "จำนวนต้องเป็นเลขจำนวนเต็มมากกว่า 0"
                );
            }

            if (
                modal.mode ===
                "stock-in"
            ) {
                await stockIn(
                    payload
                );
            } else {
                await stockOut(
                    payload
                );
            }

            setModal(null);
            await loadData();

            await Swal.fire({
                icon: "success",
                title:
                    modal.mode ===
                    "stock-in"
                        ? "เพิ่มสต็อกสำเร็จ"
                        : "ตัดสต็อกสำเร็จ",
                confirmButtonText:
                    "ตกลง",
            });
        } catch (actionError) {
            await Swal.fire({
                icon: "error",
                title:
                    "ทำรายการไม่สำเร็จ",
                text:
                    actionError?.message ||
                    "กรุณาลองใหม่อีกครั้ง",
                confirmButtonText:
                    "ตกลง",
            });
        } finally {
            setSaving(false);
        }
    }

    return (
        <RoleGuard
            role="Admin"
            storageKey="admin"
            loginPath="/admin-login"
        >
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <AdminInventoryHeader
                    center={center}
                    centerId={centerId}
                    onRefresh={loadData}
                />

                <main className="mx-auto w-full max-w-[1500px] space-y-6 p-4 md:p-8">
                    <AdminInventorySummary
                        summary={summary}
                    />

                    <AdminInventoryFilters
                        activeTab={activeTab}
                        searchText={
                            searchText
                        }
                        statusFilter={
                            statusFilter
                        }
                        onTabChange={
                            setActiveTab
                        }
                        onSearchChange={
                            setSearchText
                        }
                        onStatusChange={
                            setStatusFilter
                        }
                    />

                    {error && (
                        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 md:flex-row md:items-center md:justify-between">
                            <span>
                                {error}
                            </span>

                            <button
                                type="button"
                                onClick={
                                    loadData
                                }
                                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
                            >
                                ลองใหม่
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <AdminInventorySkeleton />
                    ) : currentRows.length ===
                      0 ? (
                        <AdminInventoryEmpty
                            activeTab={
                                activeTab
                            }
                        />
                    ) : (
                        <>
                            {activeTab ===
                            "inventory" ? (
                                <AdminInventoryTable
                                    items={
                                        paginatedRows
                                    }
                                    onStockIn={(
                                        item
                                    ) =>
                                        openStockModal(
                                            "stock-in",
                                            item
                                        )
                                    }
                                    onStockOut={(
                                        item
                                    ) =>
                                        openStockModal(
                                            "stock-out",
                                            item
                                        )
                                    }
                                />
                            ) : (
                                <InventoryTransactionTable
                                    transactions={
                                        paginatedRows
                                    }
                                />
                            )}

                            <AdminInventoryPagination
                                page={page}
                                totalPages={
                                    totalPages
                                }
                                totalItems={
                                    currentRows.length
                                }
                                pageSize={
                                    PAGE_SIZE
                                }
                                onPageChange={
                                    setPage
                                }
                            />
                        </>
                    )}
                </main>

                {modal && (
                    <InventoryActionModal
                        mode={modal.mode}
                        item={modal.item}
                        saving={saving}
                        onClose={() =>
                            !saving &&
                            setModal(null)
                        }
                        onSubmit={
                            submitStockAction
                        }
                    />
                )}
            </div>
        </RoleGuard>
    );
}
