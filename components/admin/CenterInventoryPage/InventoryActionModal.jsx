"use client";

import { useState } from "react";

export default function InventoryActionModal({
    mode,
    item,
    saving,
    onClose,
    onSubmit,
}) {
    const [quantity, setQuantity] =
        useState("");
    const [note, setNote] =
        useState("");

    const isStockIn =
        mode === "stock-in";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    onSubmit({
                        reliefItemId:
                            item.reliefItemId,
                        quantity,
                        note,
                    });
                }}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <div className="border-b border-slate-100 bg-slate-50 p-5">
                    <h2 className="text-lg font-bold text-slate-800">
                        {isStockIn
                            ? "เพิ่มสต็อก"
                            : "ตัดสต็อก"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {
                            item.reliefItemName
                        }
                    </p>
                </div>

                <div className="space-y-4 p-6">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">
                            คงเหลือปัจจุบัน
                        </p>

                        <p className="text-2xl font-bold text-slate-800">
                            {item.quantity.toLocaleString(
                                "th-TH"
                            )}{" "}
                            <span className="text-sm font-normal text-slate-500">
                                {item.unit}
                            </span>
                        </p>
                    </div>

                    <label className="block">
                        <span className="mb-1 block text-xs font-bold text-slate-500">
                            จำนวน
                        </span>

                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={quantity}
                            onChange={(event) =>
                                setQuantity(
                                    event.target.value
                                )
                            }
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-xs font-bold text-slate-500">
                            หมายเหตุ
                        </span>

                        <textarea
                            rows="3"
                            value={note}
                            onChange={(event) =>
                                setNote(
                                    event.target.value
                                )
                            }
                            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </label>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 rounded-xl border border-slate-200 py-3 font-bold text-slate-600 disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className={
                                isStockIn
                                    ? "flex-1 rounded-xl bg-teal-600 py-3 font-bold text-white disabled:opacity-50"
                                    : "flex-1 rounded-xl bg-orange-600 py-3 font-bold text-white disabled:opacity-50"
                            }
                        >
                            {saving
                                ? "กำลังบันทึก..."
                                : isStockIn
                                  ? "ยืนยัน Stock In"
                                  : "ยืนยัน Stock Out"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
