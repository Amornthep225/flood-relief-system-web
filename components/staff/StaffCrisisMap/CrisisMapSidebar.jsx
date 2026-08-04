"use client";
import CrisisCaseListItem from "./CrisisCaseListItem";
const filters = [
    { value: "all", label: "ทั้งหมด" },
    { value: "critical", label: "วิกฤต" },
    { value: "urgent", label: "เร่งด่วน" },
    { value: "normal", label: "ปกติ" },
];
export default function CrisisMapSidebar({
    summary,
    cases,
    activePriority,
    onPriorityChange,
    onSelectCase,
    onRefresh,
    refreshing,
}) {
    return (
        <aside className="absolute bottom-20 left-4 top-20 z-[600] flex w-[360px] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border bg-white/95 shadow-xl backdrop-blur">
            <div className="border-b p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-black">CRISIS MAP</h1>
                        <p className="text-xs text-slate-400">เคสรอรับและเคสของคุณ</p>
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={refreshing}
                        className="h-10 w-10 rounded-full bg-slate-100"
                    >
                        <span
                            className={`material-symbols-outlined ${refreshing ? "animate-spin" : ""
                                }`}
                        >
                            refresh
                        </span>
                    </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <Summary
                        label="วิกฤต"
                        value={summary.critical}
                        cls="bg-red-50 text-red-600"
                    />
                    <Summary
                        label="เร่งด่วน"
                        value={summary.urgent}
                        cls="bg-orange-50 text-orange-600"
                    />
                    <Summary
                        label="รอรับงาน"
                        value={summary.pending}
                        cls="bg-slate-100"
                    />
                    <Summary
                        label="รับแล้ว"
                        value={summary.assigned}
                        cls="bg-blue-50 text-blue-600"
                    />
                </div>
            </div>
            <div className="flex gap-2 overflow-x-auto border-b p-3">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => onPriorityChange(f.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${activePriority === f.value
                                ? "bg-sky-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-2">
                    {cases.map((item) => (
                        <CrisisCaseListItem
                            key={item.id}
                            caseItem={item}
                            onClick={() => onSelectCase(item)}
                        />
                    ))}
                </div>
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
