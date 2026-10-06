"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ITEMS_PER_PAGE = 5;

export default function SosItemSelector({
    categories,
    itemsByCategory,
    selectedCategoryIds,
    expandedCategoryIds = [],
    selectedItemIds,
    itemSearch = "",
    onSearchChange,
    quantities,
    onToggleItem,
    onIncrease,
    onDecrease,
    onQuantityChange,
}) {
    const { t } = useLanguage();
    const [pageByCategory, setPageByCategory] = useState({});
    const selectedCategoryKey = selectedCategoryIds.join("|");

    useEffect(() => {
        setPageByCategory({});
    }, [itemSearch, selectedCategoryKey]);

    const changeCategoryPage = (categoryId, page) => {
        setPageByCategory((current) => ({
            ...current,
            [categoryId]: page,
        }));
    };

    return (
        <div className="space-y-4">
            <input
                type="text"
                value={itemSearch}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="ค้นหาชื่อสิ่งของ..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 focus:border-sky-400 focus:outline-none"
            />

            {selectedCategoryIds
                .filter((categoryId) => expandedCategoryIds.includes(categoryId))
                .map((categoryId) => {
                    const category = categories.find((item) => item.id === categoryId);
                    const items = (itemsByCategory[categoryId] || []).filter(
                        (item) =>
                            !itemSearch ||
                            item.name?.toLowerCase().includes(itemSearch.toLowerCase())
                    );
                    const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
                    const requestedPage = pageByCategory[categoryId] || 1;
                    const currentPage = Math.min(requestedPage, totalPages);
                    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                    return (
                        <section
                            key={categoryId}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                        >
                            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                                <span className="material-symbols-outlined text-lg text-sky-500">
                                    {category?.icon || "category"}
                                </span>
                                <h3 className="font-bold text-slate-800">
                                    {category?.title || category?.name || categoryId}
                                </h3>
                                <span className="ml-auto rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">
                                    {items.length} รายการ
                                </span>
                            </div>

                            {items.length === 0 ? (
                                <p className="px-4 py-6 text-center text-sm text-slate-500">
                                    {t("sos.relief.noItems")}
                                </p>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[650px] border-collapse text-sm">
                                            <thead className="bg-white text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                <tr className="border-b border-slate-200">
                                                    <th className="w-14 px-4 py-3 text-center">เลือก</th>
                                                    <th className="px-4 py-3">รายการสิ่งของ</th>
                                                    <th className="w-28 px-4 py-3">หน่วย</th>
                                                    <th className="w-40 px-4 py-3 text-center">ขอได้สูงสุด</th>
                                                    <th className="w-52 px-4 py-3 text-center">จำนวนที่ต้องการ</th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-slate-100">
                                                {paginatedItems.map((item) => {
                                                    const isSelected = selectedItemIds.includes(item.id);
                                                    const maximumRequestQuantity = Number(
                                                        item.maximumRequestQuantity || 0
                                                    );
                                                    const hasMaximum = maximumRequestQuantity > 0;

                                                    return (
                                                        <tr
                                                            key={item.id}
                                                            onClick={() => onToggleItem(item.id)}
                                                            className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                                                                isSelected ? "bg-sky-50/50" : "bg-white"
                                                            }`}
                                                        >
                                                            <td className="px-4 py-3 text-center align-middle">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onClick={(event) => event.stopPropagation()}
                                                                    onChange={() => onToggleItem(item.id)}
                                                                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                                                                />
                                                            </td>

                                                            <td className="px-4 py-3 align-middle">
                                                                <span className="font-semibold text-slate-800">
                                                                    {item.name}
                                                                </span>
                                                            </td>

                                                            <td className="px-4 py-3 align-middle text-slate-500">
                                                                {item.unit}
                                                            </td>

                                                            <td className="px-4 py-3 text-center align-middle">
                                                                {hasMaximum ? (
                                                                    <span className="font-medium text-amber-700">
                                                                        {maximumRequestQuantity.toLocaleString("th-TH")} {item.unit}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-slate-400">ไม่จำกัด</span>
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-2.5 text-center align-middle">
                                                                {isSelected ? (
                                                                    <div
                                                                        className="inline-flex items-center gap-2"
                                                                        onClick={(event) => event.stopPropagation()}
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => onDecrease(item.id)}
                                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                                            aria-label={`ลดจำนวน ${item.name}`}
                                                                        >
                                                                            <span className="material-symbols-outlined text-base">
                                                                                remove
                                                                            </span>
                                                                        </button>

                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            max={hasMaximum ? maximumRequestQuantity : undefined}
                                                                            value={quantities[item.id] || 1}
                                                                            onChange={(event) =>
                                                                                onQuantityChange(
                                                                                    item.id,
                                                                                    event.target.value
                                                                                )
                                                                            }
                                                                            className="h-8 w-20 rounded-lg border border-slate-200 text-center text-sm font-bold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                                        />

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => onIncrease(item.id)}
                                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                                            aria-label={`เพิ่มจำนวน ${item.name}`}
                                                                        >
                                                                            <span className="material-symbols-outlined text-base">
                                                                                add
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-slate-300">—</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                                        <span>
                                            แสดง {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, items.length)} จาก {items.length} รายการ
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    changeCategoryPage(
                                                        categoryId,
                                                        Math.max(1, currentPage - 1)
                                                    )
                                                }
                                                disabled={currentPage <= 1}
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                ก่อนหน้า
                                            </button>
                                            <span className="min-w-20 text-center font-semibold text-slate-700">
                                                หน้า {currentPage} / {totalPages}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    changeCategoryPage(
                                                        categoryId,
                                                        Math.min(totalPages, currentPage + 1)
                                                    )
                                                }
                                                disabled={currentPage >= totalPages}
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                ถัดไป
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>
                    );
                })}
        </div>
    );
}
