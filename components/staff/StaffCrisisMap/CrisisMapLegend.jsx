"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

const legends = [
    ["SOS วิกฤต - รอรับงาน", "bg-red-600"],
    ["SOS วิกฤต - รับแล้ว", "bg-blue-600"],
    ["ขอรับของ - รอรับงาน", "bg-amber-500"],
    ["ขอรับของ - รับแล้ว", "bg-green-600"],
];

export default function CrisisMapLegend() {
    const { ui, language } = useNativeUi();
    return (
        <div className="absolute bottom-4 right-4 z-[600] grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl bg-white/95 px-5 py-3 shadow-lg">
            {legends.map(([label, cls]) => (
                <div key={ui(label)} className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${cls}`} />
                    <span className="text-xs font-bold">{ui(label)}</span>
                </div>
            ))}
        </div>
    );
}
