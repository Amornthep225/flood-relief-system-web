"use client";

function getNotificationStyle(type) {
    if (type === "DonationDelivered") {
        return {
            icon: "volunteer_activism",
            iconClass: "bg-emerald-100 text-emerald-600",
        };
    }

    if (type === "DonationReceived") {
        return {
            icon: "inventory_2",
            iconClass: "bg-sky-100 text-sky-600",
        };
    }

    return {
        icon: "notifications",
        iconClass: "bg-slate-100 text-slate-600",
    };
}

function formatNotificationTime(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function NotificationDropdown({
    notifications,
    unreadCount,
    loading,
    onSelect,
    onReadAll,
}) {
    return (
        <div className="absolute right-0 top-12 z-[80] w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                    <p className="font-black text-slate-800">
                        การแจ้งเตือน
                    </p>
                    <p className="text-xs text-slate-400">
                        ยังไม่ได้อ่าน {unreadCount} รายการ
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={onReadAll}
                        className="text-xs font-bold text-sky-600 transition hover:text-sky-700"
                    >
                        อ่านทั้งหมด
                    </button>
                )}
            </div>

            <div className="max-h-[430px] overflow-y-auto">
                {loading && notifications.length === 0 ? (
                    <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-slate-400">
                        <span className="material-symbols-outlined animate-spin text-lg">
                            progress_activity
                        </span>
                        กำลังโหลดการแจ้งเตือน...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <span className="material-symbols-outlined">
                                notifications_off
                            </span>
                        </div>
                        <p className="mt-3 text-sm font-bold text-slate-500">
                            ยังไม่มีการแจ้งเตือน
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
                                        {notification.title}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                        {notification.message}
                                    </p>
                                    <p className="mt-2 text-[11px] font-medium text-slate-400">
                                        {formatNotificationTime(
                                            notification.createdAt
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
