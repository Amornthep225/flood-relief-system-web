"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

import ReliefStatusBadge from "./ReliefStatusBadge";

export default function ReliefItemTable({
    rows,
    onEdit,
    onToggle,
    onToggleDonation,
}) {
    const { ui } = useNativeUi();
    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="font-black text-slate-800">{ui("รายการสินค้า")}</h2>
                <p className="mt-1 text-sm text-slate-500">
                    {ui("จัดการชื่อสินค้า หมวดหมู่ หน่วย และสถานะ")}
                </p>
            </div>

            {rows.length === 0 ? (
                <div className="px-6 py-20 text-center text-slate-500">
                    {ui("ไม่พบสินค้า")}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-6 py-4">{ui("รหัส")}</th>
                                <th className="px-6 py-4">{ui("ชื่อสินค้า")}</th>
                                <th className="px-6 py-4">{ui("หมวดหมู่")}</th>
                                <th className="px-6 py-4">{ui("หน่วย")}</th>
                                <th className="px-6 py-4 text-center">{ui("ขอได้สูงสุด/คำขอ")}</th>
                                <th className="px-6 py-4 text-center">{ui("สถานะ")}</th>
                                <th className="px-6 py-4 text-center">{ui("รับบริจาค")}</th>
                                <th className="px-6 py-4 text-right">{ui("จัดการ")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {rows.map((item) => (
                                <tr key={item.id} className="hover:bg-sky-50/40">
                                    <td className="px-6 py-5 font-mono text-xs font-bold text-slate-400">
                                        #{item.id}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <p className="font-bold text-slate-800">
                                                {ui(item.name)}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                                            {item.categoryName || "-"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-slate-600">
                                        {item.unit || "-"}
                                    </td>
                                    <td className="px-6 py-5 text-center font-bold text-slate-600">
                                        {Number(item.maximumRequestQuantity || 0) > 0
                                            ? Number(item.maximumRequestQuantity).toLocaleString("th-TH")
                                            : ui("ไม่จำกัด")}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <ReliefStatusBadge isActive={item.isActive} />
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${item.isDonationOpen
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {item.isDonationOpen ? ui("เปิดรับ") : ui("ปิดรับ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="inline-flex gap-2">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="rounded-xl bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700"
                                            >
                                                {ui("แก้ไข")}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onToggleDonation(item)}
                                                disabled={!item.isActive && !item.isDonationOpen}
                                                className={`rounded-xl px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${item.isDonationOpen
                                                        ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                                                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                    }`}
                                            >
                                                {item.isDonationOpen
                                                    ? ui("ปิดรับบริจาค")
                                                    : ui("เปิดรับบริจาค")}
                                            </button>

                                            {/* ปุ่มเปิด/ปิดใช้งานเดิมของนายอยู่ต่อจากนี้ */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
