"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
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
    const { ui, language } = useNativeUi();
    const router = useRouter();

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        const staffStorage =
            localStorage.getItem("staff");

        // มี token ของ User/Admin อยู่ ต้องยังเข้าหน้า Staff Login ได้
        // จะ redirect เฉพาะเมื่อ session ปัจจุบันเป็น Staff จริงเท่านั้น
        if (!token || !staffStorage) {
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const staffData =
                JSON.parse(staffStorage);

            const expired =
                !decoded?.exp ||
                decoded.exp * 1000 < Date.now();

            const isStaffToken =
                String(
                    decoded?.userType || ""
                ).toLowerCase() === "staff";

            const isStaffStorage =
                String(
                    staffData?.role || ""
                ).toLowerCase() === "staff";

            if (
                !expired &&
                isStaffToken &&
                isStaffStorage
            ) {
                router.replace(
                    "/staff/staff-home"
                );
                return;
            }

            // stale staff data เท่านั้น ไม่แตะ token ของ User/Admin
            localStorage.removeItem("staff");

            if (expired) {
                localStorage.removeItem(
                    "token"
                );
            }
        } catch {
            localStorage.removeItem("staff");
        }
    }, [router]);
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

            // ระบบใช้ token key ร่วมกันทุก Role
            // เมื่อ Login Staff สำเร็จ ให้เปลี่ยน session เป็น Staff แบบชัดเจน
            localStorage.removeItem("user");
            localStorage.removeItem("admin");
            localStorage.setItem("token", data.token);
            localStorage.setItem("staff", JSON.stringify({
                staffId: data.staffId,
                fullName: data.fullName,
                role: data.role,
                centerId: data.centerId,
            }));

            await Swal.fire({
                icon: "success",
                title: ui("เข้าสู่ระบบสำเร็จ"),
                timer: 1000,
                showConfirmButton: false,
            });

            router.push(links.staffHome);
        } catch (err) {
            const message = ui(err.message || "เข้าสู่ระบบไม่สำเร็จ");
            setError(message);

            Swal.fire({
                icon: "error",
                title: ui("เข้าสู่ระบบไม่สำเร็จ"),
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
                placeholder={ui("ระบุ Username หรือ Email")}
            />

            <InputField
                label={ui("รหัสผ่าน")}
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
                    <span>{ui("จดจำฉันไว้")}</span>
                </label>

                <button
                    type="button"
                    className="text-slate-500 font-semibold hover:text-slate-700 hover:underline"
                >
                    {ui("ลืมรหัสผ่าน?")}
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-success hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-slate-800/20 transition-all active:scale-[0.98] w-full mt-2"
            >
                {loading ? ui("กำลังเข้าสู่ระบบ...") : ui("เข้าสู่ระบบ")}
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