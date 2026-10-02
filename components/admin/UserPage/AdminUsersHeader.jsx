"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

export default function AdminUsersHeader() {
    const { ui } = useNativeUi();
    return (
        <header className="relative z-10 flex flex-col gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:sticky lg:top-0 lg:bg-white/90 lg:px-8 lg:backdrop-blur">
            <div>
                <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
                    {ui("ฐานข้อมูลผู้ใช้")}
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-500 text-xs rounded-md font-bold">
                        User Database
                    </span>
                </h2>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:w-auto">
                <span className="material-symbols-outlined text-sm">ios_share</span>
                {ui("Export รายชื่อ")}
            </button>
        </header>
    );
}