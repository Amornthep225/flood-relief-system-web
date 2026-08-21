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
import { connectNotificationRealtime } from "@/services/common/notificationRealtime";

export default function StaffNavbar({
    theme,
    hotline = "1784",
    notificationCount = 0,
    homeHref = "/staff/dashboard",
    backHref = "/staff/dashboard",
    logoutHref = "/staff/login",
    options = {},
}) {
    const router = useRouter();
    const [staff, setStaff] = useState(null);

    const {
        home = false,
        back = false,
        logout = true,
        notification = true,
        profile = true,
        hotlineButton = true,
    } = options;

    useEffect(() => {
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

        const disconnectRealtime = connectNotificationRealtime(() => {
            loadNotifications({ silent: true });
        });

        // Safety sync เท่านั้น: ปกติ notification มาทันทีผ่าน SignalR
        // ใช้รอบยาวเพื่อเก็บตกกรณี realtime event พลาดโดยไม่ยิง API ถี่
        const fallbackIntervalId = window.setInterval(() => {
            loadNotifications({ silent: true });
        }, 120000);

        return () => {
            cancelled = true;
            disconnectRealtime();
            window.clearInterval(fallbackIntervalId);
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
            router.push(
                `/staff/staff-sos?id=${encodeURIComponent(
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
                            onClick={handleLogout}
                            className="text-sm font-bold text-slate-500 hover:text-red-500"
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
                            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                                {staff.fullName?.charAt(0) || "S"}
                            </div>

                            <div className="hidden md:block">
                                <p className="text-sm font-bold text-slate-800">
                                    {staff.fullName}
                                </p>
                                <p className="text-xs text-slate-400">เจ้าหน้าที่</p>
                            </div>
                        </div>
                    )}

                    {hotlineButton && (
                        <div className="flex flex-col items-center">
                            <span className={`${theme.emergencyText} text-[10px] font-bold`}>
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