"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { userRegister } from "@/services/auth/UserRegister";
import Swal from "sweetalert2";
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

    const cleanInput = (value) => {
        return value.replace(/<[^>]*>?/gm, "").replace(/[<>]/g, "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phoneNumber") {
            const phoneOnlyNumber = value.replace(/[^0-9]/g, "").slice(0, 10);

            setForm((prev) => ({
                ...prev,
                phoneNumber: phoneOnlyNumber,
            }));

            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: cleanInput(value),
        }));
    };

    const handlePhoneKeyDown = (e) => {
        const allowKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
            "Home",
            "End",
        ];

        if (allowKeys.includes(e.key)) return;

        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.phoneNumber.length !== 10) {
        const message = "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก";
        setError(message);

        Swal.fire({
            icon: "warning",
            title: "ข้อมูลไม่ครบ",
            text: message,
        });

        return;
    }

    if (form.password !== form.confirmPassword) {
        const message = "รหัสผ่านไม่ตรงกัน";
        setError(message);

        Swal.fire({
            icon: "warning",
            title: "ตรวจสอบรหัสผ่าน",
            text: message,
        });

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

        await Swal.fire({
            icon: "success",
            title: "ลงทะเบียนสำเร็จ",
            text: "กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...",
            timer: 1000,
            showConfirmButton: false,
        });

        router.push(links.login);
    } catch (err) {
        const message = err.message || "สมัครสมาชิกไม่สำเร็จ";
        setError(message);

        Swal.fire({
            icon: "error",
            title: "สมัครสมาชิกไม่สำเร็จ",
            text: message,
        });
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

                <RegisterInput
                    label="ชื่อ-นามสกุล"
                    icon="person"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="ชื่อ-นามสกุล"
                />

                <RegisterInput
                    label="เบอร์โทรศัพท์"
                    icon="smartphone"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    onKeyDown={handlePhoneKeyDown}
                    placeholder="08XXXXXXXX"
                    maxLength={10}
                    inputMode="numeric"
                />

                <RegisterInput
                    label="อีเมล"
                    icon="mail"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                />

                <RegisterInput
                    label="รหัสผ่าน"
                    icon="lock"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                />

                <RegisterInput
                    label="ยืนยันรหัสผ่าน"
                    icon="lock_reset"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={buttons.userRegister.register}
                >
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

                <Link
                    href={links.login}
                    className={buttons.userRegister.loginRedirect}
                >
                    <span className="material-symbols-outlined">login</span>
                    เข้าสู่ระบบ
                </Link>
            </div>
        </>
    );
}

function RegisterInput({
    label,
    icon,
    name,
    type = "text",
    value,
    onChange,
    onKeyDown,
    placeholder,
    maxLength,
    inputMode,
}) {
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
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    inputMode={inputMode}
                    className={cards.userRegister.input}
                    required
                />
            </div>
        </div>
    );
}