"use client";

import { useEffect, useState } from "react";
import { useNativeUi } from "@/hooks/useNativeUi";

export default function InventoryActionModal({
    mode,
    item,
    saving,
    onClose,
    onSubmit,
}) {
    const { ui, language } = useNativeUi();

    const [minimumQuantity, setMinimumQuantity] = useState("");

    const [maximumQuantity, setMaximumQuantity] = useState("");

    useEffect(() => {
        setMinimumQuantity(String(item?.minimumQuantity ?? 0));

        setMaximumQuantity(String(item?.maximumQuantity ?? 0));
    }, [item]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const min = Number(minimumQuantity);
        const max = Number(maximumQuantity);

        if (!Number.isInteger(min) || min < 0) {
            return;
        }

        if (!Number.isInteger(max) || max < 0) {
            return;
        }

        onSubmit({
            minimumQuantity: min,
            maximumQuantity: max,
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="border-b border-slate-100 bg-slate-50 p-5">
                    <h2 className="text-lg font-bold text-slate-800">
                        {ui("กำหนดจำนวนขั้นต่ำและจำนวนสูงสุด")}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {ui(item?.reliefItemName || "-")}
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-4 p-6">
                    {/* Current Stock */}
                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">{ui("คงเหลือปัจจุบัน")}</p>

                        <p className="mt-1 text-2xl font-bold text-slate-800">
                            {Number(item?.quantity ?? 0).toLocaleString(
                                language === "en" ? "en-US" : "th-TH"
                            )}{" "}
                            <span className="text-sm font-normal text-slate-500">
                                {ui(item?.unit || "")}
                            </span>
                        </p>
                    </div>

                    {/* Min / Max */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* Minimum */}
                        <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">
                                {ui("จำนวนขั้นต่ำ")}
                            </span>

                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={minimumQuantity}
                                onChange={(event) => setMinimumQuantity(event.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                        </label>

                        {/* Maximum */}
                        <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">
                                {ui("จำนวนสูงสุด")}
                            </span>

                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={maximumQuantity}
                                onChange={(event) => setMaximumQuantity(event.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                        </label>
                    </div>

                    {/* Information */}
                    <div className="rounded-lg bg-amber-50 px-3 py-2.5">
                        <p className="text-xs font-medium text-amber-700">
                            {ui("กำหนดจำนวนสูงสุดเป็น 0 หากไม่ต้องการจำกัดจำนวน")}
                        </p>
                    </div>

                    {/* Validation hint */}
                    {Number(maximumQuantity) > 0 &&
                        Number(maximumQuantity) < Number(minimumQuantity) && (
                            <div className="rounded-lg bg-rose-50 px-3 py-2.5">
                                <p className="text-xs font-medium text-rose-600">
                                    {ui("จำนวนสูงสุดต้องมากกว่าหรือเท่ากับจำนวนขั้นต่ำ")}
                                </p>
                            </div>
                        )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 rounded-xl border border-slate-200 py-3 font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {ui("ยกเลิก")}
                        </button>

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                (Number(maximumQuantity) > 0 &&
                                    Number(maximumQuantity) < Number(minimumQuantity))
                            }
                            className="flex-1 rounded-xl bg-sky-600 py-3 font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? ui("กำลังบันทึก...") : ui("บันทึก Min / Max")}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
