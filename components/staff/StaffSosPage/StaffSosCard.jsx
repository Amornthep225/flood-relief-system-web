import Link from "next/link";

export default function StaffSosCard({
    request,
    onAccept,
    onOpenGps,
    onOpenDetail,
}) {
    const status = normalizeStatus(request.status);
    const isWaiting = status === "pending";
    const isCompleted = status === "completed";

    const style = getStatusStyle(status);

    const items = Array.isArray(request.items)
        ? request.items
        : [];

    return (
        <article
            className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${style.border}`}
        >
            <div
                className={`absolute bottom-0 left-0 top-0 w-1 ${style.bar}`}
            />

            <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex min-w-[100px] items-center gap-3 md:flex-col md:border-r md:border-slate-100 md:pr-5">
                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full ${style.icon}`}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {getStatusIcon(status)}
                        </span>
                    </div>

                    <div className="md:text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            SOS ID
                        </p>

                        <p className="font-mono text-sm font-bold text-slate-700">
                            #{request.id}
                        </p>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-800">
                            {getRequestTitle(request)}
                        </h3>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}
                        >
                            {getStatusLabel(status)}
                        </span>

                        <PriorityBadge
                            priority={request.priority}
                        />
                    </div>

                    <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <Information
                            icon="person"
                            text={
                                request.userFullName ||
                                "ไม่ระบุชื่อผู้แจ้ง"
                            }
                        />

                        <Information
                            icon="call"
                            text={
                                request.userPhoneNumber ||
                                "ไม่ระบุเบอร์โทร"
                            }
                        />

                        <Information
                            icon="location_on"
                            text={
                                request.addressDetail ||
                                "ไม่ระบุสถานที่"
                            }
                            full
                        />

                        <Information
                            icon="schedule"
                            text={formatThaiDateTime(
                                request.createdAt
                            )}
                        />
                    </div>

                    {request.userRemark && (
                        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm italic text-slate-500">
                            “{request.userRemark}”
                        </div>
                    )}

                    {items.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                รายการที่ร้องขอ
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {items.map((item, index) => (
                                    <span
                                        key={
                                            item.id ||
                                            `${item.reliefItemId}-${index}`
                                        }
                                        className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700"
                                    >
                                        {item.reliefItemName ||
                                            item.name ||
                                            "ไม่ระบุรายการ"}{" "}
                                        {item.quantity || 0}{" "}
                                        {item.unit || ""}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex min-w-[170px] flex-row gap-2 md:flex-col md:justify-center">
                    {isWaiting && (
                        <button
                            type="button"
                            onClick={() =>
                                onAccept(request)
                            }
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700"
                        >
                            <span className="material-symbols-outlined text-lg">
                                assignment_turned_in
                            </span>
                            รับงาน
                        </button>
                    )}

                    {!isWaiting && !isCompleted && (
                        <Link
                            href={`/staff/staff-mission-active?id=${request.id}`}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
                        >
                            <span className="material-symbols-outlined text-lg">
                                play_arrow
                            </span>
                            ดำเนินการต่อ
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            onOpenGps(request)
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
                    >
                        <span className="material-symbols-outlined text-lg">
                            map
                        </span>
                        ดูพิกัด
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            onOpenDetail(request)
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                    >
                        <span className="material-symbols-outlined text-lg">
                            description
                        </span>
                        รายละเอียด
                    </button>
                </div>
            </div>
        </article>
    );
}

function Information({ icon, text, full = false }) {
    return (
        <div
            className={`flex min-w-0 items-start gap-2 ${
                full ? "sm:col-span-2" : ""
            }`}
        >
            <span className="material-symbols-outlined mt-0.5 text-lg text-slate-400">
                {icon}
            </span>

            <span className="break-words">{text}</span>
        </div>
    );
}

function PriorityBadge({ priority }) {
    const value = String(priority || "")
        .trim()
        .toLowerCase();

    const priorityConfig = {
        critical: {
            label: "วิกฤต",
            className:
                "bg-red-100 text-red-700 ring-1 ring-red-200",
        },
        urgent: {
            label: "เร่งด่วน",
            className:
                "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
        },
        normal: {
            label: "ปกติ",
            className:
                "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
        },
    };

    const config =
        priorityConfig[value] ||
        priorityConfig.normal;

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${config.className}`}
        >
            {config.label}
        </span>
    );
}

function normalizeStatus(status) {
    return String(status || "")
        .trim()
        .toLowerCase();
}

function getStatusStyle(status) {
    const styles = {
        pending: {
            border: "border-orange-200",
            bar: "bg-orange-500",
            icon: "bg-orange-100 text-orange-600",
            badge: "bg-orange-100 text-orange-600",
        },
        accepted: {
            border: "border-sky-200",
            bar: "bg-sky-500",
            icon: "bg-sky-100 text-sky-600",
            badge: "bg-sky-100 text-sky-600",
        },
        preparing: {
            border: "border-amber-200",
            bar: "bg-amber-500",
            icon: "bg-amber-100 text-amber-600",
            badge: "bg-amber-100 text-amber-600",
        },
        delivering: {
            border: "border-blue-200",
            bar: "bg-blue-600",
            icon: "bg-blue-100 text-blue-600",
            badge: "bg-blue-100 text-blue-600",
        },
        completed: {
            border: "border-emerald-200",
            bar: "bg-emerald-500",
            icon: "bg-emerald-100 text-emerald-600",
            badge: "bg-emerald-100 text-emerald-600",
        },
    };

    return styles[status] || styles.pending;
}

function getStatusLabel(status) {
    const labels = {
        pending: "รอรับเรื่อง",
        accepted: "รับเรื่องแล้ว",
        preparing: "กำลังจัดเตรียม",
        delivering: "กำลังนำส่ง",
        completed: "เสร็จสิ้น",
        cancelled: "ยกเลิก",
    };

    return labels[status] || status || "ไม่ระบุ";
}

function getStatusIcon(status) {
    const icons = {
        pending: "pending_actions",
        accepted: "support_agent",
        preparing: "inventory_2",
        delivering: "local_shipping",
        completed: "task_alt",
        cancelled: "cancel",
    };

    return icons[status] || "emergency";
}

function getRequestTitle(request) {
    const items = Array.isArray(request.items)
        ? request.items
        : [];

    if (items.length === 0) {
        return "คำขอความช่วยเหลือ";
    }

    if (items.length === 1) {
        return (
            items[0].reliefItemName ||
            items[0].name ||
            "คำขอความช่วยเหลือ"
        );
    }

    return `ขอความช่วยเหลือ ${items.length} รายการ`;
}

function formatThaiDateTime(value) {
    if (!value) {
        return "ไม่ระบุเวลา";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "ไม่ระบุเวลา";
    }

    return date.toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
} 