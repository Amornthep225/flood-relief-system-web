"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import { staffLogin } from "@/services/auth/StaffLogin";

const initialForm = {
    usernameOrEmail: "",
    password: "",
};

export default function StaffLoginForm({ links }) {
    const router = useRouter();

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await staffLogin({
                usernameOrEmail: form.usernameOrEmail,
                password: form.password,
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("staff", JSON.stringify({
                staffId: data.staffId,
                fullName: data.fullName,
                role: data.role,
                centerId: data.centerId,
            }));

            await Swal.fire({
                icon: "success",
                title: "เข้าสู่ระบบสำเร็จ",
                timer: 1000,
                showConfirmButton: false,
            });

            router.push(links.staffHome);
        } catch (err) {
            const message = err.message || "เข้าสู่ระบบไม่สำเร็จ";
            setError(message);

            Swal.fire({
                icon: "error",
                title: "เข้าสู่ระบบไม่สำเร็จ",
                text: message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                    {error}
                </div>
            )}

            <InputField
                label="Username / Email"
                icon="badge"
                name="usernameOrEmail"
                value={form.usernameOrEmail}
                onChange={handleChange}
                placeholder="ระบุ Username หรือ Email"
            />

            <InputField
                label="รหัสผ่าน"
                icon="lock"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-xs mt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-700">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                    />
                    <span>จดจำฉันไว้</span>
                </label>

                <button
                    type="button"
                    className="text-slate-500 font-semibold hover:text-slate-700 hover:underline"
                >
                    ลืมรหัสผ่าน?
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={buttons.staffLogin.login}
            >
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
        </form>
    );
}

function InputField({
    label,
    icon,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                {label}
            </label>

            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    {icon}
                </span>

                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={cards.staffLogin.input}
                    required
                />
            </div>
        </div>
    );
}