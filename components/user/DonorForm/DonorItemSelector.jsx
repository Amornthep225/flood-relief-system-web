"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateMasterDataText } from "@/locales/uiPhrases";

const ITEMS_PER_PAGE = 5;

export default function DonorItemSelector({
    items,
    quantities,
    onChangeQuantity,
    selectedCategory,
    selectedItemIds = [],
    itemSearch = "",
    onSearchChange,
    onToggleItem,
}) {
    const { language, t } = useLanguage();
    const [currentPage, setCurrentPage] = useState(1);

    const filteredItems = items.filter((item) =>
        !itemSearch ||
        (item.name || item.reliefItemName || "")
            .toLowerCase()
            .includes(itemSearch.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const selectedCategoryKey =
        selectedCategory?.id ?? selectedCategory?.value ?? selectedCategory ?? "";

    useEffect(() => {
        setCurrentPage(1);
    }, [itemSearch, selectedCategoryKey]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:rounded-3xl">
            <div className="border-b border-slate-100 p-4 sm:p-6">
                <h2 className="mb-4 text-xl font-bold text-slate-800">
                    {t("donation.form.itemsTitle")}
                </h2>

                <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder="ค้นหาชื่อสิ่งของ..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 focus:border-sky-400 focus:outline-none"
                />
            </div>

            {filteredItems.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] border-collapse text-sm">
                            <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <tr className="border-b border-slate-200">
                                    <th className="w-14 px-4 py-3 text-center">เลือก</th>
                                    <th className="px-4 py-3">รายการสิ่งของ</th>
                                    <th className="w-28 px-4 py-3">หน่วย</th>
                                    <th className="w-40 px-4 py-3 text-center">รับได้อีก</th>
                                    <th className="w-36 px-4 py-3 text-center">เป้าหมาย</th>
                                    <th className="w-32 px-4 py-3 text-center">จำนวนบริจาค</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {paginatedItems.map((item) => {
                                    const itemName = translateMasterDataText(
                                        item.name || item.reliefItemName || "",
                                        language
                                    );

                                    const unit = translateMasterDataText(item.unit || "", language);
                                    const currentQuantity = Number(quantities[item.id] || 0);
                                    const isSelected = selectedItemIds.includes(item.id);
                                    const maximumQuantity = Number(item.maximumQuantity || 0);
                                    const remainingQuantity =
                                        item.remainingQuantity === null ||
                                        item.remainingQuantity === undefined
                                            ? null
                                            : Number(item.remainingQuantity);

                                    const hasLimit = maximumQuantity > 0 && remainingQuantity !== null;
                                    const reachedLimit =
                                        hasLimit &&
                                        remainingQuantity > 0 &&
                                        currentQuantity >= remainingQuantity;

                                    const isActive = isSelected || currentQuantity > 0;

                                    const toggleRowSelection = () => {
                                        if (isActive) {
                                            onChangeQuantity(item.id, 0);

                                            if (isSelected) {
                                                onToggleItem?.(item.id);
                                            }

                                            return;
                                        }

                                        onChangeQuantity(item.id, 1);

                                        if (!isSelected) {
                                            onToggleItem?.(item.id);
                                        }
                                    };

                                    return (
                                        <tr
                                            key={item.id}
                                            onClick={toggleRowSelection}
                                            className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                                                isActive ? "bg-sky-50/40" : "bg-white"
                                            }`}
                                        >
                                            <td className="px-4 py-3 text-center align-middle">
                                                <input
                                                    type="checkbox"
                                                    checked={isActive}
                                                    onClick={(event) => event.stopPropagation()}
                                                    onChange={toggleRowSelection}
                                                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                                                />
                                            </td>

                                            <td className="px-4 py-3 align-middle">
                                                <p className="font-semibold text-slate-800">{itemName}</p>
                                            </td>

                                            <td className="px-4 py-3 align-middle text-slate-500">{unit}</td>

                                            <td className="px-4 py-3 text-center align-middle">
                                                {hasLimit ? (
                                                    <span className="font-semibold text-sky-700">
                                                        {remainingQuantity.toLocaleString(language === "en" ? "en-US" : "th-TH")} {unit}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                        {language === "en" ? "Unlimited" : "ไม่จำกัด"}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3 text-center align-middle text-slate-500">
                                                {hasLimit
                                                    ? `${maximumQuantity.toLocaleString(language === "en" ? "en-US" : "th-TH")} ${unit}`
                                                    : "-"}
                                            </td>

                                            <td className="px-4 py-2.5 text-center align-middle">
                                                <div className="flex flex-col items-center gap-1">
                                                    <input
                                                        type="number"
                                                        onClick={(event) => event.stopPropagation()}
                                                        min="0"
                                                        max={hasLimit ? remainingQuantity : undefined}
                                                        step="1"
                                                        placeholder="0"
                                                        value={quantities[item.id] || ""}
                                                        onChange={(event) =>
                                                            onChangeQuantity(item.id, event.target.value)
                                                        }
                                                        className={`h-9 w-24 rounded-lg border px-2 text-center font-semibold outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                                                            reachedLimit
                                                                ? "border-amber-400 bg-amber-50 text-amber-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                                                : "border-slate-200 text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                                        }`}
                                                    />
                                                    {reachedLimit && (
                                                        <span className="text-[10px] font-semibold text-amber-600">
                                                            {language === "en" ? "Maximum reached" : "ถึงจำนวนสูงสุดแล้ว"}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <span>
                            แสดง {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)} จาก {filteredItems.length} รายการ
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                disabled={safePage <= 1}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ก่อนหน้า
                            </button>
                            <span className="min-w-20 text-center font-semibold text-slate-700">
                                หน้า {safePage} / {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                disabled={safePage >= totalPages}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ถัดไป
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="m-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-sm text-slate-400 sm:m-6">
                    {selectedCategory
                        ? t("donation.form.noAvailableItems")
                        : t("donation.form.selectCategoryFirst")}
                </div>
            )}
        </div>
    );
}
