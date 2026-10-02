"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

export default function UserSummarySection({ users }) {
    const { ui } = useNativeUi();
    return (
        <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
            <div className="flex min-h-24 items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6">
                <div>
                    <p className="text-xs text-slate-500 mb-1">{ui("ผู้ใช้ทั้งหมด")}</p>
                    <h3 className="text-2xl font-bold text-slate-800">
                        {users.length}
                    </h3>
                </div>

                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-2xl">groups</span>
                </div>
            </div>
        </section>
    );
}