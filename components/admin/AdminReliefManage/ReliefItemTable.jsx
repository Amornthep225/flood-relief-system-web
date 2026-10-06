"use client";

import { useEffect, useState } from "react";
import { useNativeUi } from "@/hooks/useNativeUi";
import ReliefStatusBadge from "./ReliefStatusBadge";

export default function ReliefItemTable({
    rows,
    totalRows,
    currentPage,
    totalPages,
    pageSize = 8,
    startIndex,
    onPageChange,
    onEdit,
    onToggle,
    onToggleDonation,
}) {
    const { ui } = useNativeUi();
    const [localPage, setLocalPage] = useState(1);

    // รองรับได้ทั้งหน้าหลักเวอร์ชันใหม่ที่แบ่งหน้ามาให้แล้ว
    // และเวอร์ชันเดิมที่ส่งรายการทั้งหมดเข้ามาใน rows
    const hasExternalPagination =
        typeof onPageChange === "function" &&
        Number.isFinite(totalRows) &&
        Number.isFinite(currentPage) &&
        Number.isFinite(totalPages) &&
        Number.isFinite(startIndex);

    const safePageSize = Number(pageSize) > 0 ? Number(pageSize) : 8;
    const localTotalRows = rows.length;
    const localTotalPages = Math.max(1, Math.ceil(localTotalRows / safePageSize));

    useEffect(() => {
        setLocalPage((page) => Math.min(page, localTotalPages));
    }, [localTotalPages]);

    const effectivePage = hasExternalPagination ? currentPage : localPage;
    const effectiveTotalRows = hasExternalPagination ? totalRows : localTotalRows;
    const effectiveTotalPages = hasExternalPagination ? totalPages : localTotalPages;
    const effectiveStartIndex = hasExternalPagination
        ? startIndex
        : (localPage - 1) * safePageSize;
    const visibleRows = hasExternalPagination
        ? rows
        : rows.slice(effectiveStartIndex, effectiveStartIndex + safePageSize);

    const displayStart = effectiveTotalRows === 0 ? 0 : effectiveStartIndex + 1;
    const displayEnd = Math.min(
        effectiveStartIndex + visibleRows.length,
        effectiveTotalRows
    );

    const changePage = (nextPage) => {
        const safePage = Math.min(Math.max(1, nextPage), effectiveTotalPages);
        if (hasExternalPagination) {
            onPageChange(safePage);
        } else {
            setLocalPage(safePage);
        }
    };

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-5 sm:px-6">
                <h2 className="font-black text-slate-800">{ui("รายการสิ่งของ")}</h2>
                <p className="mt-1 text-sm text-slate-500">{ui("จัดการชื่อสิ่งของ หมวดหมู่ หน่วย และสถานะ")}</p>
            </div>

            {visibleRows.length === 0 ? (
                <div className="px-4 py-20 text-center text-slate-500 sm:px-6">{ui("ไม่พบรายการสิ่งของ")}</div>
            ) : (
                <>
                    <div className="divide-y divide-slate-100 md:hidden">
                        {visibleRows.map((item, index) => {
                            const sequence = effectiveStartIndex + index + 1;
                            return (
                                <article key={item.id} className="p-4 sm:p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="break-words text-base font-bold text-slate-800">{ui(item.name)}</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{item.categoryName || "-"}</span>
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.unit || "-"}</span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end gap-1">
                                            <span className="rounded-lg bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500">
                                                {ui("ลำดับ")} {sequence}
                                            </span>
                                            <span className="font-mono text-[11px] font-bold text-slate-400">#{item.id}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-slate-100 p-3">
                                            <p className="text-[11px] font-bold text-slate-400">{ui("ขอได้สูงสุด/คำขอ")}</p>
                                            <p className="mt-1 font-bold text-slate-700">
                                                {Number(item.maximumRequestQuantity || 0) > 0
                                                    ? Number(item.maximumRequestQuantity).toLocaleString("th-TH")
                                                    : ui("ไม่จำกัด")}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 p-3">
                                            <p className="text-[11px] font-bold text-slate-400">{ui("รับบริจาค")}</p>
                                            <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold ${item.isDonationOpen ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                                {item.isDonationOpen ? ui("เปิดรับ") : ui("ปิดรับ")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <ReliefStatusBadge isActive={item.isActive} />
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <button onClick={() => onEdit(item)} className="rounded-xl bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700">
                                                {ui("แก้ไข")}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onToggleDonation(item)}
                                                disabled={!item.isActive && !item.isDonationOpen}
                                                className={`rounded-xl px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${item.isDonationOpen ? "bg-rose-50 text-rose-700 hover:bg-rose-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                                            >
                                                {item.isDonationOpen ? ui("ปิดรับบริจาค") : ui("เปิดรับบริจาค")}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-left">
                            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="border-r border-slate-200 px-4 py-4 text-center">{ui("ลำดับ")}</th>
                                    <th className="border-r border-slate-200 px-4 py-4">{ui("รหัส")}</th>
                                    <th className="border-r border-slate-200 px-5 py-4">{ui("ชื่อสิ่งของ")}</th>
                                    <th className="border-r border-slate-200 px-5 py-4">{ui("หมวดหมู่")}</th>
                                    <th className="border-r border-slate-200 px-5 py-4">{ui("หน่วย")}</th>
                                    <th className="border-r border-slate-200 px-5 py-4 text-center">{ui("ขอได้สูงสุด/คำขอ")}</th>
                                    <th className="border-r border-slate-200 px-5 py-4 text-center">{ui("สถานะ")}</th>
                                    <th className="border-r border-slate-200 px-5 py-4 text-center">{ui("รับบริจาค")}</th>
                                    <th className="px-5 py-4 text-center">{ui("จัดการ")}</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {visibleRows.map((item, index) => (
                                    <tr key={item.id} className="border-t border-slate-100 hover:bg-sky-50/40">
                                        <td className="border-r border-t border-slate-100 px-4 py-5 text-center font-bold text-slate-500">
                                            {effectiveStartIndex + index + 1}
                                        </td>
                                        <td className="border-r border-t border-slate-100 px-4 py-5 font-mono text-xs font-bold text-slate-400">
                                            #{item.id}
                                        </td>
                                        <td className="border-r border-t border-slate-100 px-5 py-5">
                                            <p className="font-bold text-slate-800">{ui(item.name)}</p>
                                        </td>
                                        <td className="border-r border-t border-slate-100 px-5 py-5">
                                            <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">{item.categoryName || "-"}</span>
                                        </td>
                                        <td className="border-r border-t border-slate-100 px-5 py-5 font-bold text-slate-600">{item.unit || "-"}</td>
                                        <td className="border-r border-t border-slate-100 px-5 py-5 text-center font-bold text-slate-600">
                                            {Number(item.maximumRequestQuantity || 0) > 0
                                                ? Number(item.maximumRequestQuantity).toLocaleString("th-TH")
                                                : ui("ไม่จำกัด")}
                                        </td>
                                        <td className="border-r border-t border-slate-100 px-5 py-5 text-center">
                                            <ReliefStatusBadge isActive={item.isActive} />
                                        </td>
                                        <td className="border-r border-t border-slate-100 px-5 py-5 text-center">
                                            <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${item.isDonationOpen ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                                {item.isDonationOpen ? ui("เปิดรับ") : ui("ปิดรับ")}
                                            </span>
                                        </td>
                                        <td className="border-t border-slate-100 px-5 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="rounded-xl bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700"
                                                >
                                                    {ui("แก้ไข")}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onToggleDonation(item)}
                                                    disabled={!item.isActive && !item.isDonationOpen}
                                                    className={`rounded-xl px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${item.isDonationOpen ? "bg-rose-50 text-rose-700 hover:bg-rose-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                                                >
                                                    {item.isDonationOpen ? ui("ปิดรับบริจาค") : ui("เปิดรับบริจาค")}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-sm text-slate-500">
                            {ui("แสดง")} {displayStart}-{displayEnd} {ui("จาก")} {effectiveTotalRows} {ui("รายการ")}
                        </p>
                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <button
                                type="button"
                                onClick={() => changePage(effectivePage - 1)}
                                disabled={effectivePage <= 1}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {ui("ก่อนหน้า")}
                            </button>
                            <span className="whitespace-nowrap text-sm font-bold text-slate-700">
                                {ui("หน้า")} {effectivePage} / {effectiveTotalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => changePage(effectivePage + 1)}
                                disabled={effectivePage >= effectiveTotalPages}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {ui("ถัดไป")}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
