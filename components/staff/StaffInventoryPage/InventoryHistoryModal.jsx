"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import { getInventoryTransactions } from "@/services/staff/inventory";

function normalizeType(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replaceAll("_", "-")
        .replaceAll(" ", "-");
}

function normalizeTransactions(response, inventory) {
    const source = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.transactions)
            ? response.transactions
            : Array.isArray(response?.items)
              ? response.items
              : [];

    return source.map((transaction) => ({
        id:
            transaction.id ??
            transaction.transactionId ??
            transaction.inventoryTransactionId ??
            "",

        inventoryId:
            transaction.centerInventoryId ??
            transaction.inventoryId ??
            inventory.id ??
            "",

        reliefItemId:
            transaction.reliefItemId ??
            transaction.itemId ??
            inventory.reliefItemId ??
            "",

        itemName:
            transaction.reliefItemName ??
            transaction.itemName ??
            transaction.name ??
            inventory.name ??
            "ไม่ระบุชื่อสิ่งของ",

        unit:
            transaction.unit ??
            inventory.unit ??
            "ชิ้น",

        type: String(
            transaction.transactionType ??
                transaction.type ??
                transaction.movementType ??
                transaction.actionType ??
                transaction.inventoryType ??
                ""
        ).trim(),

        quantity: Number(
            transaction.quantity ??
                transaction.quantityChange ??
                transaction.amount ??
                0
        ),

        remark:
            transaction.remark ??
            transaction.note ??
            transaction.description ??
            "-",

        createdBy:
            transaction.createdByName ??
            transaction.staffName ??
            transaction.createdBy ??
            "-",

        createdAt:
            transaction.createdAt ??
            transaction.transactionDate ??
            transaction.date ??
            null,

        referenceId:
            transaction.referenceId ??
            transaction.donationId ??
            transaction.sosRequestId ??
            "",
    }));
}

function isStockIn(transaction) {
    const type = normalizeType(transaction?.type);

    const stockInTypes = [
        "in",
        "stock-in",
        "stockin",
        "receive",
        "received",
        "receive-donation",
        "donation-received",
        "donation-in",
        "inbound",
        "add",
        "increase",
    ];

    const stockOutTypes = [
        "out",
        "stock-out",
        "stockout",
        "withdraw",
        "withdrawal",
        "issue",
        "dispatch",
        "sos-out",
        "outbound",
        "remove",
        "decrease",
    ];

    if (stockInTypes.includes(type)) {
        return true;
    }

    if (stockOutTypes.includes(type)) {
        return false;
    }

    const remark = String(
        transaction?.remark || ""
    )
        .trim()
        .toLowerCase();

    const stockInRemarks = [
        "รับของบริจาค",
        "รับเข้าคลัง",
        "ของเข้า",
        "เพิ่มสินค้า",
        "นำสินค้าเข้าคลัง",
    ];

    const stockOutRemarks = [
        "จ่ายสิ่งของ",
        "เบิกออก",
        "ของออก",
        "จ่ายของสำหรับ sos",
        "นำสินค้าออกจากคลัง",
    ];

    if (
        stockInRemarks.some((text) =>
            remark.includes(text)
        )
    ) {
        return true;
    }

    if (
        stockOutRemarks.some((text) =>
            remark.includes(text)
        )
    ) {
        return false;
    }

    /*
     * ใช้เครื่องหมายจำนวนเป็นตัวตัดสินสุดท้าย
     *
     * จำนวนบวก  = ของเข้า
     * จำนวนลบ   = ของออก
     */
    return Number(transaction?.quantity || 0) > 0;
}

function getTypeLabel(transaction) {
    return isStockIn(transaction)
        ? "ของเข้า"
        : "ของออก";
}

function getTypeClass(transaction) {
    return isStockIn(transaction)
        ? "bg-emerald-100 text-emerald-700"
        : "bg-red-100 text-red-700";
}

