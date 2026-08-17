"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buttons } from "@/constants/buttons";
import NotificationDropdown from "./NotificationDropdown";
import {
    getMyNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/services/user/notification";

export default function UserNavbar({
    theme,
    hotline = "1784",
    homeHref = "/",
    backHref = "/",
    logoutHref = "/user/users-login",
    showBack = true,
    showHome = true,
    options = {},
}) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);

    const {
        home = showHome,
        back = showBack,
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

    useEffect(() => {
        if (!user) {
            return;
        }

        let cancelled = false;

        const loadNotifications = async ({ silent = false } = {}) => {
            try {
                if (!silent) {
                    setNotificationLoading(true);
                }

                const response = await getMyNotifications(20);

                if (cancelled) {
                    return;
                }

                setNotifications(
                    Array.isArray(response?.notifications)
                        ? response.notifications
                        : []
                );
                setUnreadCount(
                    Number(response?.unreadCount || 0)
                );
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        "Load notifications error:",
                        error
                    );
                }
            } finally {
                if (!cancelled && !silent) {
                    setNotificationLoading(false);
                }
            }
        };

        loadNotifications();

        const intervalId = window.setInterval(() => {
            loadNotifications({ silent: true });
        }, 30000);

        return () => {
            cancelled = true;
            window.clearInterval(intervalId);
        };
    }, [user]);

    const handleNotificationSelect = async (notificationItem) => {
        if (!notificationItem) {
            return;
        }

        if (!notificationItem.isRead) {
            try {
                await markNotificationAsRead(notificationItem.id);

                setNotifications((current) =>
                    current.map((item) =>
                        item.id === notificationItem.id
                            ? { ...item, isRead: true }
                            : item
                    )
                );
                setUnreadCount((count) => Math.max(count - 1, 0));
            } catch (error) {
                console.error(
                    "Mark notification as read error:",
                    error
                );
            }
        }

        setNotificationOpen(false);

        if (
            notificationItem.referenceType === "Donation" &&
            notificationItem.referenceId
        ) {
            router.push(
                `/user/donor-tracking?id=${encodeURIComponent(
                    notificationItem.referenceId
                )}`
            );
            return;
        }

        if (
            notificationItem.referenceType === "SosRequest" &&
            notificationItem.referenceId
        ) {
            router.push(
                `/user/sos-tracking?id=${encodeURIComponent(
                    notificationItem.referenceId
                )}`
            );
        }
    };

    const handleReadAllNotifications = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications((current) =>
                current.map((item) => ({
                    ...item,
                    isRead: true,
                }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error(
                "Mark all notifications as read error:",
                error
            );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace(logoutHref);
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href={homeHref} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#2a93d5] rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">waves</span>
                    </div>

                    <h2 className={`${theme.primaryText} text-xl font-black uppercase`}>
                        Flood Relief
                    </h2>
                </Link>

                <div className="flex items-center gap-5">
                    {back && (
                        <Link
                            href={backHref}
                            className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                arrow_back
                            </span>
                            กลับ
                        </Link>
                    )}

                    {home && (
                        <Link
                            href={homeHref}
                            className={`${theme.primaryText} text-sm font-bold hover:text-[#2a93d5] transition-colors`}
                        >
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
                        <div className="relative">
                            <button
                                type="button"
                                aria-label="การแจ้งเตือน"
                                aria-expanded={notificationOpen}
                                onClick={() =>
                                    setNotificationOpen((open) => !open)
                                }
                                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
                                    notificationOpen
                                        ? "bg-sky-100 text-sky-600"
                                        : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                                }`}
                            >
                                <span className="material-symbols-outlined">
                                    notifications
                                </span>

                                {unreadCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                        {unreadCount > 99
                                            ? "99+"
                                            : unreadCount}
                                    </span>
                                )}
                            </button>

                            {notificationOpen && (
                                <NotificationDropdown
                                    notifications={notifications}
                                    unreadCount={unreadCount}
                                    loading={notificationLoading}
                                    onSelect={handleNotificationSelect}
                                    onReadAll={handleReadAllNotifications}
                                />
                            )}
                        </div>
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
                                <p className="text-xs text-slate-400">{user.email}</p>
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