"use client";

import { useNativeUi } from "@/hooks/useNativeUi";
import InventoryStatusBadge from "./InventoryStatusBadge";

export default function AdminInventoryTable({ items, onThresholds }) {
    const { ui } = useNativeUi();

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100 md:hidden">
                {items.map((item) => (
                    <article key={item.id || item.reliefItemId} className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="break-words text-base font-bold text-slate-800">
                                    {ui(item.reliefItemName)}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {ui(item.categoryName || "ไม่ระบุหมวดหมู่")}
                                </p>
                            </div>
                            <span className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-500">
                                #{item.reliefItemId}
                            </span>
                        </div>

                        <div className="mt-4 flex items-end justify-between gap-3 rounded-2xl bg-sky-50 p-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-sky-600">{ui("คงเหลือ")}</p>
                                <p className="mt-1 text-2xl font-black text-slate-900">
                                    {Number(item.quantity || 0).toLocaleString("th-TH")}
                                    <span className="ml-1.5 text-sm font-semibold text-slate-500">{ui(item.unit)}</span>
                                </p>
                            </div>
                            <InventoryStatusBadge status={item.stockStatus} />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[11px] font-bold text-slate-400">{ui("จุดขั้นต่ำ")}</p>
                                <p className="mt-1 font-bold text-slate-700">
                                    {Number(item.minimumQuantity || 0).toLocaleString("th-TH")} {ui(item.unit)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[11px] font-bold text-slate-400">{ui("จุดสูงสุด")}</p>
                                <p className="mt-1 font-bold text-slate-700">
                                    {Number(item.maximumQuantity || 0) > 0
                                        ? `${Number(item.maximumQuantity).toLocaleString("th-TH")} ${ui(item.unit)}`
                                        : ui("ไม่จำกัด")}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onThresholds(item)}
                            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 py-2.5 text-sm font-bold text-sky-700 transition hover:bg-sky-100"
                        >
                            <span className="material-symbols-outlined text-[19px]">tune</span>
                            {ui("แก้ Min / Max")}
                        </button>
                    </article>
                ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[820px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <th className="p-4">{ui("รหัส")}</th>
                            <th className="p-4">{ui("รายการสิ่งของ")}</th>
                            <th className="p-4 text-center">{ui("คงเหลือ")}</th>
                            <th className="p-4 text-center">{ui("จุดขั้นต่ำ")}</th>
                            <th className="p-4 text-center">{ui("จุดสูงสุด")}</th>
                            <th className="p-4 text-center">{ui("สถานะ")}</th>
                            <th className="p-4 text-right">{ui("จัดการ")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {items.map((item) => (
                            <tr key={item.id || item.reliefItemId} className="hover:bg-slate-50">
                                <td className="p-4 font-mono text-slate-400">{item.reliefItemId}</td>
                                <td className="p-4">
                                    <p className="font-bold text-slate-800">{ui(item.reliefItemName)}</p>
                                    <p className="text-xs text-slate-500">{ui(item.categoryName || "ไม่ระบุหมวดหมู่")}</p>
                                </td>
                                <td className="p-4 text-center">
                                    <span className="text-lg font-bold text-slate-800">{Number(item.quantity || 0).toLocaleString("th-TH")}</span>
                                    <span className="ml-1 text-xs text-slate-500">{ui(item.unit)}</span>
                                </td>
                                <td className="p-4 text-center text-slate-600">{Number(item.minimumQuantity || 0).toLocaleString("th-TH")} {ui(item.unit)}</td>
                                <td className="p-4 text-center text-slate-600">
                                    {Number(item.maximumQuantity || 0) > 0 ? `${Number(item.maximumQuantity).toLocaleString("th-TH")} ${ui(item.unit)}` : ui("ไม่จำกัด")}
                                </td>
                                <td className="p-4 text-center"><InventoryStatusBadge status={item.stockStatus} /></td>
                                <td className="p-4 text-right">
                                    <button type="button" onClick={() => onThresholds(item)} className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100">
                                        {ui("แก้ Min / Max")}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
