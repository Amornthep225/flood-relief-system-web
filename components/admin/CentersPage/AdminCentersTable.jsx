"use client";

import { useNativeUi } from "@/hooks/useNativeUi";
import Link from "next/link";
import CenterStatusBadge from "./CenterStatusBadge";

function getLocation(center) {
    return [center.subDistrict, center.district, center.province].filter(Boolean).join(", ");
}

export default function AdminCentersTable({ centers, deletingId, onEdit, onDelete }) {
    const { ui } = useNativeUi();

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100 md:hidden">
                {centers.map((center) => (
                    <article key={center.id} className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="break-words text-base font-bold text-slate-800">
                                    {center.centerName || "-"}
                                </p>
                                <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
                                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px]">location_on</span>
                                    <span className="break-words">{getLocation(center) || center.address || "-"}</span>
                                </p>
                            </div>
                            <span className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-500">
                                #{center.id}
                            </span>
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-3">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{ui("ผู้ดูแล")}</p>
                            <p className="mt-1 font-semibold text-slate-700">{center.contactName || "-"}</p>
                            <p className="text-sm text-slate-500">{center.phoneNumber || "-"}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <CenterStatusBadge status={center.status} />
                            <div className="flex items-center gap-1.5">
                                <Link
                                    href={`/admin/admin-center-inventory?centerId=${encodeURIComponent(center.id)}`}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                                    title={ui("ดูคลัง")}
                                >
                                    <span className="material-symbols-outlined text-[19px]">inventory_2</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => onEdit(center)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"
                                    title={ui("แก้ไข")}
                                >
                                    <span className="material-symbols-outlined text-[19px]">edit_square</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(center)}
                                    disabled={deletingId === center.id}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    title={ui("ลบ")}
                                >
                                    <span className={`material-symbols-outlined text-[19px] ${deletingId === center.id ? "animate-spin" : ""}`}>
                                        {deletingId === center.id ? "progress_activity" : "delete"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[820px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <th className="w-20 p-4 font-bold">ID</th>
                            <th className="p-4 font-bold">{ui("ข้อมูลจุดรับบริจาค")}</th>
                            <th className="p-4 font-bold">{ui("ผู้ดูแล")}</th>
                            <th className="p-4 text-center font-bold">{ui("สถานะ")}</th>
                            <th className="p-4 text-right font-bold">{ui("จัดการ")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {centers.map((center) => (
                            <tr key={center.id} className="transition hover:bg-slate-50">
                                <td className="p-4 font-mono text-slate-400">{center.id}</td>
                                <td className="p-4">
                                    <p className="font-bold text-slate-800">{center.centerName}</p>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        {getLocation(center) || center.address || "-"}
                                    </p>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-slate-700">{center.contactName}</p>
                                    <p className="text-xs text-slate-400">{center.phoneNumber}</p>
                                </td>
                                <td className="p-4 text-center"><CenterStatusBadge status={center.status} /></td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link
                                            href={`/admin/admin-center-inventory?centerId=${encodeURIComponent(center.id)}`}
                                            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-sky-500"
                                            title={ui("ดูคลัง")}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                                        </Link>
                                        <button type="button" onClick={() => onEdit(center)} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-teal-600" title={ui("แก้ไข")}>
                                            <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(center)}
                                            disabled={deletingId === center.id}
                                            className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            title={ui("ลบ")}
                                        >
                                            <span className={`material-symbols-outlined text-[18px] ${deletingId === center.id ? "animate-spin" : ""}`}>
                                                {deletingId === center.id ? "progress_activity" : "delete"}
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
