"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { userRegister } from "@/services/auth/UserRegister";

const initialForm = {
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function UserRegisterForm({ links }) {
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

        if (form.password !== form.confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        setLoading(true);

        try {
            await userRegister({
                fullName: form.fullName,
                phoneNumber: form.phoneNumber,
                email: form.email,
                password: form.password,
            });

            router.push(links.registerSuccess);
        } catch (err) {
            setError(err.message || "สมัครสมาชิกไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">
                        {error}
                    </div>
                )}

                <RegisterInput label="ชื่อ-นามสกุล" icon="person" name="fullName" value={form.fullName} onChange={handleChange} placeholder="ชื่อ-นามสกุล" />
                <RegisterInput label="เบอร์โทรศัพท์" icon="smartphone" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="08X-XXX-XXXX" />
                <RegisterInput label="อีเมล" icon="mail" name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com" />
                <RegisterInput label="รหัสผ่าน" icon="lock" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
                <RegisterInput label="ยืนยันรหัสผ่าน" icon="lock_reset" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />

                <button type="submit" disabled={loading} className={buttons.userRegister.register}>
                    {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
                </button>
            </form>

            <div className="relative flex py-6 items-center">
                <div className="flex-grow border-t border-slate-100" />
                <span className="mx-4 text-slate-300 text-[10px]">หรือ</span>
                <div className="flex-grow border-t border-slate-100" />
            </div>

            <div className="space-y-3">
                <button type="button" className={buttons.userRegister.line}>
                    <span className="text-xl font-bold">LINE</span>
                    <span>ลงทะเบียนด้วย LINE</span>
                </button>

                <Link href={links.login} className={buttons.userRegister.loginRedirect}>
                    <span className="material-symbols-outlined">login</span>
                    เข้าสู่ระบบ
                </Link>
            </div>
        </>
    );
}

function RegisterInput({ label, icon, name, type = "text", value, onChange, placeholder }) {
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
                    className={cards.userRegister.input}
                    required
                />
            </div>
        </div>
    );
}