function getLocalDateValue(date) {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    const year = parsedDate.getFullYear();
    const month = String(
        parsedDate.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        parsedDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(date) {
    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(parsedDate);
}

function formatNumber(value) {
    return new Intl.NumberFormat(
        "th-TH"
    ).format(Number(value || 0));
}

export default function InventoryHistoryModal({
    open,
    onClose,
    inventories,
    centerName,
}) {
    const [transactions, setTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        type: "all",
        search: "",
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        const controller =
            new AbortController();

        const loadHistory = async () => {
            try {
                setLoading(true);

                const inventoryList =
                    Array.isArray(inventories)
                        ? inventories.filter(
                              (item) => item?.id
                          )
                        : [];

                if (inventoryList.length === 0) {
                    setTransactions([]);
                    return;
                }

                const results =
                    await Promise.allSettled(
                        inventoryList.map(
                            async (inventory) => {
                                const response =
                                    await getInventoryTransactions(
                                        inventory.id,
                                        controller.signal
                                    );

                                return normalizeTransactions(
                                    response,
                                    inventory
                                );
                            }
                        )
                    );

                const successfulResults =
                    results.filter(
                        (result) =>
                            result.status ===
                            "fulfilled"
                    );

                const mergedTransactions =
                    successfulResults
                        .flatMap(
                            (result) =>
                                result.value
                        )
                        .sort(
                            (first, second) =>
                                new Date(
                                    second.createdAt ||
                                        0
                                ).getTime() -
                                new Date(
                                    first.createdAt ||
                                        0
                                ).getTime()
                        );

                setTransactions(
                    mergedTransactions
                );

                const failedResults =
                    results.filter(
                        (result) =>
                            result.status ===
                                "rejected" &&
                            result.reason?.name !==
                                "AbortError"
                    );

                if (
                    failedResults.length > 0 &&
                    mergedTransactions.length === 0
                ) {
                    throw new Error(
                        "ไม่สามารถโหลดประวัติคลังสินค้าได้"
                    );
                }
            } catch (error) {
                if (
                    error?.name ===
                    "AbortError"
                ) {
                    return;
                }

                console.error(
                    "โหลดประวัติคลังไม่สำเร็จ:",
                    error
                );

                await Swal.fire({
                    icon: "error",
                    title:
                        "โหลดประวัติไม่สำเร็จ",
                    text:
                        error?.message ||
                        "ไม่สามารถโหลดประวัติของเข้า–ออกคลังได้",
                    confirmButtonText:
                        "ตกลง",
                });
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }
            }
        };

        loadHistory();

        return () => {
            controller.abort();
        };
    }, [open, inventories]);

    const filteredTransactions =
        useMemo(() => {
            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();

            return transactions.filter(
                (transaction) => {
                    const transactionDate =
                        getLocalDateValue(
                            transaction.createdAt
                        );

                    const matchStartDate =
                        !filters.startDate ||
                        transactionDate >=
                            filters.startDate;

                    const matchEndDate =
                        !filters.endDate ||
                        transactionDate <=
                            filters.endDate;

                    const matchType =
                        filters.type ===
                            "all" ||
                        (filters.type ===
                            "in" &&
                            isStockIn(
                                transaction
                            )) ||
                        (filters.type ===
                            "out" &&
                            !isStockIn(
                                transaction
                            ));

                    const itemName =
                        String(
                            transaction.itemName ||
                                ""
                        ).toLowerCase();

                    const reliefItemId =
                        String(
                            transaction.reliefItemId ||
                                ""
                        ).toLowerCase();

                    const referenceId =
                        String(
                            transaction.referenceId ||
                                ""
                        ).toLowerCase();

                    const remark =
                        String(
                            transaction.remark ||
                                ""
                        ).toLowerCase();

                    const matchSearch =
                        !keyword ||
                        itemName.includes(
                            keyword
                        ) ||
                        reliefItemId.includes(
                            keyword
                        ) ||
                        referenceId.includes(
                            keyword
                        ) ||
                        remark.includes(
                            keyword
                        );

                    return (
                        matchStartDate &&
                        matchEndDate &&
                        matchType &&
                        matchSearch
                    );
                }
            );
        }, [transactions, filters]);

    const summary = useMemo(() => {
        return filteredTransactions.reduce(
            (result, transaction) => {
                const quantity =
                    Math.abs(
                        Number(
                            transaction.quantity ||
                                0
                        )
                    );

                if (
                    isStockIn(transaction)
                ) {
                    result.stockIn +=
                        quantity;
                } else {
                    result.stockOut +=
                        quantity;
                }

                return result;
            },
            {
                stockIn: 0,
                stockOut: 0,
            }
        );
    }, [filteredTransactions]);

    function setToday() {
        const today =
            getLocalDateValue(new Date());

        setFilters((current) => ({
            ...current,
            startDate: today,
            endDate: today,
        }));
    }

    function setLast7Days() {
        const endDate = new Date();
        const startDate = new Date();

        startDate.setDate(
            endDate.getDate() - 6
        );

        setFilters((current) => ({
            ...current,
            startDate:
                getLocalDateValue(
                    startDate
                ),
            endDate:
                getLocalDateValue(
                    endDate
                ),
        }));
    }

    function resetFilters() {
        setFilters({
            startDate: "",
            endDate: "",
            type: "all",
            search: "",
        });
    }

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
            <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-[#eef8ff] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                            <span className="material-symbols-outlined text-sky-600">
                                history
                            </span>

                            ประวัติของเข้า–ออกคลัง
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            {centerName}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    {/* Filters */}
                    <div className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={setToday}
                                className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-600"
                            >
                                วันนี้
                            </button>

                            <button
                                type="button"
                                onClick={
                                    setLast7Days
                                }
                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600"
                            >
                                7 วันล่าสุด
                            </button>

                            <button
                                type="button"
                                onClick={
                                    resetFilters
                                }
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-500"
                            >
                                รีเซ็ต
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <label className="text-sm font-bold text-slate-600">
                                วันที่เริ่มต้น

                                <input
                                    type="date"
                                    value={
                                        filters.startDate
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setFilters(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                startDate:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-sky-400"
                                />
                            </label>

                            <label className="text-sm font-bold text-slate-600">
                                วันที่สิ้นสุด

                                <input
                                    type="date"
                                    value={
                                        filters.endDate
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setFilters(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                endDate:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-sky-400"
                                />
                            </label>

                            <label className="text-sm font-bold text-slate-600">
                                ประเภทรายการ

                                <select
                                    value={
                                        filters.type
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setFilters(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                type:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-sky-400"
                                >
                                    <option value="all">
                                        ทั้งหมด
                                    </option>

                                    <option value="in">
                                        ของเข้า
                                    </option>

                                    <option value="out">
                                        ของออก
                                    </option>
                                </select>
                            </label>

                            <label className="text-sm font-bold text-slate-600">
                                ค้นหารายการ

                                <input
                                    type="text"
                                    placeholder="ชื่อสินค้า / รหัสอ้างอิง"
                                    value={
                                        filters.search
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setFilters(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                search:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-sky-400"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-emerald-500 p-5 text-white shadow-sm">
                            <p className="text-sm font-bold text-emerald-50">
                                ของเข้ารวมตามตัวกรอง
                            </p>

                            <p className="mt-2 text-3xl font-black">
                                {formatNumber(
                                    summary.stockIn
                                )}

                                <span className="ml-2 text-sm font-normal">
                                    หน่วย
                                </span>
                            </p>
                        </div>

                        <div className="rounded-2xl bg-red-500 p-5 text-white shadow-sm">
                            <p className="text-sm font-bold text-red-50">
                                ของออกรวมตามตัวกรอง
                            </p>

                            <p className="mt-2 text-3xl font-black">
                                {formatNumber(
                                    summary.stockOut
                                )}

                                <span className="ml-2 text-sm font-normal">
                                    หน่วย
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
                            <span className="material-symbols-outlined animate-spin text-4xl text-sky-500">
                                progress_activity
                            </span>

                            <p className="mt-3 text-sm text-slate-500">
                                กำลังโหลดประวัติ...
                            </p>
                        </div>
                    ) : filteredTransactions.length ===
                      0 ? (
                        <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
                            <span className="material-symbols-outlined text-4xl text-slate-300">
                                history_toggle_off
                            </span>

                            <h3 className="mt-3 font-bold text-slate-700">
                                ไม่พบประวัติรายการ
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                ลองเปลี่ยนวันที่
                                ประเภท หรือคำค้นหา
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="px-5 py-4">
                                                วันเวลา
                                            </th>

                                            <th className="px-5 py-4">
                                                รายการ
                                            </th>

                                            <th className="px-5 py-4">
                                                ประเภท
                                            </th>

                                            <th className="px-5 py-4 text-right">
                                                จำนวน
                                            </th>

                                            <th className="px-5 py-4">
                                                ผู้ทำรายการ
                                            </th>

                                            <th className="px-5 py-4">
                                                หมายเหตุ
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredTransactions.map(
                                            (
                                                transaction,
                                                index
                                            ) => {
                                                const stockIn =
                                                    isStockIn(
                                                        transaction
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            transaction.id ||
                                                            `${transaction.inventoryId}-${transaction.createdAt}-${index}`
                                                        }
                                                        className="text-sm text-slate-600"
                                                    >
                                                        <td className="whitespace-nowrap px-5 py-4">
                                                            {formatDate(
                                                                transaction.createdAt
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <p className="font-bold text-slate-800">
                                                                {
                                                                    transaction.itemName
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs font-mono text-slate-400">
                                                                #
                                                                {
                                                                    transaction.reliefItemId
                                                                }
                                                            </p>

                                                            {transaction.referenceId && (
                                                                <p className="mt-1 text-xs text-slate-400">
                                                                    อ้างอิง:{" "}
                                                                    {
                                                                        transaction.referenceId
                                                                    }
                                                                </p>
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-bold ${getTypeClass(
                                                                    transaction
                                                                )}`}
                                                            >
                                                                {getTypeLabel(
                                                                    transaction
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td className="whitespace-nowrap px-5 py-4 text-right">
                                                            <span
                                                                className={`text-lg font-black ${
                                                                    stockIn
                                                                        ? "text-emerald-600"
                                                                        : "text-red-600"
                                                                }`}
                                                            >
                                                                {stockIn
                                                                    ? "+"
                                                                    : "-"}

                                                                {formatNumber(
                                                                    Math.abs(
                                                                        transaction.quantity
                                                                    )
                                                                )}
                                                            </span>

                                                            <span className="ml-1 text-xs text-slate-400">
                                                                {
                                                                    transaction.unit
                                                                }
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            {
                                                                transaction.createdBy
                                                            }
                                                        </td>

                                                        <td className="max-w-xs px-5 py-4">
                                                            {
                                                                transaction.remark
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}