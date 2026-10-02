"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

function dateText(value, language) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "th-TH", { dateStyle: "medium" }).format(date);
}

export function DonorTable({ rows }) {
    const { ui, language } = useNativeUi();

    return (
        <>
            <div className="divide-y divide-slate-100 md:hidden">
                {rows.map((row) => (
                    <article key={row.id} className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-bold text-slate-800">{row.donorName || "-"}</p>
                                <p className="mt-1 text-xs text-slate-400">{dateText(row.createdAt, language)}</p>
                            </div>
                            <span className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-500">#{row.id}</span>
                        </div>
                        <div className="mt-4 rounded-xl bg-slate-50 p-3">
                            <p className="text-[11px] font-bold text-slate-400">{ui("รายการสิ่งของ")}</p>
                            <p className="mt-1 break-words text-sm text-slate-700">{ui(row.itemsText) || "-"}</p>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[11px] font-bold text-slate-400">{ui("ศูนย์")}</p>
                                <p className="mt-1 break-words text-sm font-semibold text-slate-700">{ui(row.centerName) || "-"}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 p-3 text-right">
                                <p className="text-[11px] font-bold text-slate-400">{ui("จำนวน")}</p>
                                <p className="mt-1 text-lg font-black text-slate-800">{row.totalQuantity ?? 0}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            <Table headers={[ui("วันที่"), "Donation ID", ui("ผู้บริจาค"), ui("รายการสิ่งของ"), ui("ศูนย์"), ui("จำนวน")]}> 
                {rows.map((row) => (
                    <tr key={row.id} className="border-b">
                        <td className="p-4 text-slate-500">{dateText(row.createdAt, language)}</td>
                        <td className="p-4 font-mono text-xs">#{row.id}</td>
                        <td className="p-4 font-bold">{row.donorName}</td>
                        <td className="p-4 text-slate-600">{ui(row.itemsText)}</td>
                        <td className="p-4 text-slate-500">{ui(row.centerName)}</td>
                        <td className="p-4 text-right font-bold">{row.totalQuantity}</td>
                    </tr>
                ))}
            </Table>
        </>
    );
}

export function SosTable({ rows }) {
    const { ui, language } = useNativeUi();

    return (
        <>
            <div className="divide-y divide-slate-100 md:hidden">
                {rows.map((row) => (
                    <article key={row.id} className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-bold text-slate-800">{row.name || "-"}</p>
                                <p className="mt-1 text-xs text-slate-400">{dateText(row.createdAt, language)}</p>
                            </div>
                            <span className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-500">#{row.id}</span>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm">
                            <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[11px] font-bold text-slate-400">{ui("สถานที่")}</p>
                                <p className="mt-1 break-words text-slate-700">{row.place || "-"}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[11px] font-bold text-slate-400">{ui("รายละเอียด")}</p>
                                <p className="mt-1 break-words text-slate-700">{row.problem || "-"}</p>
                            </div>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[10px] font-bold text-slate-400">{ui("ผู้เสียชีวิต")}</p>
                                <p className={`mt-1 font-black ${row.deathCount > 0 ? "text-red-600" : "text-slate-500"}`}>{row.deathCount || 0}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[10px] font-bold text-slate-400">{ui("ระดับ")}</p>
                                <p className="mt-1 break-words text-xs font-bold text-slate-700">{ui(row.priority)}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 p-3">
                                <p className="text-[10px] font-bold text-slate-400">{ui("สถานะ")}</p>
                                <p className="mt-1 break-words text-xs font-bold text-slate-700">{ui(row.status)}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            <Table headers={[ui("วันที่"), "Case ID", ui("ผู้แจ้ง"), ui("สถานที่"), ui("รายละเอียด"), ui("ผู้เสียชีวิต"), ui("ระดับ"), ui("สถานะ")]}> 
                {rows.map((row) => (
                    <tr key={row.id} className="border-b">
                        <td className="p-4 text-slate-500">{dateText(row.createdAt, language)}</td>
                        <td className="p-4 font-mono text-xs">#{row.id}</td>
                        <td className="p-4 font-bold">{row.name}</td>
                        <td className="p-4 text-slate-600">{row.place}</td>
                        <td className="p-4 text-slate-600">{row.problem}</td>
                        <td className={`p-4 text-center font-black ${row.deathCount > 0 ? "text-red-600" : "text-slate-400"}`}>{row.deathCount || 0}</td>
                        <td className="p-4 text-center font-bold">{ui(row.priority)}</td>
                        <td className="p-4 text-center font-bold">{ui(row.status)}</td>
                    </tr>
                ))}
            </Table>
        </>
    );
}

export function InventoryTable({ rows }) {
    const { ui, language } = useNativeUi();

    return (
        <>
            <div className="divide-y divide-slate-100 md:hidden">
                {rows.map((row, index) => (
                    <article key={row.id || index} className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-bold text-slate-800">{ui(row.name) || "-"}</p>
                                <p className="mt-1 font-mono text-[11px] text-slate-400">#{row.reliefItemId}</p>
                            </div>
                            <span className="shrink-0 text-xs text-slate-400">{dateText(row.createdAt, language)}</span>
                        </div>
                        <p className="mt-3 break-words text-sm font-semibold text-slate-600">{ui(row.centerName) || "-"}</p>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-xl bg-emerald-50 p-3">
                                <p className="text-[10px] font-bold text-emerald-600">{ui("รับเข้า")}</p>
                                <p className="mt-1 font-black text-emerald-700">{row.inQuantity ? `+${row.inQuantity}` : "-"}</p>
                            </div>
                            <div className="rounded-xl bg-red-50 p-3">
                                <p className="text-[10px] font-bold text-red-600">{ui("จ่ายออก")}</p>
                                <p className="mt-1 font-black text-red-700">{row.outQuantity ? `-${row.outQuantity}` : "-"}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[10px] font-bold text-slate-400">{ui("คงเหลือ")}</p>
                                <p className="mt-1 font-black text-slate-800">{row.balance} <span className="text-[10px] font-semibold text-slate-400">{ui(row.unit)}</span></p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            <Table headers={[ui("วันที่"), ui("รายการ"), ui("ศูนย์"), ui("รับเข้า"), ui("จ่ายออก"), ui("คงเหลือ"), ui("หน่วย")]}> 
                {rows.map((row, index) => (
                    <tr key={row.id || index} className="border-b">
                        <td className="p-4 text-slate-500">{dateText(row.createdAt, language)}</td>
                        <td className="p-4"><p className="font-bold">{ui(row.name)}</p><p className="font-mono text-xs text-slate-400">#{row.reliefItemId}</p></td>
                        <td className="p-4">{ui(row.centerName)}</td>
                        <td className="p-4 text-center font-bold text-emerald-600">{row.inQuantity ? `+${row.inQuantity}` : "-"}</td>
                        <td className="p-4 text-center font-bold text-red-600">{row.outQuantity ? `-${row.outQuantity}` : "-"}</td>
                        <td className="p-4 text-center font-bold">{row.balance}</td>
                        <td className="p-4 text-center">{ui(row.unit)}</td>
                    </tr>
                ))}
            </Table>
        </>
    );
}

function Table({ headers, children }) {
    return (
        <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                    <tr>{headers.map((header) => <th key={header} className="p-4">{header}</th>)}</tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}
