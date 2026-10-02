"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

function formatUpdatedAt(value, language) {
    if (!value) {
        return language === "en" ? "Not updated yet" : "ยังไม่ได้อัปเดต";
    }

    return new Intl.DateTimeFormat(
        language === "en" ? "en-US" : "th-TH",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(value);
}

export default function AdminDashboardHeader({
    updatedAt,
    refreshing,
    onRefresh,
}) {
    const { ui, language } = useNativeUi();
    let adminName = "Admin";

    if (
        typeof window !==
        "undefined"
    ) {
        try {
            const admin = JSON.parse(
                localStorage.getItem(
                    "admin"
                ) || "{}"
            );

            adminName =
                admin?.fullName ||
                admin?.name ||
                adminName;
        } catch {
            // ใช้ค่าเริ่มต้น
        }
    }

    return (
        <header className="relative z-10 flex flex-col gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:sticky lg:top-0 lg:bg-white/90 lg:px-8 lg:backdrop-blur">
            <div>
                <h1 className="text-xl font-black text-slate-800">
                    {ui("Dashboard ภาพรวม")}
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                    {ui("อัปเดตล่าสุด")}: {formatUpdatedAt(updatedAt, language)}
                </p>
            </div>

            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-sky-50 hover:text-sky-600 disabled:opacity-50"
                >
                    <span
                        className={`material-symbols-outlined ${
                            refreshing
                                ? "animate-spin"
                                : ""
                        }`}
                    >
                        refresh
                    </span>
                </button>

                <div className="hidden border-l border-slate-200 pl-4 text-right sm:block">
                    <p className="text-sm font-bold text-slate-700">
                        {adminName}
                    </p>

                    <p className="text-xs text-slate-500">
                        {ui("ผู้ดูแลระบบ")}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-slate-500 shadow-sm">
                    <span className="material-symbols-outlined">
                        person
                    </span>
                </div>
            </div>
        </header>
    );
}
