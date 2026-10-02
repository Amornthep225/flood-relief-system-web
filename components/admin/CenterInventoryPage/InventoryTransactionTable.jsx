"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

function formatDate(value, language) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function normalizeType(value) {
    return String(value || "").trim().toLowerCase().replaceAll("_", "-").replaceAll(" ", "-");
}

function isStockIn(item) {
    const type = normalizeType(item?.transactionType);
    const stockInTypes = ["in", "stock-in", "stockin", "receive", "received", "donation", "donation-in", "receive-donation", "inbound"];
    const stockOutTypes = ["out", "stock-out", "stockout", "withdraw", "issue", "dispatch", "outbound", "sos-out"];

    if (stockInTypes.includes(type)) return true;
    if (stockOutTypes.includes(type)) return false;

    const note = String(item?.note || "").trim().toLowerCase();
    if (note.includes("รับของบริจาค") || note.includes("รับเข้าคลัง") || note.includes("ของเข้า")) return true;
    if (note.includes("จ่ายสิ่งของ") || note.includes("เบิกออก") || note.includes("ของออก")) return false;
    return Number(item?.quantity || 0) > 0;
}

export default function InventoryTransactionTable({ transactions }) {
    const { ui, language } = useNativeUi();

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100 md:hidden">
                {transactions.map((item, index) => {
                    const stockIn = isStockIn(item);
                    return (
                        <article key={item.id || `${item.createdAt}-${index}`} className="p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="break-words font-bold text-slate-800">{item.reliefItemName || "-"}</p>
                                    <p className="mt-1 text-xs text-slate-400">{formatDate(item.createdAt, language)}</p>
                                </div>
                                <span className={stockIn ? "shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700" : "shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"}>
                                    {ui(stockIn ? "ของเข้า" : "ของออก")}
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <p className="text-[11px] font-bold text-slate-400">{ui("จำนวน")}</p>
                                    <p className={`mt-1 text-lg font-black ${stockIn ? "text-emerald-600" : "text-red-600"}`}>
                                        {stockIn ? "+" : "-"}{Math.abs(Number(item.quantity || 0)).toLocaleString("th-TH")}
                                        <span className="ml-1 text-xs font-medium text-slate-400">{item.unit}</span>
                                    </p>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <p className="text-[11px] font-bold text-slate-400">{ui("ก่อน → หลัง")}</p>
                                    <p className="mt-1 font-bold text-slate-700">{item.quantityBefore ?? "-"} → {item.quantityAfter ?? "-"}</p>
                                </div>
                            </div>

                            <dl className="mt-4 grid gap-2 text-sm">
                                <div className="grid grid-cols-[6.5rem_1fr] gap-2">
                                    <dt className="font-semibold text-slate-400">{ui("อ้างอิง")}</dt>
                                    <dd className="break-all text-slate-600">{item.referenceType || "-"} / {item.referenceId || "-"}</dd>
                                </div>
                                <div className="grid grid-cols-[6.5rem_1fr] gap-2">
                                    <dt className="font-semibold text-slate-400">{ui("ผู้ทำรายการ")}</dt>
                                    <dd className="break-words text-slate-600">{item.createdBy || "-"}</dd>
                                </div>
                                <div className="grid grid-cols-[6.5rem_1fr] gap-2">
                                    <dt className="font-semibold text-slate-400">{ui("หมายเหตุ")}</dt>
                                    <dd className="break-words text-slate-600">{item.note || "-"}</dd>
                                </div>
                            </dl>
                        </article>
                    );
                })}
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[820px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <th className="p-4">{ui("วันที่")}</th>
                            <th className="p-4">{ui("ประเภท")}</th>
                            <th className="p-4">{ui("รายการ")}</th>
                            <th className="p-4 text-center">{ui("จำนวน")}</th>
                            <th className="p-4 text-center">{ui("ก่อน → หลัง")}</th>
                            <th className="p-4">{ui("อ้างอิง")}</th>
                            <th className="p-4">{ui("ผู้ทำรายการ")}</th>
                            <th className="p-4">{ui("หมายเหตุ")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {transactions.map((item, index) => {
                            const stockIn = isStockIn(item);
                            return (
                                <tr key={item.id || `${item.createdAt}-${index}`} className="hover:bg-slate-50">
                                    <td className="whitespace-nowrap p-4 text-xs text-slate-500">{formatDate(item.createdAt, language)}</td>
                                    <td className="p-4"><span className={stockIn ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700" : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"}>{ui(stockIn ? "ของเข้า" : "ของออก")}</span></td>
                                    <td className="p-4 font-bold text-slate-700">{item.reliefItemName}</td>
                                    <td className="p-4 text-center font-bold"><span className={stockIn ? "text-emerald-600" : "text-red-600"}>{stockIn ? "+" : "-"}{Math.abs(Number(item.quantity || 0)).toLocaleString("th-TH")}</span> <span className="text-xs font-normal text-slate-400">{item.unit}</span></td>
                                    <td className="p-4 text-center text-slate-500">{item.quantityBefore ?? "-"} → {item.quantityAfter ?? "-"}</td>
                                    <td className="p-4 text-xs">{item.referenceType} / {item.referenceId}</td>
                                    <td className="p-4 text-slate-600">{item.createdBy || "-"}</td>
                                    <td className="p-4 text-slate-500">{item.note || "-"}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
