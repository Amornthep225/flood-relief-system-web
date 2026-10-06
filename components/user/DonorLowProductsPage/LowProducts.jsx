"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { getLowStockItems } from "@/services/center/low-products-service";
import { createDonation } from "@/services/user/donation";
import LowProductsFilters from "./LowProductsFilters";
import LowProductsSummary from "./LowProductsSummary";
import LowProductsList from "./LowProductsList";
import LowProductsSkeleton from "./LowProductsSkeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateMasterDataText, translateUiText } from "@/locales/uiPhrases";

const PAGE_SIZE = 8;

export default function LowProducts() {
    const router = useRouter();
    const { language, t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [donatingKey, setDonatingKey] = useState("");

    const tx = (th, en) => (language === "en" ? en : th);

    const loadData = async ({ showLoading = true } = {}) => {
        try {
            if (showLoading) setLoading(true);
            setError("");

            const lowStockData = await getLowStockItems();
            setProducts(Array.isArray(lowStockData) ? lowStockData : []);
        } catch (loadError) {
            setProducts([]);
            setError(
                translateUiText(loadError?.message || "", language) ||
                    t("donation.lowStock.loadError")
            );
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setPage(1);
    }, [selectedStatus]);

    const filteredProducts = useMemo(() => {
        return products.filter((item) => {
            return selectedStatus === "all" || item.stockStatus === selectedStatus;
        });
    }, [products, selectedStatus]);

    const summary = useMemo(() => {
        const totalMissing = filteredProducts.reduce((sum, item) => {
            const quantity = Number(item.quantity ?? 0);
            const minimumQuantity = Number(item.minimumQuantity ?? 0);
            return sum + Math.max(minimumQuantity - quantity, 0);
        }, 0);

        const outOfStockCount = filteredProducts.filter(
            (item) => item.stockStatus === "OutOfStock"
        ).length;

        return {
            totalItems: filteredProducts.length,
            totalMissing,
            outOfStockCount,
        };
    }, [filteredProducts]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * PAGE_SIZE;
    const pagedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const handleDonate = async (item) => {
        const quantity = Number(item.quantity ?? 0);
        const minimumQuantity = Number(item.minimumQuantity ?? 0);
        const missing = Math.max(minimumQuantity - quantity, 0);
        if (missing <= 0) return;

        const itemName = translateMasterDataText(item.reliefItemName || "-", language);
        const centerName = translateMasterDataText(item.centerName || "-", language);
        const unit = translateMasterDataText(item.unit || tx("ชิ้น", "unit"), language);

        const result = await Swal.fire({
            icon: "question",
            title: tx(`บริจาค ${itemName}`, `Donate ${itemName}`),
            text: `${tx("ศูนย์", "Center")}: ${centerName} • ${tx("ขาดอยู่", "Shortage")}: ${missing.toLocaleString()} ${unit}`,
            input: "number",
            inputLabel: tx("จำนวนที่ต้องการบริจาค", "Donation quantity"),
            inputValue: missing,
            inputAttributes: {
                min: "1",
                max: String(missing),
                step: "1",
            },
            showCancelButton: true,
            confirmButtonText: tx("ยืนยันบริจาค", "Confirm donation"),
            cancelButtonText: tx("ยกเลิก", "Cancel"),
            confirmButtonColor: "#f97316",
            inputValidator: (value) => {
                const amount = Number(value);
                if (!Number.isInteger(amount) || amount <= 0) {
                    return tx("กรุณาระบุจำนวนเต็มที่มากกว่า 0", "Enter a whole number greater than 0");
                }
                if (amount > missing) {
                    return tx(`บริจาคได้สูงสุด ${missing} ${unit} สำหรับรายการขาดแคลนนี้`, `Maximum ${missing} ${unit} for this shortage`);
                }
                return undefined;
            },
        });

        if (!result.isConfirmed) return;

        const donateQuantity = Number(result.value);
        const key = `${item.centerId}-${item.reliefItemId}`;

        try {
            setDonatingKey(key);
            const donation = await createDonation({
                centerId: item.centerId,
                items: [
                    {
                        reliefItemId: item.reliefItemId,
                        quantity: donateQuantity,
                    },
                ],
            });

            const donationId = donation?.donationId ?? donation?.id;

            if (!donationId) {
                throw new Error(
                    tx(
                        "สร้างรายการบริจาคสำเร็จ แต่ไม่พบรหัสรายการสำหรับเปิดหน้าติดตาม",
                        "Donation was created, but no donation ID was returned for tracking"
                    )
                );
            }

            await Swal.fire({
                icon: "success",
                title: tx("บันทึกการบริจาคแล้ว", "Donation recorded"),
                text: tx(`เลขที่รายการบริจาค ${donationId}`, `Donation ${donationId}`),
                confirmButtonColor: "#f97316",
                timer: 1500,
                showConfirmButton: true,
            });

            router.push(`/user/donor-tracking?id=${encodeURIComponent(donationId)}`);
        } catch (donateError) {
            await Swal.fire({
                icon: "error",
                title: tx("บริจาคไม่สำเร็จ", "Donation failed"),
                text:
                    translateUiText(donateError?.message || "", language) ||
                    tx("ไม่สามารถบันทึกรายการบริจาคได้", "Unable to save donation"),
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setDonatingKey("");
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">
                    <span className="material-symbols-outlined text-orange-500">inventory_2</span>
                    {t("donation.lowStock.title")}
                </h1>
                <p className="mt-2 text-slate-500">{t("donation.lowStock.subtitle")}</p>
            </header>

            <LowProductsSummary summary={summary} />

            <LowProductsFilters
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
            />

            {error && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <LowProductsSkeleton />
            ) : (
                <>
                    <LowProductsList
                        products={pagedProducts}
                        startIndex={startIndex}
                        onDonate={handleDonate}
                        donatingKey={donatingKey}
                    />

                    {filteredProducts.length > 0 && (
                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row">
                            <p className="text-sm text-slate-500">
                                {tx("แสดง", "Showing")} {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filteredProducts.length)} {tx("จาก", "of")} {filteredProducts.length} {tx("รายการ", "items")}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                                    disabled={safePage <= 1}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {tx("ก่อนหน้า", "Previous")}
                                </button>
                                <span className="min-w-24 text-center text-sm font-black text-slate-700">
                                    {tx("หน้า", "Page")} {safePage} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                                    disabled={safePage >= totalPages}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {tx("ถัดไป", "Next")}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
