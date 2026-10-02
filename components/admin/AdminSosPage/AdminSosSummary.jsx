"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

const cards = [
    {
        key: "total",
        title: "เคสทั้งหมด",
        icon: "list",
        cardClass:
            "border-slate-200 bg-white text-slate-800",
        iconClass:
            "bg-slate-100 text-slate-500",
    },
    {
        key: "critical",
        title: "SOS วิกฤต",
        icon: "crisis_alert",
        cardClass:
            "border-red-100 bg-red-50 text-red-600",
        iconClass:
            "bg-white text-red-500",
    },
    {
        key: "relief",
        title: "ขอรับของ",
        icon: "inventory_2",
        cardClass:
            "border-cyan-100 bg-cyan-50 text-cyan-600",
        iconClass:
            "bg-white text-cyan-500",
    },
    {
        key: "waiting",
        title: "รอการช่วยเหลือ",
        icon: "warning",
        cardClass:
            "border-orange-100 bg-orange-50 text-orange-600",
        iconClass:
            "bg-white text-orange-500",
    },
    {
        key: "progress",
        title: "กำลังดำเนินการ",
        icon: "engineering",
        cardClass:
            "border-blue-100 bg-blue-50 text-blue-600",
        iconClass:
            "bg-white text-blue-500",
    },
    {
        key: "completed",
        title: "ช่วยเหลือสำเร็จ",
        icon: "check_circle",
        cardClass:
            "border-green-100 bg-green-50 text-green-600",
        iconClass:
            "bg-white text-green-500",
    },
];

export default function AdminSosSummary({
    summary,
}) {
    const { ui } = useNativeUi();
    return (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
            {cards.map((card) => (
                <div
                    key={card.key}
                    className={`flex min-h-24 items-center justify-between rounded-xl border p-3 shadow-sm sm:p-4 ${card.cardClass}`}
                >
                    <div>
                        <p className="mb-1 text-[11px] font-bold leading-4 sm:text-xs">
                            {ui(card.title)}
                        </p>

                        <p className="text-2xl font-black sm:text-3xl">
                            {summary[card.key] || 0}
                        </p>
                    </div>

                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 ${card.iconClass}`}
                    >
                        <span className="material-symbols-outlined">
                            {card.icon}
                        </span>
                    </div>
                </div>
            ))}
        </section>
    );
}
