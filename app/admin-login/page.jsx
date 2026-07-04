"use client";

import { colors } from "@/constants/colors";
import PublicNavbar from "@/components/common/public-navbar";
import AdminLoginForm from "@/components/form/Admin/AdminLoginForm/AdminLoginForm";


export default function AdminLoginPage() {
    return (
        <div className={`${colors.admin.page} relative min-h-screen flex flex-col overflow-hidden`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={colors.admin.backgroundTop}></div>
                <div className={colors.admin.backgroundBottom}></div>
            </div>

            <PublicNavbar />

            <main className="relative z-10 flex-grow flex items-center justify-center px-4">
                <div className="bg-white w-full max-w-[420px] rounded-3xl shadow-2xl shadow-blue-100/50 p-8 md:p-10 border border-slate-100">
                    <div className="flex justify-center mb-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${colors.admin.iconBox}`}>
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

                    <AdminLoginForm dashboardPath="/admin/admin-dashboard" />
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