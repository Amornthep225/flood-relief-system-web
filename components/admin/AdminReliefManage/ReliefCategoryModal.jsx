"use client";
import { useEffect, useState } from "react";

export default function ReliefCategoryModal({ open, item, saving, onClose, onSubmit }) {
    const [form, setForm] = useState({ name: "", isActive: true });

    useEffect(() => {
        if (!open) return;
        setForm(
            item
                ? { name: item.name || "", isActive: item.isActive !== false }
                : { name: "", isActive: true }
        );
    }, [open, item]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit({ name: form.name.trim(), isActive: form.isActive });
                }}
                className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-slate-100 bg-violet-50 px-6 py-5">
                    <h2 className="text-xl font-black text-slate-800">{item ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}</h2>
                    <button type="button" onClick={onClose} className="rounded-full bg-white p-2 text-slate-500">✕</button>
                </div>
                <div className="space-y-5 p-6">
                    <label className="block text-sm font-bold text-slate-700">
                        ชื่อหมวดหมู่
                        <input
                            required
                            value={form.name}
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                        />
                    </label>
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
                        <button disabled={saving || !form.name.trim()} className="flex-1 rounded-2xl bg-violet-600 py-3 font-bold text-white disabled:bg-slate-300">
                            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
