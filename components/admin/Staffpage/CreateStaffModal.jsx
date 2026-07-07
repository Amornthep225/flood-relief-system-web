"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { createStaff } from "@/services/admin/staff";

const initialForm = {
    centerId: "",
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
};

export default function CreateStaffModal({ onClose, onCreated }) {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createStaff(form);

            await Swal.fire({
                icon: "success",
                title: "เพิ่มเจ้าหน้าที่สำเร็จ",
                timer: 1000,
                showConfirmButton: false,
            });

            onCreated();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "เพิ่มเจ้าหน้าที่ไม่สำเร็จ",
                text: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">
                            เพิ่มเจ้าหน้าที่
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            เจ้าหน้าที่ต้องผูกกับศูนย์เพื่อใช้จัดการคลังและภารกิจ
                        </p>
                    </div>

                    <button type="button" onClick={onClose} className="text-slate-400">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-3">
                    <StaffInput name="centerId" value={form.centerId} onChange={handleChange} placeholder="Center ID" />
                    <StaffInput name="fullName" value={form.fullName} onChange={handleChange} placeholder="ชื่อ-นามสกุล" />
                    <StaffInput name="username" value={form.username} onChange={handleChange} placeholder="Username" />
                    <StaffInput name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
                    <StaffInput name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="เบอร์โทร" />
                    <StaffInput name="password" type="password" value={form.password} onChange={handleChange} placeholder="รหัสผ่าน" />

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border rounded-xl py-3 font-bold text-slate-600"
                        >
                            ยกเลิก
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-slate-800 text-white rounded-xl py-3 font-bold disabled:opacity-60"
                        >
                            {loading ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function StaffInput({ name, type = "text", value, onChange, placeholder }) {
    return (
        <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
    );
}