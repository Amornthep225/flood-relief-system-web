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

            const expired =
                !decoded?.exp ||
                decoded.exp * 1000 < Date.now();

            const expectedUserType =
                String(role || "").toLowerCase();

            const tokenUserType =
                String(decoded?.userType || "").toLowerCase();

            const wrongStoredRole =
                String(data?.role || "").toLowerCase() !==
                expectedUserType;

            const wrongTokenRole =
                tokenUserType !== expectedUserType;

            if (
                expired ||
                wrongStoredRole ||
                wrongTokenRole
            ) {
                // ถ้า token เป็นของ Role อื่น อย่าลบ session ของ Role นั้น
                // ลบเฉพาะข้อมูล Role ปัจจุบันที่ไม่ตรง เพื่อหยุด redirect loop
                localStorage.removeItem(storageKey);

                if (expired) {
                    localStorage.removeItem("token");
                }

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