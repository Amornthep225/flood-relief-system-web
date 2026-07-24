import Link from "next/link";

import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

const completedStatuses = [
    "completed",
    "received",
    "success",
];

function normalizeStatus(status) {
    return String(status || "")
        .trim()
        .toLowerCase();
}

function isCompletedStatus(status) {
    return completedStatuses.includes(
        normalizeStatus(status)
    );
}

function getStatusLabel(status) {
    const normalized = normalizeStatus(status);

    const labels = {
        pending: "ลงทะเบียนสำเร็จ",
        processing: "กำลังดำเนินการ",
        accepted: "ศูนย์รับรายการแล้ว",
        preparing: "กำลังเตรียมรับของ",
        delivering: "กำลังจัดส่ง",
        received: "ศูนย์ได้รับของแล้ว",
        completed: "เสร็จสิ้น",
        success: "เสร็จสิ้น",
        rejected: "ปฏิเสธรายการ",
        cancelled: "ยกเลิกรายการ",
    };

    return labels[normalized] || status || "ไม่ระบุสถานะ";
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return new Intl.DateTimeFormat("th-TH", {
        day: "numeric",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function getItemName(item) {
    return (
        item?.reliefItemName ||
        item?.itemName ||
        item?.name ||
        item?.reliefItem?.name ||
        "สิ่งของบริจาค"
    );
}

function getItemUnit(item) {
    return (
        item?.unit ||
        item?.reliefItem?.unit ||
        ""
    );
}

export default function DonationHistoryCard({
    donation,
}) {
    const completed = isCompletedStatus(
        donation.status
    );

    const items = Array.isArray(donation.items)
        ? donation.items
        : [];

    const firstItemName =
        items.length > 0
            ? getItemName(items[0])
            : "รายการบริจาค";

    const title =
        items.length > 1
            ? `${firstItemName} และอีก ${items.length - 1
            } รายการ`
            : `บริจาค${firstItemName}`;

    return (
        <article
            className={`${cards.donorHistory.card} !border-slate-200 !bg-white shadow-sm transition-shadow hover:shadow-md`}
        >
            <div
                className={`absolute bottom-0 left-0 top-0 w-1.5 ${completed
                        ? "bg-green-500"
                        : "bg-sky-500"
                    }`}
            />

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-start gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${completed
                                ? "bg-green-50 text-green-600"
                                : "bg-sky-50 text-sky-600"
                            }`}
                    >
                        <span className="material-symbols-outlined">
                            {completed
                                ? "check"
                                : "local_shipping"}
                        </span>
                    </div>

                    <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-800">
                                {title}
                            </h3>

                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${completed
                                        ? "bg-green-100 text-green-700"
                                        : "bg-sky-100 text-sky-700"
                                    }`}
                            >
                                {getStatusLabel(
                                    donation.status
                                )}
                            </span>
                        </div>

                        <p className="mb-2 text-sm text-slate-500">
                            รหัส: #{donation.id} •{" "}
                            {formatDate(
                                donation.createdAt
                            )}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {items.map(
                                (donatedItem, index) => (
                                    <span
                                        key={
                                            donatedItem.id ||
                                            `${donation.id}-${index}`
                                        }
                                        className={
                                            cards
                                                .donorHistory
                                                .tag
                                        }
                                    >
                                        <span className="material-symbols-outlined text-sm text-sky-500">
                                            inventory_2
                                        </span>

                                        {getItemName(
                                            donatedItem
                                        )}{" "}
                                        x
                                        {donatedItem.quantity ??
                                            0}{" "}
                                        {getItemUnit(
                                            donatedItem
                                        )}
                                    </span>
                                )
                            )}

                            {items.length === 0 && (
                                <span className="text-sm text-slate-400">
                                    ไม่มีรายละเอียดสิ่งของ
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="shrink-0 md:text-right">
                    <Link
                        href={`/user/donor-tracking?id=${encodeURIComponent(
                            donation.id
                        )}`}
                        className={
                            completed
                                ? buttons.donorHistory
                                    .detail
                                : buttons.donorHistory
                                    .tracking
                        }
                    >
                        <span className="material-symbols-outlined text-sm">
                            {completed
                                ? "visibility"
                                : "location_on"}
                        </span>

                        {completed
                            ? "ดูรายละเอียด"
                            : "ติดตามสถานะ"}
                    </Link>
                </div>
            </div>
        </article>
    );
}