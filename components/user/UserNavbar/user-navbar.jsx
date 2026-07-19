"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buttons } from "@/constants/buttons";

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

    const {
        home = false,
        back = false,
        logout = false,
        notification = true,
        profile = true,
        hotlineButton = true,
    } = options;

    useEffect(() => {
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
        router.replace(logoutHref);
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
                <Link href={homeHref} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#2a93d5] rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-2xl">
                            waves
                        </span>
                    </div>

                    <h2 className={`${theme.primaryText} text-xl font-black uppercase tracking-tight`}>
                        Flood Relief
                    </h2>
                </Link>

                <div className="flex items-center gap-5">
                    {back && (
                        <Link href={backHref} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">
                                arrow_back
                            </span>
                            กลับ
                        </Link>
                    )}

                    {home && (
                        <Link href={homeHref} className={`${theme.primaryText} text-sm font-bold hover:text-[#2a93d5] transition-colors`}>
                            หน้าแรก
                        </Link>
                    )}

                    {logout && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors"
                        >
                            Logout
                        </button>
                    )}

                    {(back || home || logout) && (
                        <div className="hidden md:block h-6 w-px bg-slate-200" />
                    )}

                    {notification && (
                        <button className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-600">
                                notifications
                            </span>

                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                    {notificationCount}
                                </span>
                            )}
                        </button>
                    )}

                    {profile && user && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold border border-slate-200">
                                {user.fullName?.charAt(0) || "U"}
                            </div>

                            <div className="hidden md:block">
                                <p className={`${theme.primaryText} text-sm font-bold`}>
                                    {user.fullName}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {hotlineButton && (
                        <div className="flex flex-col items-center">
                            <span className={`${theme.emergencyText} text-[10px] font-bold`}>
                                สายด่วนฉุกเฉิน
                            </span>

                            <a href={`tel:${hotline}`} className={buttons.common.hotline}>
                                {hotline}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}