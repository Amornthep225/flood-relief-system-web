"use client";

import { useEffect, useMemo, useState } from "react";
import { useNativeUi } from "@/hooks/useNativeUi";
import EmptyState from "./EmptyState";
import StaffSosTable from "./StaffSosTable";

const PAGE_SIZE = 8;

export default function StaffSosList({
    requests,
    requestType,
    activeTab,
    onAccept,
    onOpenGps,
    onOpenDetail,
}) {
    const { language } = useNativeUi();
    const [page, setPage] = useState(1);

    const totalItems = Array.isArray(requests) ? requests.length : 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * PAGE_SIZE;

    const pagedRequests = useMemo(() => {
        if (!Array.isArray(requests)) {
            return [];
        }

        return requests.slice(startIndex, startIndex + PAGE_SIZE);
    }, [requests, startIndex]);

    useEffect(() => {
        setPage(1);
    }, [requests, activeTab, requestType]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    if (!Array.isArray(requests) || requests.length === 0) {
        return <EmptyState activeTab={activeTab} />;
    }

    const tx = (th, en) => (language === "en" ? en : th);
    const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);

    return (
        <>
            <StaffSosTable
                requests={pagedRequests}
                requestType={requestType}
                startIndex={startIndex}
                onAccept={onAccept}
                onOpenGps={onOpenGps}
                onOpenDetail={onOpenDetail}
            />

            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row">
                <p className="text-sm text-slate-500">
                    {tx("แสดง", "Showing")} {startIndex + 1}-{endIndex} {tx("จาก", "of")} {totalItems} {tx("รายการ", "items")}
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
        </>
    );
}
