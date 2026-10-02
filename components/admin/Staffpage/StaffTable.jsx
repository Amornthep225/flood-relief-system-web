"use client";

import { useNativeUi } from "@/hooks/useNativeUi";
import StaffStatusBadge from "./StaffStatusBadge";

export default function StaffTable({ staffs, totalStaff, loading, onManage }) {
    const { ui, language } = useNativeUi();

    return (
        <section className="overflow-hidden rounded-b-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100 md:hidden">
                {loading && (
                    <div className="p-8 text-center text-sm text-slate-400">
                        {ui("กำลังโหลดข้อมูลเจ้าหน้าที่...")}
                    </div>
                )}
                {!loading && staffs.length === 0 && (
                    <div className="p-8 text-center text-sm text-slate-400">
                        {ui("ไม่พบข้อมูลเจ้าหน้าที่")}
                    </div>
                )}

                {!loading &&
                    staffs.map((staff) => (
                        <article
                            key={staff.id}
                            className={`p-4 sm:p-5 ${!staff.isActive ? "bg-slate-50 opacity-80" : ""}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-100 bg-slate-800 text-lg font-bold text-white">
                                    {staff.fullName?.charAt(0) || "?"}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="break-words text-base font-bold text-slate-800">
                                                {staff.fullName || "-"}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {staff.phoneNumber || "-"}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-500">
                                            #{staff.id}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                                        <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px] text-slate-400">mail</span>
                                        <span className="break-all">{staff.email || "-"}</span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <StaffStatusBadge status={staff.isActive ? "active" : "banned"} />
                                        <button
                                            type="button"
                                            onClick={() => onManage(staff)}
                                            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                            {ui("จัดการ")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[820px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <th className="w-16 p-4 font-bold">ID</th>
                            <th className="p-4 font-bold">{ui("ชื่อ - สกุล")}</th>
                            <th className="p-4 font-bold">{ui("อีเมล")}</th>
                            <th className="p-4 text-center font-bold">{ui("สถานะ")}</th>
                            <th className="p-4 text-right font-bold">{ui("จัดการ")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {loading && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    {ui("กำลังโหลดข้อมูลเจ้าหน้าที่...")}
                                </td>
                            </tr>
                        )}
                        {!loading && staffs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    {ui("ไม่พบข้อมูลเจ้าหน้าที่")}
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            staffs.map((staff) => (
                                <tr
                                    key={staff.id}
                                    className={!staff.isActive ? "bg-slate-50 opacity-75 transition-colors hover:bg-slate-50" : "transition-colors hover:bg-slate-50"}
                                >
                                    <td className="p-4 font-mono text-slate-400">{staff.id}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-slate-100 bg-slate-800 text-lg font-bold text-white">
                                                {staff.fullName?.charAt(0) || "?"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{staff.fullName}</p>
                                                <p className="text-xs text-slate-400">{staff.phoneNumber || "-"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500">{staff.email || "-"}</td>
                                    <td className="p-4 text-center">
                                        <StaffStatusBadge status={staff.isActive ? "active" : "banned"} />
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => onManage(staff)}
                                            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-4">
                <span className="text-xs text-slate-500">
                    {language === "en"
                        ? `Showing ${staffs.length} of ${totalStaff} items`
                        : `แสดง ${staffs.length} จาก ${totalStaff} รายการ`}
                </span>
            </div>
        </section>
    );
}
