"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { userRegister } from "@/services/auth/UserRegister";
import { useLanguage } from "@/contexts/LanguageContext";

const initialForm = {
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function UserRegisterForm({ links }) {
    const router = useRouter();
    const { t } = useLanguage();
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const cleanInput = (value) =>
        value.replace(/<[^>]*>?/gm, "").replace(/[<>]/g, "");

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phoneNumber") {
            const phoneOnlyNumber = value.replace(/[^0-9]/g, "").slice(0, 10);
            setForm((prev) => ({ ...prev, phoneNumber: phoneOnlyNumber }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: cleanInput(value) }));
    };

    const handlePhoneKeyDown = (e) => {
        const allowKeys = [
            "Backspace", "Delete", "ArrowLeft", "ArrowRight",
            "Tab", "Home", "End",
        ];

        if (allowKeys.includes(e.key)) return;
        if (!/[0-9]/.test(e.key)) e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.phoneNumber.length !== 10) {
            const message = t("auth.register.phoneInvalid");
            setError(message);
            await Swal.fire({
                icon: "warning",
                title: t("auth.register.incompleteTitle"),
                text: message,
            });
            return;
        }

        if (form.password !== form.confirmPassword) {
            const message = t("auth.register.passwordMismatch");
            setError(message);
            await Swal.fire({
                icon: "warning",
                title: t("auth.register.passwordCheckTitle"),
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
                title: t("auth.register.successTitle"),
                text: t("auth.register.successText"),
                timer: 1000,
                showConfirmButton: false,
            });

            router.push(links.login);
        } catch (err) {
            const message = err?.message || t("auth.register.failedTitle");
            setError(message);

            await Swal.fire({
                icon: "error",
                title: t("auth.register.failedTitle"),
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
                    label={t("auth.register.fullName")}
                    icon="person"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder={t("auth.register.fullName")}
                />

                <RegisterInput
                    label={t("auth.register.phone")}
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
                    label={t("auth.register.email")}
                    icon="mail"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                />

                <RegisterInput
                    label={t("auth.register.password")}
                    icon="lock"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                />

                <RegisterInput
                    label={t("auth.register.confirmPassword")}
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
                    {loading
                        ? t("auth.register.registering")
                        : t("auth.register.register")}
                </button>
            </form>

            <div className="relative flex py-6 items-center">
                <div className="flex-grow border-t border-slate-100" />
                <span className="mx-4 text-slate-300 text-[10px]">
                    {t("auth.register.or")}
                </span>
                <div className="flex-grow border-t border-slate-100" />
            </div>

            <div className="space-y-3">
                <Link
                    href={links.login}
                    className={buttons.userRegister.loginRedirect}
                >
                    <span className="material-symbols-outlined">login</span>
                    {t("auth.register.login")}
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
