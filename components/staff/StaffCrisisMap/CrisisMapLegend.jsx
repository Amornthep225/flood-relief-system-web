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
        <div className="absolute right-3 top-3 z-[590] grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-xl bg-white/95 px-3 py-2 shadow-lg sm:bottom-4 sm:right-4 sm:top-auto sm:gap-x-4 sm:gap-y-2 sm:rounded-2xl sm:px-5 sm:py-3">
            {legends.map(([label, cls]) => (
                <div key={ui(label)} className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${cls}`} />
                    <span className="text-xs font-bold">{ui(label)}</span>
                </div>
            ))}
        </div>
    );
}
