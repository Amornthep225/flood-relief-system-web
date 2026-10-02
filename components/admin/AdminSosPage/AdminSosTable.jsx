"use client";

import { useNativeUi } from "@/hooks/useNativeUi";
import AdminSosPriorityBadge from "./AdminSosPriorityBadge";
import AdminSosStatusBadge from "./AdminSosStatusBadge";

function formatDate(value, language) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function isEmergencySos(item) {
    return String(item?.requestType || "Relief").trim().toLowerCase() === "emergency";
}

function isPending(status) {
    return String(status || "").trim().toLowerCase() === "pending";
}

export default function AdminSosTable({ cases, onView, onAssign }) {
    const { ui, language } = useNativeUi();
    const tx = (th, en) => (language === "en" ? en : th);

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100 md:hidden">
                {cases.map((item) => (
                    <article key={item.id} className={`p-4 sm:p-5 ${isEmergencySos(item) ? "bg-red-50/40" : ""}`}>
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-sm font-bold text-slate-700">#{item.id}</span>
                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${isEmergencySos(item) ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-700"}`}>
                                        {isEmergencySos(item) ? tx("SOS ฉุกเฉิน", "Emergency SOS") : tx("ขอรับสิ่งของ", "Relief Request")}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-400">{formatDate(item.createdAt, language)}</p>
                            </div>
                            <AdminSosStatusBadge status={item.status} />
                        </div>

                        <div className="mt-4">
                            <p className="text-base font-bold text-slate-800">{item.name || "-"}</p>
                            <p className="mt-0.5 text-sm text-slate-500">{item.phone || "-"}</p>
                            {item.userRemark && <p className="mt-2 rounded-xl bg-white/80 p-3 text-sm text-slate-600">“{item.userRemark}”</p>}
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-3">
                            <p className="flex items-start gap-2 text-sm text-slate-600">
                                <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px] text-slate-400">location_on</span>
                                <span className="break-words">{item.address || "-"}</span>
                            </p>
                            <p className="mt-2 text-xs font-bold text-sky-600">{ui(item.centerName || "-")}</p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[11px] font-bold text-slate-400">{tx("ระดับ", "Priority")}</p>
                                <div className="mt-2">{isEmergencySos(item) ? <AdminSosPriorityBadge priority="Critical" /> : <span className="text-sm text-slate-400">-</span>}</div>
                            </div>
                            <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[11px] font-bold text-slate-400">{tx("ผู้รับผิดชอบ", "Assigned Staff")}</p>
                                {item.assignedStaffName ? (
                                    <div className="mt-1">
                                        <p className="break-words text-sm font-bold text-slate-700">{item.assignedStaffName}</p>
                                        <p className="font-mono text-[11px] text-slate-400">#{item.assignedStaffId}</p>
                                    </div>
                                ) : (
                                    <span className="mt-1 inline-block text-xs font-bold text-orange-500">{tx("ยังไม่มอบหมาย", "Not Assigned")}</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button type="button" onClick={() => onView(item)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-700">
                                <span className="material-symbols-outlined text-[19px]">visibility</span>
                                {tx("ดูรายละเอียด", "View")}
                            </button>
                            {isPending(item.status) && (
                                <button type="button" onClick={() => onAssign(item)} className="min-h-11 flex-1 rounded-xl bg-sky-600 px-3 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-sky-700">
                                    {isEmergencySos(item) ? tx("มอบหมาย Staff", "Assign Staff") : tx("ตรวจของ + มอบหมาย", "Check + Assign")}
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[980px] text-left">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="p-4">Case ID</th>
                            <th className="p-4">{tx("ผู้แจ้ง", "Requester")}</th>
                            <th className="p-4">{tx("พื้นที่ / ศูนย์", "Area / Center")}</th>
                            <th className="p-4 text-center">{tx("ระดับ", "Priority")}</th>
                            <th className="p-4 text-center">{tx("สถานะ", "Status")}</th>
                            <th className="p-4">{tx("ผู้รับผิดชอบ", "Assigned Staff")}</th>
                            <th className="p-4 text-right">{tx("จัดการ", "Actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {cases.map((item) => (
                            <tr key={item.id} className={isEmergencySos(item) ? "bg-red-50/30 hover:bg-red-50" : "hover:bg-slate-50"}>
                                <td className="p-4 font-mono text-slate-500">
                                    #{item.id}
                                    <p className="mt-1 font-sans text-[11px] text-slate-400">{formatDate(item.createdAt, language)}</p>
                                    <span className={`mt-2 inline-flex rounded-full px-2 py-1 font-sans text-[10px] font-black ${isEmergencySos(item) ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-700"}`}>
                                        {isEmergencySos(item) ? tx("SOS ฉุกเฉิน", "Emergency SOS") : tx("ขอรับสิ่งของ", "Relief Request")}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.phone}</p>
                                    {item.userRemark && <p className="mt-1 max-w-xs truncate text-xs text-slate-500">“{item.userRemark}”</p>}
                                </td>
                                <td className="p-4">
                                    <p className="max-w-xs text-slate-600">{item.address}</p>
                                    <p className="mt-1 text-xs font-bold text-sky-600">{ui(item.centerName)}</p>
                                </td>
                                <td className="p-4 text-center">{isEmergencySos(item) && <AdminSosPriorityBadge priority="Critical" />}</td>
                                <td className="p-4 text-center"><AdminSosStatusBadge status={item.status} /></td>
                                <td className="p-4">
                                    {item.assignedStaffName ? (
                                        <div><p className="font-bold text-slate-700">{item.assignedStaffName}</p><p className="font-mono text-xs text-slate-400">#{item.assignedStaffId}</p></div>
                                    ) : (
                                        <span className="text-xs font-bold text-orange-500">{tx("ยังไม่มอบหมาย", "Not Assigned")}</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <button type="button" onClick={() => onView(item)} className="mr-2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><span className="material-symbols-outlined text-[19px]">visibility</span></button>
                                    {isPending(item.status) && (
                                        <button type="button" onClick={() => onAssign(item)} className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-700">
                                            {isEmergencySos(item) ? tx("มอบหมาย Staff", "Assign Staff") : tx("ตรวจของ + มอบหมาย", "Check Stock + Assign")}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
