"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { userLogin } from "@/services/auth/UserLogin";

const initialForm = {
    phoneOrEmail: "",
    password: "",
};

export default function UserLoginForm({ links }) {
    const router = useRouter();

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
            router.replace(links.success);
        }
    }, [router, links.success]);

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
            const data = await userLogin({
                phoneOrEmail: form.phoneOrEmail,
                password: form.password,
            });

            if (!data.token) {
                throw new Error("ไม่พบ Token จากระบบ");
            }

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify({
                    userId: data.userId,
                    fullName: data.fullName,
                    role: data.role,
                })
            );

            await Swal.fire({
                icon: "success",
                title: "เข้าสู่ระบบสำเร็จ",
                text: "กำลังนำคุณไปยังหน้าเลือกบทบาท...",
                timer: 1000,
                showConfirmButton: false,
            });

            router.push(links.success);
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
        <>
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                        {error}
                    </div>
                )}

                <LoginInput
                    label="เบอร์โทรศัพท์ / อีเมล"
                    icon="smartphone"
                    name="phoneOrEmail"
                    value={form.phoneOrEmail}
                    onChange={handleChange}
                    placeholder="08X-XXX-XXXX หรือ example@email.com"
                />

                <LoginInput
                    label="รหัสผ่าน"
                    icon="lock"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-slate-500">
                        <input type="checkbox" className="rounded border-slate-300" />
                        จดจำฉันไว้
                    </label>

                    <button type="button" className="text-xs font-bold text-sky-500 hover:underline">
                        ลืมรหัสผ่าน?
                    </button>
                </div>

                <button type="submit" disabled={loading} className={buttons.userLogin.login}>
                    {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </button>
            </form>

            <div className="relative flex py-6 items-center">
                <div className="flex-grow border-t border-slate-100" />
                <span className="mx-4 text-slate-300 text-[10px]">
                    หากไม่มีบัญชีผู้ใช้
                </span>
                <div className="flex-grow border-t border-slate-100" />
            </div>

            <Link href={links.register} className={buttons.userLogin.register}>
                <span className="material-symbols-outlined">volunteer_activism</span>
                ลงทะเบียน
            </Link>
        </>
    );
}

function LoginInput({ label, icon, name, type = "text", value, onChange, placeholder }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                {label}
            </label>

            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {icon}
                </span>

                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={cards.userLogin.input}
                    required
                />
            </div>
        </div>
    );
}