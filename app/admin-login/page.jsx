"use client";

import { useState } from "react";
import { colors } from "@/constants/colors";
import PublicNavbar from "@/components/common/public-navbar";
export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        setLoading(true);

        setTimeout(() => {
            window.location.href = "../admin/admin-dashboard";
        }, 1000);
    };

    return (
        <div
            className={`${colors.admin.page} relative min-h-screen flex flex-col overflow-hidden`}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={colors.admin.backgroundTop}></div>
                <div className={colors.admin.backgroundBottom}></div>
            </div>

            <PublicNavbar  />

            <main className="relative z-10 flex-grow flex items-center justify-center px-4">
                <div className="bg-white w-full max-w-[420px] rounded-3xl shadow-2xl shadow-blue-100/50 p-8 md:p-10 border border-slate-100">
                    <div className="flex justify-center mb-6">
                        <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${colors.admin.iconBox}`}
                        >
                            <span className="material-symbols-outlined text-4xl">
                                admin_panel_settings
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            เข้าสู่ระบบ (ผู้ดูแลระบบ)
                        </h1>

                        <p className="text-slate-400 text-xs">
                            ระบบจัดการศูนย์บัญชาการช่วยเหลือผู้ประสบภัยน้ำท่วม
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">
                                ชื่อผู้ใช้งาน / อีเมล
                            </label>

                            <input
                                type="text"
                                placeholder="ระบุชื่อผู้ใช้งานหรืออีเมล"
                                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none ${colors.admin.primaryRing} ${colors.admin.primaryBorder}`}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">
                                รหัสผ่าน
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="ระบุรหัสผ่าน"
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
                            {loading
                                ? "กำลังตรวจสอบ..."
                                : "เข้าสู่ระบบศูนย์บัญชาการ"}
                        </button>

                        <div className="text-center space-y-3 pt-2">
                            <button
                                type="button"
                                className={`${colors.admin.primaryText} text-xs font-bold`}
                            >
                                ลืมรหัสผ่าน?
                            </button>

                            <p className="text-[10px] text-slate-400">
                                มีปัญหาการใช้งาน? ติดต่อฝ่ายเทคนิค
                            </p>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="w-full py-6 text-center relative z-10">
                <div className="text-[10px] text-slate-400">
                    © 2026 FLOOD RELIEF COMMAND CENTER
                </div>
            </footer>
        </div>
    );
}