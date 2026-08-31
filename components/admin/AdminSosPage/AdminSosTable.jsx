"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

import AdminSosPriorityBadge from "./AdminSosPriorityBadge";
import AdminSosStatusBadge from "./AdminSosStatusBadge";

function formatDate(value, language) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}


function isEmergencySos(item) {
    return (
        String(item?.requestType || "Relief")
            .trim()
            .toLowerCase() === "emergency"
    );
}

function isPending(status) {
    return (
        String(status || "")
            .trim()
            .toLowerCase() === "pending"
    );
}

export default function AdminSosTable({
    cases,
    onView,
    onAssign,
}) {
    const { ui, language } = useNativeUi();
    const tx = (th, en) =>
        language === "en" ? en : th;
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="p-4">
                                Case ID
                            </th>
                            <th className="p-4">
                                {tx("ผู้แจ้ง", "Requester")}
                            </th>
                            <th className="p-4">
                                {tx("พื้นที่ / ศูนย์", "Area / Center")}
                            </th>
                            <th className="p-4 text-center">
                                {tx("ระดับ", "Priority")}
                            </th>
                            <th className="p-4 text-center">
                                {tx("สถานะ", "Status")}
                            </th>
                            <th className="p-4">
                                {tx("ผู้รับผิดชอบ", "Assigned Staff")}
                            </th>
                            <th className="p-4 text-right">
                                {tx("จัดการ", "Actions")}
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                        {cases.map((item) => (
                            <tr
                                key={item.id}
                                className={
                                    isEmergencySos(item)
                                        ? "bg-red-50/30 hover:bg-red-50"
                                        : "hover:bg-slate-50"
                                }
                            >
                                <td className="p-4 font-mono text-slate-500">
                                    #{item.id}
                                    <p className="mt-1 text-[11px] font-sans text-slate-400">
                                        {formatDate(item.createdAt, language)}
                                    </p>
                                    <span
                                        className={`mt-2 inline-flex rounded-full px-2 py-1 font-sans text-[10px] font-black ${
                                            isEmergencySos(item)
                                                ? "bg-red-100 text-red-700"
                                                : "bg-sky-100 text-sky-700"
                                        }`}
                                    >
                                        {isEmergencySos(item)
                                            ? tx("SOS ฉุกเฉิน", "Emergency SOS")
                                            : tx("ขอรับสิ่งของ", "Relief Request")}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <p className="font-bold text-slate-800">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {item.phone}
                                    </p>
                                    {item.userRemark && (
                                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                            “{item.userRemark}”
                                        </p>
                                    )}
                                </td>

                                <td className="p-4">
                                    <p className="max-w-xs text-slate-600">
                                        {item.address}
                                    </p>
                                    <p className="mt-1 text-xs font-bold text-sky-600">
                                        {ui(item.centerName)}
                                    </p>
                                </td>

                                <td className="p-4 text-center">
                                    {isEmergencySos(item) && (
                                        <AdminSosPriorityBadge
                                            priority="Critical"
                                        />
                                    )}
                                </td>

                                <td className="p-4 text-center">
                                    <AdminSosStatusBadge
                                        status={item.status}
                                    />
                                </td>

                                <td className="p-4">
                                    {item.assignedStaffName ? (
                                        <div>
                                            <p className="font-bold text-slate-700">
                                                {item.assignedStaffName}
                                            </p>
                                            <p className="text-xs font-mono text-slate-400">
                                                #{item.assignedStaffId}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold text-orange-500">
                                            {tx("ยังไม่มอบหมาย", "Not Assigned")}
                                        </span>
                                    )}
                                </td>

                                <td className="p-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onView(item)}
                                        className="mr-2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                    >
                                        <span className="material-symbols-outlined text-[19px]">
                                            visibility
                                        </span>
                                    </button>

                                    {isPending(item.status) && (
                                        <button
                                            type="button"
                                            onClick={() => onAssign(item)}
                                            className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-700"
                                        >
                                            {isEmergencySos(item)
                                                ? tx("มอบหมาย Staff", "Assign Staff")
                                                : tx("ตรวจของ + มอบหมาย", "Check Stock + Assign")}
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
