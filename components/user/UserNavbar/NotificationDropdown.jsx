"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useNativeUi } from "@/hooks/useNativeUi";

function getNotificationStyle(type) {
    const styles = {
        DonationReceived: {
            icon: "inventory_2",
            iconClass: "bg-sky-100 text-sky-600",
        },
        DonationInTransit: {
            icon: "volunteer_activism",
            iconClass: "bg-amber-100 text-amber-600",
        },
        DonationDelivered: {
            icon: "volunteer_activism",
            iconClass: "bg-emerald-100 text-emerald-600",
        },
        ReliefAccepted: {
            icon: "support_agent",
            iconClass: "bg-sky-100 text-sky-600",
        },
        ReliefDelivering: {
            icon: "local_shipping",
            iconClass: "bg-blue-100 text-blue-600",
        },
        ReliefCompleted: {
            icon: "task_alt",
            iconClass: "bg-emerald-100 text-emerald-600",
        },
        ReliefRejected: {
            icon: "cancel",
            iconClass: "bg-rose-100 text-rose-600",
        },
        ReliefCancelled: {
            icon: "cancel",
            iconClass: "bg-slate-200 text-slate-600",
        },
        SosCreated: {
            icon: "emergency",
            iconClass: "bg-red-100 text-red-600",
        },
        SosAccepted: {
            icon: "support_agent",
            iconClass: "bg-orange-100 text-orange-600",
        },
        SosResponderOnTheWay: {
            icon: "emergency",
            iconClass: "bg-red-100 text-red-600",
        },
        SosCompleted: {
            icon: "task_alt",
            iconClass: "bg-emerald-100 text-emerald-600",
        },
        SosRejected: {
            icon: "cancel",
            iconClass: "bg-rose-100 text-rose-600",
        },
        SosCancelled: {
            icon: "cancel",
            iconClass: "bg-slate-200 text-slate-600",
        },
    };

    return (
        styles[type] || {
            icon: "notifications",
            iconClass: "bg-slate-100 text-slate-600",
        }
    );
}

function formatNotificationTime(value, language) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString(language === "en" ? "en-US" : "th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}


function formatDonationReceivedMessage(notification, language, ui) {
    const message = notification?.message || "";

    if (notification?.type !== "DonationReceived") {
        return ui(message);
    }

    if (language !== "en") {
        return message;
    }

    const match = message.match(/^บริจาค #([^:]+):\s*(.*)$/);

    if (!match) {
        return ui(message);
    }

    const donationId = match[1];
    const translatedItems = match[2]
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
            const itemMatch = part.match(
                /^(.*?)\s+(\d+(?:\.\d+)?)\s+(.+)$/
            );

            if (!itemMatch) {
                return ui(part);
            }

            const [, name, quantity, unit] = itemMatch;
            return `${ui(name)} ${quantity} ${ui(unit)}`;
        })
        .join(", ");

    return `Donation #${donationId}: ${translatedItems}`;
}

export default function NotificationDropdown({
    notifications,
    unreadCount,
    loading,
    onSelect,
    onReadAll,
}) {
    const { language, t } = useLanguage();
    const { ui } = useNativeUi();

    return (
        <div className="absolute right-0 top-12 z-[80] w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                    <p className="font-black text-slate-800">
                        {t("common.notifications")}
                    </p>
                    <p className="text-xs text-slate-400">
                        {t("common.unread", { count: unreadCount })}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={onReadAll}
                        className="text-xs font-bold text-sky-600 transition hover:text-sky-700"
                    >
                        {t("common.readAll")}
                    </button>
                )}
            </div>

            <div className="max-h-[430px] overflow-y-auto">
                {loading && notifications.length === 0 ? (
                    <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-slate-400">
                        <span className="material-symbols-outlined animate-spin text-lg">
                            progress_activity
                        </span>
                        {t("common.loadingNotifications")}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <span className="material-symbols-outlined">
                                notifications_off
                            </span>
                        </div>
                        <p className="mt-3 text-sm font-bold text-slate-500">
                            {t("common.noNotifications")}
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => {
                        const style = getNotificationStyle(
                            notification.type
                        );

                        return (
                            <button
                                key={notification.id}
                                type="button"
                                onClick={() => onSelect(notification)}
                                className={`relative flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-sky-50/60 ${
                                    notification.isRead
                                        ? "bg-white"
                                        : "bg-sky-50/40"
                                }`}
                            >
                                {!notification.isRead && (
                                    <span className="absolute right-3 top-4 h-2 w-2 rounded-full bg-sky-500" />
                                )}

                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.iconClass}`}
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {style.icon}
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1 pr-4">
                                    <p className="text-sm font-black text-slate-800">
                                        {notification.type === "DonationReceived"
    ? language === "en"
        ? "Your donation was received by the center"
        : notification.title
    : ui(notification.title)}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                        {formatDonationReceivedMessage(
    notification,
    language,
    ui
)}
                                    </p>
                                    <p className="mt-2 text-[11px] font-medium text-slate-400">
                                        {formatNotificationTime(
                                            notification.createdAt,
                                            language
                                        )}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}