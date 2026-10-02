"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

export default function AdminStaffHeader({ onAddStaff }) {
    const { ui } = useNativeUi();
    return (
        <header className="relative z-10 flex flex-col gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:sticky lg:top-0 lg:bg-white/90 lg:px-8 lg:backdrop-blur">
            <div>
                <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
                    {ui("ทีมงานและเจ้าหน้าที่")}
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-md font-bold">
                        Staff Team
                    </span>
                </h2>
            </div>

            <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:items-center sm:gap-3">
                <button
                    type="button"
                    onClick={onAddStaff}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-sky-600 sm:flex-none"
                >
                    <span className="material-symbols-outlined text-sm">
                        person_add
                    </span>
                    {ui("เพิ่ม Staff")}
                </button>

                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:flex-none">
                    <span className="material-symbols-outlined text-sm">
                        download
                    </span>
                    {ui("Export รายชื่อ")}
                </button>
            </div>
        </header>
    );
}