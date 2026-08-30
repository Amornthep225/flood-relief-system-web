"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

import CrisisCaseListItem from "./CrisisCaseListItem";

const filters = [
    { value: "all", label: "ทั้งหมด" },
    { value: "emergency", label: "SOS วิกฤต" },
    { value: "relief", label: "ขอรับของ" },
    { value: "pending", label: "รอรับงาน" },
    { value: "assigned", label: "รับแล้ว" },
];

export default function CrisisMapSidebar({
    summary,
    cases,
    activeStatus,
    onStatusChange,
    onSelectCase,
    onRefresh,
    refreshing,
}) {
    const { ui, language } = useNativeUi();
    return (
        <aside className="absolute bottom-20 left-4 top-20 z-[600] flex w-[360px] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border bg-white/95 shadow-xl backdrop-blur">
            <div className="border-b p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-black">CRISIS MAP</h1>
                        <p className="text-xs text-slate-400">
                            SOS วิกฤต + คำขอรับของบริจาค
                        </p>
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={refreshing}
                        className="h-10 w-10 rounded-full bg-slate-100"
                        aria-label={ui("รีเฟรชรายการเคส")}
                    >
                        <span
                            className={`material-symbols-outlined ${
                                refreshing ? "animate-spin" : ""
                            }`}
                        >
                            refresh
                        </span>
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <Summary
                        label={ui("SOS วิกฤต")}
                        value={summary.emergencyCritical}
                        cls="bg-red-50 text-red-600"
                    />
                    <Summary
                        label={ui("ขอรับของ")}
                        value={summary.relief}
                        cls="bg-sky-50 text-sky-600"
                    />
                    <Summary
                        label={ui("รอรับงาน")}
                        value={summary.pending}
                        cls="bg-amber-50 text-amber-600"
                    />
                    <Summary
                        label={ui("รับแล้ว")}
                        value={summary.assigned}
                        cls="bg-blue-50 text-blue-600"
                    />
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto border-b p-3">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onStatusChange(filter.value)}
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                            activeStatus === filter.value
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-500"
                        }`}
                    >
                        {ui(filter.label)}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
                {cases.length > 0 ? (
                    <div className="space-y-2">
                        {cases.map((item) => (
                            <CrisisCaseListItem
                                key={item.id}
                                caseItem={item}
                                onClick={() => onSelectCase(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-full min-h-40 items-center justify-center text-center">
                        <div>
                            <span className="material-symbols-outlined text-4xl text-slate-300">
                                emergency_home
                            </span>
                            <p className="mt-2 text-sm font-bold text-slate-500">
                                ไม่มีเคสในรายการนี้
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

function Summary({ label, value, cls }) {
    return (
        <div className={`rounded-xl p-3 ${cls}`}>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs font-bold">{label}</p>
        </div>
    );
}
