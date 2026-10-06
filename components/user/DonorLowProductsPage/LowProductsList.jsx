"use client";

import { translateMasterDataText } from "@/locales/uiPhrases";
import { useLanguage } from "@/contexts/LanguageContext";
import LowProductsEmpty from "./LowProductsEmpty";

export default function LowProductsList({
    products,
    startIndex = 0,
    onDonate,
    donatingKey = "",
}) {
    const { language } = useLanguage();

    if (!Array.isArray(products) || products.length === 0) {
        return <LowProductsEmpty />;
    }

    const tx = (th, en) => (language === "en" ? en : th);

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="w-20 px-5 py-4 text-center">{tx("ลำดับ", "No.")}</th>
                            <th className="px-5 py-4">{tx("รายการสิ่งของ", "Item")}</th>
                            <th className="px-5 py-4">{tx("ศูนย์ช่วยเหลือ", "Relief Center")}</th>
                            <th className="px-5 py-4 text-center">{tx("คงเหลือ", "In Stock")}</th>
                            <th className="px-5 py-4 text-center">{tx("ขั้นต่ำ", "Minimum")}</th>
                            <th className="px-5 py-4 text-center">{tx("ขาด", "Shortage")}</th>
                            <th className="px-5 py-4 text-center">{tx("สถานะ", "Status")}</th>
                            <th className="w-40 px-5 py-4 text-center">{tx("ดำเนินการ", "Action")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map((item, index) => {
                            const quantity = Number(item.quantity ?? 0);
                            const minimumQuantity = Number(item.minimumQuantity ?? 0);
                            const missing = Math.max(minimumQuantity - quantity, 0);
                            const itemKey = `${item.centerId}-${item.reliefItemId}`;
                            const isDonating = donatingKey === itemKey;
                            const itemName = translateMasterDataText(
                                item.reliefItemName || tx("ไม่ระบุรายการ", "Unspecified item"),
                                language
                            );
                            const centerName = translateMasterDataText(
                                item.centerName || tx("ไม่ระบุศูนย์", "Unspecified center"),
                                language
                            );
                            const unit = translateMasterDataText(item.unit || tx("ชิ้น", "unit"), language);
                            const isOut = item.stockStatus === "OutOfStock";

                            return (
                                <tr key={itemKey} className="transition hover:bg-slate-50/70">
                                    <td className="px-5 py-4 text-center font-bold text-slate-500">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-black text-slate-800">{itemName}</div>
                                        <div className="mt-1 text-xs text-slate-400">{unit}</div>
                                    </td>
                                    <td className="px-5 py-4 font-medium text-slate-700">{centerName}</td>
                                    <td className="px-5 py-4 text-center font-bold text-slate-700">
                                        {quantity.toLocaleString()} {unit}
                                    </td>
                                    <td className="px-5 py-4 text-center text-slate-600">
                                        {minimumQuantity.toLocaleString()} {unit}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="font-black text-red-600">
                                            {missing.toLocaleString()} {unit}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${isOut ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                                            {isOut ? tx("หมดคลัง", "Out of stock") : tx("ใกล้ขาด", "Low stock")}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <button
                                            type="button"
                                            disabled={missing <= 0 || isDonating}
                                            onClick={() => onDonate?.(item)}
                                            className="inline-flex min-w-28 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 font-black text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                                        >
                                            <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                                            {isDonating ? tx("กำลังบันทึก", "Saving") : tx("บริจาค", "Donate")}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
