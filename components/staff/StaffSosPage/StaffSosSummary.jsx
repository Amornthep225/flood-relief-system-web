"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

const baseCards = [
    {
        key: "waiting",
        title: "รอรับเรื่อง",
        icon: "pending_actions",
        style: "bg-orange-500",
    },
    {
        key: "progress",
        title: "กำลังดำเนินการ",
        icon: "local_shipping",
        style: "bg-sky-600",
    },
    {
        key: "completed",
        title: "เสร็จสิ้น",
        icon: "task_alt",
        style: "bg-emerald-500",
    },
];

export default function StaffSosSummary({
    requestType = "emergency",
    summary,
}) {
    const { ui } = useNativeUi();

    const cards = [
        {
            key: "total",
            title:
                requestType === "emergency"
                    ? "SOS ทั้งหมด"
                    : "คำขอรับสิ่งของทั้งหมด",
            icon:
                requestType === "emergency"
                    ? "emergency"
                    : "inventory_2",
            style: "bg-slate-800",
        },
        ...baseCards,
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.key}
                    className={`${card.style} rounded-2xl p-5 text-white shadow-lg`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/80">
                                {ui(card.title)}
                            </p>

                            <p className="mt-2 text-3xl font-black">
                                {summary[card.key] || 0}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                            <span className="material-symbols-outlined">
                                {card.icon}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
