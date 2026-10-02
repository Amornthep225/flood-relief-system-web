"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

export default function AdminSosHeader({
    onRefresh,
    refreshing,
}) {
    const { ui } = useNativeUi();
    return (
        <header className="relative z-10 border-b border-slate-200 bg-white px-3 py-3 sm:px-4 sm:py-4 md:px-8 lg:sticky lg:top-0 lg:bg-white/90 lg:backdrop-blur">
            <div className="mx-auto flex max-w-[1500px] flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div>
                    <h1 className="flex flex-wrap items-center gap-2 text-base font-black text-slate-800 sm:text-xl">
                        {ui("จัดการเคสขอความช่วยเหลือ")}

                        <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                            Live Incoming
                        </span>
                    </h1>

                    <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                        {ui("SOS ฉุกเฉินจะแสดงเป็นระดับวิกฤตและอยู่บนสุดเสมอ")}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm hover:text-sky-600 disabled:opacity-50 sm:w-auto"
                >
                    <span
                        className={`material-symbols-outlined text-[19px] ${
                            refreshing ? "animate-spin" : ""
                        }`}
                    >
                        refresh
                    </span>

                    {refreshing ? ui("กำลังอัปเดต...") : ui("อัปเดตข้อมูล")}
                </button>
            </div>
        </header>
    );
}
