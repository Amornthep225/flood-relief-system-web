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
import { connectNotificationRealtime } from "@/services/common/notificationRealtime";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

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
    const { t } = useLanguage();
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
            <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-3 sm:h-auto sm:min-h-[72px] sm:px-6 sm:py-3 md:px-12">
                {/* Logo */}
                <Link href={homeHref} className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2a93d5] text-white sm:h-10 sm:w-10">
                        <span className="material-symbols-outlined">waves</span>
                    </div>

                    <h2 className={`${theme.primaryText} hidden text-lg font-black uppercase sm:block sm:text-xl`}>
                        Flood Relief
                    </h2>
                </Link>

                <div className="ml-auto flex min-w-0 shrink-0 items-center justify-end gap-1 sm:gap-3 lg:gap-5">
                    {back && (
                        <Link
                            href={backHref}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-0 text-sm font-bold text-slate-500 transition-colors hover:bg-sky-50 hover:text-sky-600 sm:h-10 sm:w-auto sm:gap-1 sm:px-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                arrow_back
                            </span>
                            <span className="hidden sm:inline">{t("common.back")}</span>
                        </Link>
                    )}

                    {home && (
                        <Link
                            href={homeHref}
                            className={`${theme.primaryText} hidden h-10 items-center justify-center gap-1 rounded-xl px-2 text-sm font-bold transition-colors hover:bg-sky-50 hover:text-[#2a93d5] sm:flex`}
                        >
                            <span className="material-symbols-outlined text-[20px]">home</span>
                            <span className="hidden sm:inline">{t("common.home")}</span>
                        </Link>
                    )}

                    {logout && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-0 text-sm font-bold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500 sm:h-10 sm:w-auto sm:gap-1 sm:px-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            <span className="hidden lg:inline">{t("common.logout")}</span>
                        </button>
                    )}

                    {(back || home || logout) && (
                        <div className="hidden h-6 w-px bg-slate-200 lg:block" />
                    )}

                    <LanguageSwitcher />

                    {notification && (
                        <div className="relative">
                            <button
                                type="button"
                                aria-label={t("common.notifications")}
                                aria-expanded={notificationOpen}
                                onClick={() =>
                                    setNotificationOpen((open) => !open)
                                }
                                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition sm:h-10 sm:w-10 ${
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
                        <div className="hidden items-center gap-3 sm:flex">
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
                        <div className="flex shrink-0 flex-col items-center">
                            <span className={`${theme.emergencyText} hidden text-[10px] font-bold sm:block`}>
                                {t("common.emergencyHotline")}
                            </span>

                            <a href={`tel:${hotline}`} className={`${buttons.common.hotline} !h-9 !min-h-0 !w-auto !min-w-0 !rounded-xl !px-2.5 !py-0 !text-sm !leading-none sm:!h-auto sm:!px-4 sm:!py-2 sm:!text-base`}>
                                {hotline}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}