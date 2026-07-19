"use client";

import Link from "next/link";
import { useState } from "react";
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
    const [showPassword, setShowPassword] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) {
            return;
        }

        setError("");

        const phoneOrEmail =
            form.phoneOrEmail.trim();

        if (!phoneOrEmail) {
            setError(
                "กรุณากรอกเบอร์โทรศัพท์หรืออีเมล"
            );

            return;
        }

        if (!form.password) {
            setError("กรุณากรอกรหัสผ่าน");
            return;
        }

        setLoading(true);

        try {
            const data = await userLogin({
                phoneOrEmail,
                password: form.password,
            });

            if (!data.token) {
                throw new Error(
                    "Backend ไม่ได้ส่ง Token กลับมา"
                );
            }

            if (data.role !== "User") {
                throw new Error(
                    "บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานในส่วนผู้ใช้"
                );
            }

            /*
             * ล้าง Token เก่าของ Role อื่นก่อน
             */
            localStorage.removeItem("admin");
            localStorage.removeItem("staff");

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    userId: data.userId,
                    fullName: data.fullName,
                    email: data.email,
                    role: data.role,
                })
            );

            await Swal.fire({
                icon: "success",
                title: "เข้าสู่ระบบสำเร็จ",
                text: "กำลังนำคุณเข้าสู่ระบบ...",
                timer: 1000,
                showConfirmButton: false,
                allowOutsideClick: false,
            });

            router.replace(links.success);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "เข้าสู่ระบบไม่สำเร็จ";

            setError(message);

            await Swal.fire({
                icon: "error",
                title: "เข้าสู่ระบบไม่สำเร็จ",
                text: message,
                confirmButtonText: "ตกลง",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
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
                    autoComplete="username"
                />

                <LoginInput
                    label="รหัสผ่าน"
                    icon="lock"
                    name="password"
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    showPasswordButton
                    showPassword={showPassword}
                    onTogglePassword={() =>
                        setShowPassword(
                            (previous) => !previous
                        )
                    }
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-slate-500">
                        <input
                            type="checkbox"
                            className="rounded border-slate-300"
                        />
                        จดจำฉันไว้
                    </label>

                    <button
                        type="button"
                        className="text-xs font-bold text-sky-500 hover:underline"
                    >
                        ลืมรหัสผ่าน?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`${buttons.userLogin.login} ${
                        loading
                            ? "cursor-not-allowed opacity-60"
                            : ""
                    }`}
                >
                    {loading
                        ? "กำลังเข้าสู่ระบบ..."
                        : "เข้าสู่ระบบ"}
                </button>
            </form>

            <div className="relative flex items-center py-6">
                <div className="flex-grow border-t border-slate-100" />

                <span className="mx-4 text-[10px] text-slate-300">
                    หากไม่มีบัญชีผู้ใช้
                </span>

                <div className="flex-grow border-t border-slate-100" />
            </div>

            <Link
                href={links.register}
                className={buttons.userLogin.register}
            >
                <span className="material-symbols-outlined">
                    volunteer_activism
                </span>
                ลงทะเบียน
            </Link>
        </>
    );
}

function LoginInput({
    label,
    icon,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    autoComplete,
    showPasswordButton = false,
    showPassword = false,
    onTogglePassword,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-1.5 ml-1 block text-xs font-semibold text-slate-600"
            >
                {label}
            </label>

            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {icon}
                </span>

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`${cards.userLogin.input} ${
                        showPasswordButton
                            ? "pr-12"
                            : ""
                    }`}
                    required
                />

                {showPasswordButton && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 hover:text-sky-500"
                        aria-label={
                            showPassword
                                ? "ซ่อนรหัสผ่าน"
                                : "แสดงรหัสผ่าน"
                        }
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {showPassword
                                ? "visibility_off"
                                : "visibility"}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}