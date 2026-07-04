"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function AdminGuard({ children }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const admin = localStorage.getItem("admin");

        if (!token || !admin) {
            router.replace("/admin-login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const adminData = JSON.parse(admin);

            const tokenExpired = decoded.exp * 1000 < Date.now();
            const notAdmin = adminData.role !== "Admin";

            if (tokenExpired || notAdmin) {
                localStorage.removeItem("token");
                localStorage.removeItem("admin");
                router.replace("/admin-login");
                return;
            }

            setChecking(false);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("admin");
            router.replace("/admin-login");
        }
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-sm font-bold text-slate-500">
                    กำลังตรวจสอบสิทธิ์...
                </p>
            </div>
        );
    }

    return children;
}