"use client";

import { useState } from "react";
import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";


const mockData = {
    ref: "DON-8821",

    links: {
        back: "/staff/staff-home",
        verify: "/staff/staff-verify",
        success: "/staff/staff-verify-success",
    },

    donor: {
        name: "คุณสมชาย ใจดี",
        phone: "081-XXX-XXXX",
        method: "นำส่งเอง",
    },
};

export default function StaffVerifyDataPage() {
    const [items, setItems] = useState([
        {
            id: 1,
            name: "บะหมี่กึ่งสำเร็จรูป",
            qty: 2,
            unit: "ลัง",
            note: "รสหมูสับ / ต้มยำกุ้ง",
            checked: true,
        },
        {
            id: 2,
            name: "น้ำดื่ม 600ml",
            qty: 10,
            unit: "แพ็ค",
            note: "สิงห์ / คริสตัล",
            checked: false,
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<DonateItem | null>(null);

    const [form, setForm] = useState({
        name: "",
        qty: "",
        unit: "",
        note: "",
    });

    const openAddModal = () => {
        setEditItem(null);
        setForm({ name: "", qty: "", unit: "", note: "" });
        setIsModalOpen(true);
    };

    const openEditModal = () => {
        setEditItem(item);
        setForm({
            name: item.name,
            qty: String(item.qty),
            unit: item.unit,
            note: item.note,
        });
        setIsModalOpen(true);
    };

    const saveItem = () => {
        if (!form.name || !form.qty || !form.unit) return;

        if (editItem) {
            setItems((prev) =>
                prev.map((item) =>
                    item.id === editItem.id
                        ? {
                            ...item,
                            name: form.name,
                            qty: Number(form.qty),
                            unit: form.unit,
                            note: form.note,
                        }
                        : item
                )
            );
        } else {
            setItems((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    name: form.name,
                    qty: Number(form.qty),
                    unit: form.unit,
                    note: form.note,
                    checked: false,
                },
            ]);
        }

        setIsModalOpen(false);
    };

    const toggleCheck = () => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const deleteItem = () => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className={`relative min-h-screen flex flex-col ${colors.staffVerifyData.page}`}>
            <nav className="bg-slate-800 border-b border-slate-700 px-4 py-4 sticky top-0 z-40 shadow-lg">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <Link
                        href={mockData.links.back}
                        className="text-slate-400 hover:text-white flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">
                            arrow_back
                        </span>
                        กลับ
                    </Link>

                    <div className="text-center">
                        <h1 className="text-base font-bold text-white">
                            ตรวจสอบรายการ
                        </h1>
                        <span className="text-[10px] font-mono text-sky-500 tracking-widest">
                            REF: {mockData.ref}
                        </span>
                    </div>

                    <div className="w-8" />
                </div>
            </nav>

            <main className="flex-grow p-4 pb-24 max-w-md mx-auto w-full space-y-4">
                <section className={`${cards.staffVerifyDataPanel} p-4`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xl border border-slate-600">
                            <span className="material-symbols-outlined">
                                person
                            </span>
                        </div>

                        <div className="flex-grow">
                            <p className="text-xs text-slate-400">ผู้บริจาค</p>
                            <h3 className="text-white font-bold text-lg">
                                {mockData.donor.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {mockData.donor.phone}
                            </p>
                        </div>

                        <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-1 rounded border border-blue-500/20">
                            {mockData.donor.method}
                        </span>
                    </div>
                </section>

                <section className={`${cards.staffVerifyDataPanel} overflow-hidden`}>
                    <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">
                                รายการสิ่งของ
                            </h3>

                            <span className="bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                                {items.length}
                            </span>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="text-xs bg-sky-500/20 text-sky-500 hover:bg-sky-500/30 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-sm">
                                add
                            </span>
                            เพิ่มรายการ
                        </button>
                    </div>

                    <div className="p-2 space-y-1">
                        {items.length === 0 ? (
                            <div className="text-center py-6 text-slate-500 text-sm">
                                ไม่มีรายการสิ่งของ
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors"
                                >
                                    <button
                                        onClick={() => toggleCheck(item.id)}
                                        className={`h-5 w-5 mt-1 rounded border flex items-center justify-center ${item.checked
                                                ? "bg-green-500 border-green-500"
                                                : "border-slate-500"
                                            }`}
                                    >
                                        {item.checked && (
                                            <span className="material-symbols-outlined text-white text-[12px]">
                                                check
                                            </span>
                                        )}
                                    </button>

                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span
                                                    className={`text-slate-200 text-sm font-medium ${item.checked ? "line-through opacity-70" : ""
                                                        }`}
                                                >
                                                    {item.name}
                                                </span>

                                                <span className="text-sky-500 font-bold text-sm ml-2">
                                                    {item.qty} {item.unit}
                                                </span>
                                            </div>

                                            <div className="flex gap-2 ml-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="text-slate-500 hover:text-sky-400 p-1"
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        edit
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={() => deleteItem(item.id)}
                                                    className="text-slate-500 hover:text-red-400 p-1"
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        {item.note && (
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {item.note}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className={`${cards.staffVerifyDataPanel} p-4 space-y-4`}>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2">
                            1. หลักฐานภาพถ่าย (Proof of Receipt)
                        </label>

                        <button className="w-full h-32 border-2 border-dashed border-slate-600 rounded-xl bg-slate-900/50 hover:bg-slate-700/50 hover:border-sky-500 transition-all flex flex-col items-center justify-center gap-2 group text-slate-500 hover:text-white">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white">
                                <span className="material-symbols-outlined">
                                    photo_camera
                                </span>
                            </div>

                            <span className="text-xs">แตะเพื่อถ่ายรูปของกองรวมกัน</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2">
                            2. สภาพสิ่งของโดยรวม
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="condition"
                                    className="peer sr-only"
                                    defaultChecked
                                />
                                <div className="text-center py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-400 text-xs font-medium peer-checked:bg-green-500/20 peer-checked:text-green-400 peer-checked:border-green-500">
                                    สมบูรณ์ครบถ้วน
                                </div>
                            </label>

                            <label className="cursor-pointer">
                                <input type="radio" name="condition" className="peer sr-only" />
                                <div className="text-center py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-400 text-xs font-medium peer-checked:bg-red-500/20 peer-checked:text-red-400 peer-checked:border-red-500">
                                    เสียหาย/ไม่ครบ
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2">
                            3. หมายเหตุเพิ่มเติม (ถ้ามี)
                        </label>

                        <textarea
                            rows={2}
                            placeholder="เช่น กล่องบุบเล็กน้อย..."
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
                        />
                    </div>
                </section>
            </main>

            <div className="fixed bottom-0 w-full bg-slate-800 border-t border-slate-700 p-4 z-40">
                <div className="max-w-md mx-auto flex gap-3">
                    <Link href={mockData.links.back} className={buttons.staffVerifyDataCancel}>
                        ยกเลิก
                    </Link>

                    <Link href={mockData.links.success} className={buttons.staffVerifyDataSubmit}>
                        <span className="material-symbols-outlined text-sm">
                            inventory_2
                        </span>
                        ยืนยันรับเข้าคลัง
                    </Link>
                </div>
            </div>

            {isModalOpen && (
                <div className={cards.staffVerifyDataModal}>
                    <div className="bg-slate-800 w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold text-lg">
                                {editItem ? "แก้ไขรายการ" : "เพิ่มรายการสิ่งของ"}
                            </h3>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="ชื่อสิ่งของ"
                                placeholder="เช่น บะหมี่กึ่งสำเร็จรูป"
                                value={form.name}
                                onChange={(value) => setForm({ ...form, name: value })}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="จำนวน"
                                    placeholder="0"
                                    value={form.qty}
                                    onChange={(value) => setForm({ ...form, qty: value })}
                                    type="number"
                                />

                                <Input
                                    label="หน่วยนับ"
                                    placeholder="เช่น ลัง, แพ็ค"
                                    value={form.unit}
                                    onChange={(value) => setForm({ ...form, unit: value })}
                                />
                            </div>

                            <Input
                                label="รายละเอียดเพิ่มเติม"
                                placeholder="เช่น รสหมูสับ, ยี่ห้อ..."
                                value={form.note}
                                onChange={(value) => setForm({ ...form, note: value })}
                            />

                            <button
                                onClick={saveItem}
                                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl"
                            >
                                บันทึกข้อมูล
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Input({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
}) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
            />
        </div>
    );
}