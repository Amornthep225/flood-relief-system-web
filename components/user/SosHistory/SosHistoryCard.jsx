import Link from "next/link";

import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

const STATUS_CONFIG = {
    pending: {
        label: "รอตรวจสอบ",
        icon: "schedule",
        sideColor: "bg-amber-400",
        iconColor:
            "bg-amber-50 text-amber-600",
        badgeColor:
            "bg-amber-100 text-amber-700",
    },

    accepted: {
        label: "รับเรื่องแล้ว",
        icon: "support_agent",
        sideColor: "bg-sky-500",
        iconColor:
            "bg-sky-50 text-sky-600",
        badgeColor:
            "bg-sky-100 text-sky-700",
    },

    preparing: {
        label: "กำลังจัดเตรียม",
        icon: "inventory_2",
        sideColor: "bg-violet-500",
        iconColor:
            "bg-violet-50 text-violet-600",
        badgeColor:
            "bg-violet-100 text-violet-700",
    },

    delivering: {
        label: "กำลังเดินทาง",
        icon: "local_shipping",
        sideColor: "bg-orange-500",
        iconColor:
            "bg-orange-50 text-orange-600",
        badgeColor:
            "bg-orange-100 text-orange-700",
    },

    completed: {
        label: "สำเร็จแล้ว",
        icon: "check_circle",
        sideColor: "bg-green-500",
        iconColor:
            "bg-green-50 text-green-600",
        badgeColor:
            "bg-green-100 text-green-700",
    },

    cancelled: {
        label: "ยกเลิกแล้ว",
        icon: "cancel",
        sideColor: "bg-red-500",
        iconColor:
            "bg-red-50 text-red-600",
        badgeColor:
            "bg-red-100 text-red-700",
    },
};

export default function SosHistoryCard({
    request,
}) {
    const normalizedStatus = String(
        request.status || ""
    )
        .trim()
        .toLowerCase();

    const status =
        STATUS_CONFIG[normalizedStatus] ||
        STATUS_CONFIG.pending;

    const isCompleted =
        normalizedStatus === "completed";

    const isCancelled =
        normalizedStatus === "cancelled";

    const itemList = Array.isArray(
        request.items
    )
        ? request.items
        : [];

    const title = createRequestTitle(
        itemList
    );

    return (
        <article
            className={
                cards.userSosHistory.card
            }
        >
            <div
                className={`absolute bottom-0 left-0 top-0 w-1.5 ${status.sideColor}`}
            />

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${status.iconColor}`}
                    >
                        <span className="material-symbols-outlined">
                            {status.icon}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-bold text-slate-800 md:text-lg">
                                {title}
                            </h2>

                            <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${status.badgeColor}`}
                            >
                                {status.label}
                            </span>
                        </div>

                        <p className="mb-2 text-sm text-slate-500">
                            รหัส:

                            <span className="ml-1 font-mono font-bold text-slate-700">
                                #{request.id}
                            </span>

                            <span className="mx-2 text-slate-300">
                                •
                            </span>

                            {formatThaiDateTime(
                                request.createdAt
                            )}
                        </p>

                        {request.addressDetail && (
                            <div className="mb-3 flex items-start gap-1.5 text-sm text-slate-500">
                                <span className="material-symbols-outlined mt-0.5 text-base text-red-400">
                                    location_on
                                </span>

                                <p className="line-clamp-2">
                                    {
                                        request.addressDetail
                                    }
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {itemList
                                .slice(0, 3)
                                .map((item) => (
                                    <span
                                        key={
                                            item.id ||
                                            item.reliefItemId
                                        }
                                        className={
                                            cards
                                                .userSosHistory
                                                .tag
                                        }
                                    >
                                        {item.reliefItemName ||
                                            "สิ่งของ"}

                                        {" "}

                                        {item.quantity}

                                        {" "}

                                        {item.unit}
                                    </span>
                                ))}

                            {itemList.length >
                                3 && (
                                <span
                                    className={
                                        cards
                                            .userSosHistory
                                            .tag
                                    }
                                >
                                    +
                                    {itemList.length -
                                        3}{" "}
                                    รายการ
                                </span>
                            )}

                            <span
                                className={
                                    cards
                                        .userSosHistory
                                        .tag
                                }
                            >
                                ระดับ{" "}
                                {formatPriority(
                                    request.priority
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    <Link
                        href={`/user/sos-tracking?id=${request.id}`}
                        className={
                            isCompleted ||
                            isCancelled
                                ? buttons
                                      .userSosHistory
                                      .detail
                                : buttons
                                      .userSosHistory
                                      .tracking
                        }
                    >
                        <span className="material-symbols-outlined text-lg">
                            {isCompleted ||
                            isCancelled
                                ? "visibility"
                                : "location_on"}
                        </span>

                        {isCompleted ||
                        isCancelled
                            ? "ดูรายละเอียด"
                            : "ติดตามสถานะ"}
                    </Link>
                </div>
            </div>
        </article>
    );
}

function createRequestTitle(items) {
    if (!items.length) {
        return "คำขอความช่วยเหลือ";
    }

    const firstItem =
        items[0]?.reliefItemName;

    if (!firstItem) {
        return "คำขอความช่วยเหลือ";
    }

    if (items.length === 1) {
        return `ขอรับ ${firstItem}`;
    }

    return `ขอรับ ${firstItem} และอื่น ๆ`;
}

function formatPriority(priority) {
    const value = String(priority || "")
        .trim()
        .toLowerCase();

    const labels = {
        normal: "ปกติ",
        urgent: "เร่งด่วน",
        critical: "วิกฤต",
    };

    return labels[value] || priority || "ปกติ";
}

function formatThaiDateTime(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}