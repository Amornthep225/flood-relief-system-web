"use client";
import { useEffect, useState } from "react";

export default function ReliefItemModal({ open, item, categories, saving, onClose, onSubmit }) {
    const [form, setForm] = useState({ name: "", unit: "", categoryId: "", isActive: true });

    useEffect(() => {
        if (!open) return;
        setForm(
            item
                ? {
                      name: item.name || "",
                      unit: item.unit || "",
                      categoryId: item.categoryId || "",
                      isActive: item.isActive !== false,
                  }
                : {
                      name: "",
                      unit: "",
                      categoryId: categories[0]?.id || "",
                      isActive: true,
                  }
        );
    }, [open, item, categories]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit({
                        name: form.name.trim(),
                        unit: form.unit.trim(),
                        categoryId: form.categoryId,
                        isActive: form.isActive,
                    });
                }}
                className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-slate-100 bg-sky-50 px-6 py-5">
                    <h2 className="text-xl font-black text-slate-800">{item ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</h2>
                    <button type="button" onClick={onClose} className="rounded-full bg-white p-2 text-slate-500">✕</button>
                </div>
                <div className="space-y-5 p-6">
                    <label className="block text-sm font-bold text-slate-700">
                        ชื่อสินค้า
                        <input
                            required
                            value={form.name}
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                        />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-bold text-slate-700">
                            หมวดหมู่
                            <select
                                required
                                value={form.categoryId}
                                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal"
                            >
                                <option value="">-- เลือกหมวดหมู่ --</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="text-sm font-bold text-slate-700">
                            หน่วย
                            <input
                                required
                                value={form.unit}
                                onChange={(event) => setForm({ ...form, unit: event.target.value })}
                                placeholder="แพ็ค / แผง / ถ้วย"
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal"
                            />
                        </label>
                    </div>
                    <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                        <span className="font-bold text-slate-700">เปิดใช้งาน</span>
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                            className="h-5 w-5"
                        />
                    </label>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 rounded-2xl border py-3 font-bold text-slate-600">ยกเลิก</button>
                        <button disabled={saving || !form.name.trim() || !form.unit.trim() || !form.categoryId} className="flex-1 rounded-2xl bg-sky-600 py-3 font-bold text-white disabled:bg-slate-300">
                            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
