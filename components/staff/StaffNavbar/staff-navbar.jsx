"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buttons } from "@/constants/buttons";
import StaffNotificationDropdown from "./StaffNotificationDropdown";
import {
    getMyNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/services/staff/notification";

export default function StaffNavbar({
    theme,
    hotline = "1784",
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
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);

    const {
        home = showHome,
        back = showBack,
        logout = showLogout,
        notification = true,
        profile = true,
        hotlineButton = true,
    } = options;

    useEffect(() => {
        const token = localStorage.getItem("token");
        const staffStorage = localStorage.getItem("staff");

        if (!token || !staffStorage) {
            router.replace("/staff/staff-login");
            return;
        }

        try {
            setStaff(JSON.parse(staffStorage));
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("staff");
            router.replace("/staff/staff-login");
        }
    }, [router]);

    useEffect(() => {
        if (!staff) {
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
                setUnreadCount(Number(response?.unreadCount || 0));
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        "Load staff notifications error:",
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
    }, [staff]);

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
                    "Mark staff notification as read error:",
                    error
                );
            }
        }

        setNotificationOpen(false);

        if (
            notificationItem.type === "StaffCaseAssigned" &&
            notificationItem.referenceId
        ) {
            router.push(
                `/staff/staff-mission-active?id=${encodeURIComponent(
                    notificationItem.referenceId
                )}`
            );
            return;
        }

        if (
            notificationItem.referenceType === "SosRequest" &&
            notificationItem.referenceId
        ) {
            router.push("/staff/staff-sos");
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
                "Mark all staff notifications as read error:",
                error
            );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("staff");
        router.replace(logoutHref);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-sm">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3 md:px-12">
                <Link href={homeHref} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2a93d5] text-white">
                        <span className="material-symbols-outlined">waves</span>
                    </div>

                    <h2
                        className={`${theme.primaryText} text-xl font-black uppercase`}
                    >
                        Flood Relief
                    </h2>
                </Link>

                <div className="flex items-center gap-5">
                    {back && (
                        <Link
                            href={backHref}
                            className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-sky-600"
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
                            className={`${theme.primaryText} text-sm font-bold hover:text-[#2a93d5]`}
                        >
                            หน้าแรก
                        </Link>
                    )}

                    {logout && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-sm font-bold text-slate-500 hover:text-red-500"
                        >
                            Logout
                        </button>
                    )}

                    {(back || home || logout) && (
                        <div className="hidden h-6 w-px bg-slate-200 md:block" />
                    )}

                    {notification && (
                        <div className="relative">
                            <button
                                type="button"
                                aria-label="การแจ้งเตือนเจ้าหน้าที่"
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
                                <StaffNotificationDropdown
                                    notifications={notifications}
                                    unreadCount={unreadCount}
                                    loading={notificationLoading}
                                    onSelect={handleNotificationSelect}
                                    onReadAll={handleReadAllNotifications}
                                />
                            )}
                        </div>
                    )}

                    {profile && staff && (
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-600">
                                {staff.fullName?.charAt(0) || "S"}
                            </div>

                            <div className="hidden md:block">
                                <p className="text-sm font-bold text-slate-800">
                                    {staff.fullName}
                                </p>
                                <p className="text-xs text-slate-400">
                                    เจ้าหน้าที่
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
