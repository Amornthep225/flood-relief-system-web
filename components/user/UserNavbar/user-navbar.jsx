"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buttons } from "@/constants/buttons";

<<<<<<<< HEAD:components/user/UserNavbar/user-navbar.jsx
export default function UserNavbar({
    theme,
    hotline = "1784",
    notificationCount = 0,
    homeHref = "/",
    backHref = "/",
    logoutHref = "/user/users-login",
    options = {},
}) {
    const router = useRouter();
    const [user, setUser] = useState(null);
========
export default function StaffNavbar({
    theme,
    hotline = "1784",
    notificationCount = 0,
    homeHref = "/staff/dashboard",
    backHref = "/staff/dashboard",
    logoutHref = "/staff/login",
    showHome = true,
    showBack = true,
    showLogout = true,
    options = {},
}) {
    const router = useRouter();
    const [staff, setStaff] = useState(null);
>>>>>>>> staff:components/staff/StaffNavbar/staff-navbar.jsx

    const {
        home = showHome,
        back = showBack,
        logout = showLogout,
        notification = true,
        profile = true,
        hotlineButton = true,
    } = options;

    useEffect(() => {
<<<<<<<< HEAD:components/user/UserNavbar/user-navbar.jsx
    const token = localStorage.getItem("token");
    const userStorage = localStorage.getItem("user");

    if (!token || !userStorage) {
        router.replace("/user/users-login");
        return;
    }

    try {
        setUser(JSON.parse(userStorage));
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/user/users-login");
    }
}, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
========
        const token = localStorage.getItem("token");
        const staffStorage = localStorage.getItem("staff");

        if (!token || !staffStorage) {
            router.replace("/staff/login");
            return;
        }

        try {
            setStaff(JSON.parse(staffStorage));
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("staff");
            router.replace("/staff/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("staff");
>>>>>>>> staff:components/staff/StaffNavbar/staff-navbar.jsx
        router.replace(logoutHref);
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href={homeHref} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#2a93d5] rounded-lg flex items-center justify-center text-white">
<<<<<<<< HEAD:components/user/UserNavbar/user-navbar.jsx
                        <span className="material-symbols-outlined text-2xl">
                            waves
                        </span>
========
                        <span className="material-symbols-outlined">waves</span>
>>>>>>>> staff:components/staff/StaffNavbar/staff-navbar.jsx
                    </div>

                    <h2
                        className={`${theme.primaryText} text-xl font-black uppercase`}
                    >
                        Flood Relief
                    </h2>
                </Link>

                <div className="flex items-center gap-5">
                    {back && (
<<<<<<<< HEAD:components/user/UserNavbar/user-navbar.jsx
                        <Link href={backHref} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors">
========
                        <Link
                            href={backHref}
                            className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-sky-600"
                        >
>>>>>>>> staff:components/staff/StaffNavbar/staff-navbar.jsx
                            <span className="material-symbols-outlined text-[18px]">
                                arrow_back
                            </span>
                            กลับ
                        </Link>
                    )}

                    {home && (
<<<<<<<< HEAD:components/user/UserNavbar/user-navbar.jsx
                        <Link href={homeHref} className={`${theme.primaryText} text-sm font-bold hover:text-[#2a93d5] transition-colors`}>
========
                        <Link
                            href={homeHref}
                            className={`${theme.primaryText} text-sm font-bold hover:text-[#2a93d5]`}
                        >
>>>>>>>> staff:components/staff/StaffNavbar/staff-navbar.jsx
                            หน้าแรก
                        </Link>
                    )}

                    {logout && (
                        <button
<<<<<<<< HEAD:components/user/UserNavbar/user-navbar.jsx
                            type="button"
                            onClick={handleLogout}
                            className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors"
========
                            onClick={handleLogout}
                            className="text-sm font-bold text-slate-500 hover:text-red-500"
>>>>>>>> staff:components/staff/StaffNavbar/staff-navbar.jsx
                        >
                            Logout
                        </button>
                    )}

                    {(back || home || logout) && (
                        <div className="hidden md:block h-6 w-px bg-slate-200" />
                    )}

                    {notification && (
                        <button className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-600">
                                notifications
                            </span>

                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                    {notificationCount}
                                </span>
                            )}
                        </button>
                    )}

                    {profile && staff && (
                        <div className="flex items-center gap-3">
<<<<<<<< HEAD:components/user/UserNavbar/user-navbar.jsx
                            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold border border-slate-200">
                                {user.fullName?.charAt(0) || "U"}
                            </div>

                            <div className="hidden md:block">
                                <p className={`${theme.primaryText} text-sm font-bold`}>
                                    {user.fullName}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {user.email}
========
                            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                                {staff.fullName?.charAt(0) || "S"}
                            </div>

                            <div className="hidden md:block">
                                <p className="text-sm font-bold text-slate-800">
                                    {staff.fullName}
>>>>>>>> staff:components/staff/StaffNavbar/staff-navbar.jsx
                                </p>
                            </div>
                        </div>
                    )}

                    {hotlineButton && (
                        <div className="flex flex-col items-center">
                            <span
                                className={`${theme.emergencyText} text-[10px] font-bold`}
                            >
                                สายด่วนฉุกเฉิน
                            </span>

                            <a
                                href={`tel:${hotline}`}
                                className={buttons.common.hotline}
                            >
                                {hotline}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}