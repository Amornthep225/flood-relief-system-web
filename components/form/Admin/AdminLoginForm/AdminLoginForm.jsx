"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { colors } from "@/constants/colors";
import { adminLogin } from "@/services/auth/AdminLogin";

const initialForm = {
    usernameOrEmail: "",
    password: "",
};

export default function AdminLoginForm({ dashboardPath }) {
    const router = useRouter();

    const [form, setForm] = useState(initialForm);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await adminLogin({
                usernameOrEmail: form.usernameOrEmail,
                password: form.password,
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "admin",
                JSON.stringify({
                    adminId: data.adminId,
                    username: data.username,
                    email: data.email,
                    role: data.role,
                })
            );

            await Swal.fire({
                icon: "success",
                title: "เข้าสู่ระบบสำเร็จ",
                timer: 1000,
                showConfirmButton: false,
            });

            router.push(dashboardPath);
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
        <form onSubmit={handleLogin} className="space-y-5">
            {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                    {error}
                </div>
            )}

            <InputField
                label="ชื่อผู้ใช้งาน / อีเมล"
                name="usernameOrEmail"
                type="text"
                value={form.usernameOrEmail}
                onChange={handleChange}
                placeholder="ระบุชื่อผู้ใช้งานหรืออีเมล"
            />

            <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">
                    รหัสผ่าน
                </label>

                <div className="relative">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="ระบุรหัสผ่าน"
                        required
                        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none ${colors.admin.primaryRing} ${colors.admin.primaryBorder}`}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400"
                    >
                        <span className="material-symbols-outlined">
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full ${colors.admin.primary} text-white font-bold py-3.5 rounded-xl shadow-lg ${colors.admin.primaryShadow}`}
            >
                {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบศูนย์บัญชาการ"}
            </button>
        </form>
    );
}

function InputField({ label, name, type, value, onChange, placeholder }) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">
                {label}
            </label>

            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none ${colors.admin.primaryRing} ${colors.admin.primaryBorder}`}
            />
        </div>
    );
}