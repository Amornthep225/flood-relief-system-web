"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function RoleGuard({
    children,
    role,
    storageKey,
    loginPath,
}) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem(storageKey);

        if (!token || !userData) {
            router.replace(loginPath);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const data = JSON.parse(userData);

            const expired = decoded.exp * 1000 < Date.now();
            const wrongRole = data.role !== role;

            if (expired || wrongRole) {
                localStorage.removeItem("token");
                localStorage.removeItem(storageKey);
                router.replace(loginPath);
                return;
            }

            setChecking(false);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem(storageKey);
            router.replace(loginPath);
        }
    }, [router, role, storageKey, loginPath]);

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