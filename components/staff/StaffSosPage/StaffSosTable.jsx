"use client";

import Link from "next/link";
import { useNativeUi } from "@/hooks/useNativeUi";

const LONG_WAIT_HOURS = 3;

export default function StaffSosTable({
    requests,
    requestType = "emergency",
    onAccept,
    onOpenGps,
    onOpenDetail,
}) {
    const { ui, language } = useNativeUi();
    const isEmergencyView = requestType === "emergency";

    return (
        <>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block">
                <div className="max-h-[68vh] overflow-y-auto overflow-x-hidden">
                    <table className="w-full table-fixed border-collapse text-left">
                        <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
                            <tr className="border-b border-slate-200 text-xs font-black text-slate-500">
                                <th className="w-[9%] px-2.5 py-3">{ui("รหัส")}</th>
                                <th className="w-[19%] px-2.5 py-3">
                                    {ui(isEmergencyView ? "ประเภท SOS" : "รายการที่ขอ")}
                                </th>
                                <th className="w-[12%] px-2.5 py-3">{ui("ผู้แจ้ง")}</th>
                                <th className="w-[15%] px-2.5 py-3">{ui("สถานที่")}</th>
                                <th className="w-[11%] px-2.5 py-3">
                                    {ui(isEmergencyView ? "ความสำคัญ" : "วิธีรับ")}
                                </th>
                                <th className="w-[11%] px-2.5 py-3">
                                    {ui(isEmergencyView ? "ผู้ได้รับผลกระทบ" : "จำนวน")}
                                </th>
                                <th className="w-[12%] px-2.5 py-3">{ui("สถานะ / เวลา")}</th>
                                <th className="w-[11%] px-2 py-3 text-center">{ui("จัดการ")}</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {requests.map((request) => (
                                <DesktopRow
                                    key={request.id}
                                    request={request}
                                    ui={ui}
                                    language={language}
                                    onAccept={onAccept}
                                    onOpenGps={onOpenGps}
                                    onOpenDetail={onOpenDetail}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="space-y-3 lg:hidden">
                {requests.map((request) => (
                    <MobileRow
                        key={request.id}
                        request={request}
                        ui={ui}
                        language={language}
                        onAccept={onAccept}
                        onOpenGps={onOpenGps}
                        onOpenDetail={onOpenDetail}
                    />
                ))}
            </div>
        </>
    );
}

function DesktopRow({
    request,
    ui,
    language,
    onAccept,
    onOpenGps,
    onOpenDetail,
}) {
    const status = normalizeStatus(request.status);
    const isWaiting = status === "pending";
    const isCompleted = status === "completed";
    const isEmergency = isEmergencyRequest(request);
    const isPickup =
        !isEmergency &&
        String(request.receiveMethod || "Delivery").toLowerCase() === "pickup";
    const waitInfo = getWaitInfo(request.createdAt);
    const isLongWaiting = isWaiting && waitInfo.hours >= LONG_WAIT_HOURS;
    const style = getStatusStyle(status);
    const items = Array.isArray(request.items) ? request.items : [];
    const deathCount = getEffectiveDeathCount(request);

    return (
        <tr
            className={`align-middle transition hover:bg-sky-50/40 ${
                isLongWaiting ? "bg-red-50/30" : "bg-white"
            }`}
        >
            <td className="px-2.5 py-3">
                <div className="flex items-center gap-2">
                    <span className={`h-8 w-1 shrink-0 rounded-full ${isLongWaiting ? "bg-red-500" : style.bar}`} />
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            {isEmergency ? "SOS ID" : ui("รหัสคำขอ")}
                        </p>
                        <p className="truncate font-mono text-xs font-black text-slate-700">
                            #{request.id}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-2.5 py-3">
                <p className="truncate text-sm font-black text-slate-800" title={ui(getRequestTitle(request))}>
                    {ui(getRequestTitle(request))}
                </p>
                <div className="mt-1 flex min-w-0 items-center gap-1.5 overflow-hidden">
                    {isEmergency ? (
                        request.severity ? (
                            <CompactSeverity severity={request.severity} ui={ui} />
                        ) : null
                    ) : (
                        <CompactItems items={items} ui={ui} />
                    )}
                </div>
            </td>

            <td className="px-2.5 py-3 text-sm text-slate-600">
                <p className="truncate font-bold text-slate-700" title={request.userFullName || ui("ไม่ระบุชื่อผู้แจ้ง")}>
                    {request.userFullName || ui("ไม่ระบุชื่อผู้แจ้ง")}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500" title={request.userPhoneNumber || ui("ไม่ระบุเบอร์โทร")}>
                    {request.userPhoneNumber || ui("ไม่ระบุเบอร์โทร")}
                </p>
            </td>

            <td className="px-2.5 py-3">
                <p
                    className="line-clamp-2 text-xs leading-5 text-slate-600"
                    title={request.addressDetail || ui("ไม่ระบุสถานที่")}
                >
                    {request.addressDetail || ui("ไม่ระบุสถานที่")}
                </p>
            </td>

            <td className="px-2.5 py-3">
                {isEmergency ? (
                    <div className="space-y-1">
                        <CompactPriority priority={request.priority} ui={ui} />
                        {isLongWaiting ? (
                            <span className="block w-fit rounded-full bg-red-100 px-2 py-1 text-[11px] font-black text-red-700">
                                {ui(formatLongWait(waitInfo))}
                            </span>
                        ) : null}
                    </div>
                ) : (
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ${
                            isPickup
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm">
                            {isPickup ? "storefront" : "local_shipping"}
                        </span>
                        {ui(isPickup ? "รับเอง" : "จัดส่ง")}
                    </span>
                )}
            </td>

            <td className="px-2.5 py-3">
                {isEmergency ? (
                    <div className="space-y-1 text-xs text-slate-600">
                        <p>{ui("ผู้ประสบภัย")} <strong className="text-slate-800">{request.victimCount || 1}</strong></p>
                        <p className="truncate">
                            {ui("ผู้ป่วย")} {request.patientCount || 0}
                            {deathCount > 0 ? (
                                <span className="ml-2 font-black text-red-600">
                                    {ui("เสียชีวิต")} {deathCount}
                                </span>
                            ) : null}
                        </p>
                    </div>
                ) : (
                    <ReliefQuantitySummary items={items} ui={ui} />
                )}
            </td>

            <td className="px-2.5 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${style.badge}`}>
                    {ui(isPickup && status === "delivering" ? "พร้อมรับที่ศูนย์" : getStatusLabel(status))}
                </span>
                <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                    {formatDateTime(request.createdAt, language)}
                </p>
            </td>

            <td className="px-2.5 py-3">
                <div className="flex items-center justify-center gap-1">
                    {isWaiting ? (
                        <IconButton
                            icon="assignment_turned_in"
                            label={ui("รับงาน")}
                            className="bg-sky-600 text-white hover:bg-sky-700"
                            onClick={() => onAccept(request)}
                        />
                    ) : null}

                    {!isWaiting && !isCompleted ? (
                        <Link
                            href={`/staff/staff-mission-active?id=${request.id}`}
                            title={ui("ดำเนินการต่อ")}
                            aria-label={ui("ดำเนินการต่อ")}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white transition hover:bg-orange-600"
                        >
                            <span className="material-symbols-outlined text-lg">play_arrow</span>
                        </Link>
                    ) : null}

                    {!isPickup ? (
                        <IconButton
                            icon="map"
                            label={ui("ดูพิกัด")}
                            className="border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600"
                            onClick={() => onOpenGps(request)}
                        />
                    ) : null}

                    <IconButton
                        icon="description"
                        label={ui("รายละเอียด")}
                        className="border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
                        onClick={() => onOpenDetail(request)}
                    />
                </div>
            </td>
        </tr>
    );
}

function MobileRow({
    request,
    ui,
    language,
    onAccept,
    onOpenGps,
    onOpenDetail,
}) {
    const status = normalizeStatus(request.status);
    const isWaiting = status === "pending";
    const isCompleted = status === "completed";
    const isEmergency = isEmergencyRequest(request);
    const isPickup =
        !isEmergency &&
        String(request.receiveMethod || "Delivery").toLowerCase() === "pickup";
    const waitInfo = getWaitInfo(request.createdAt);
    const isLongWaiting = isWaiting && waitInfo.hours >= LONG_WAIT_HOURS;
    const style = getStatusStyle(status);
    const items = Array.isArray(request.items) ? request.items : [];
    const deathCount = getEffectiveDeathCount(request);

    return (
        <article className={`overflow-hidden rounded-xl border bg-white shadow-sm ${isLongWaiting ? "border-red-300" : style.border}`}>
            <div className="flex items-stretch">
                <div className={`w-1 shrink-0 ${isLongWaiting ? "bg-red-500" : style.bar}`} />
                <div className="min-w-0 flex-1 p-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-800">
                                {ui(getRequestTitle(request))}
                            </p>
                            <p className="mt-1 font-mono text-[11px] font-bold text-slate-400">
                                #{request.id}
                            </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${style.badge}`}>
                            {ui(isPickup && status === "delivering" ? "พร้อมรับที่ศูนย์" : getStatusLabel(status))}
                        </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600">
                        <p className="truncate font-bold text-slate-700">
                            {request.userFullName || ui("ไม่ระบุชื่อผู้แจ้ง")}
                        </p>
                        <p className="truncate text-right">{request.userPhoneNumber || "-"}</p>
                        <p className="col-span-2 truncate">{request.addressDetail || ui("ไม่ระบุสถานที่")}</p>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {isEmergency ? (
                            <>
                                <CompactPriority priority={request.priority} ui={ui} />
                                {request.severity ? <CompactSeverity severity={request.severity} ui={ui} /> : null}
                                <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">
                                    {ui("ผู้ประสบภัย")} {request.victimCount || 1}
                                </span>
                                {deathCount > 0 ? (
                                    <span className="rounded-full bg-red-600 px-2 py-1 text-[10px] font-black text-white">
                                        {ui("เสียชีวิต")} {deathCount}
                                    </span>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black ${isPickup ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                                    {ui(isPickup ? "รับเอง" : "จัดส่ง")}
                                </span>
                                <CompactItems items={items} ui={ui} />
                            </>
                        )}
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                        <p className="truncate text-[10px] text-slate-400">
                            {formatDateTime(request.createdAt, language)}
                            {isLongWaiting ? ` · ${ui(formatLongWait(waitInfo))}` : ""}
                        </p>

                        <div className="flex shrink-0 items-center gap-1.5">
                            {isWaiting ? (
                                <IconButton
                                    icon="assignment_turned_in"
                                    label={ui("รับงาน")}
                                    className="bg-sky-600 text-white"
                                    onClick={() => onAccept(request)}
                                />
                            ) : null}

                            {!isWaiting && !isCompleted ? (
                                <Link
                                    href={`/staff/staff-mission-active?id=${request.id}`}
                                    title={ui("ดำเนินการต่อ")}
                                    aria-label={ui("ดำเนินการต่อ")}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white"
                                >
                                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                                </Link>
                            ) : null}

                            {!isPickup ? (
                                <IconButton
                                    icon="map"
                                    label={ui("ดูพิกัด")}
                                    className="border border-slate-200 bg-white text-slate-600"
                                    onClick={() => onOpenGps(request)}
                                />
                            ) : null}

                            <IconButton
                                icon="description"
                                label={ui("รายละเอียด")}
                                className="border border-slate-200 bg-white text-slate-600"
                                onClick={() => onOpenDetail(request)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

function IconButton({ icon, label, className = "", onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            aria-label={label}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${className}`}
        >
            <span className="material-symbols-outlined text-lg">{icon}</span>
        </button>
    );
}

function CompactPriority({ priority, ui }) {
    const value = String(priority || "normal").trim().toLowerCase();
    const config = {
        critical: ["วิกฤต", "bg-red-100 text-red-700"],
        urgent: ["เร่งด่วน", "bg-orange-100 text-orange-700"],
        normal: ["ปกติ", "bg-slate-100 text-slate-600"],
    }[value] || ["ปกติ", "bg-slate-100 text-slate-600"];

    return (
        <span className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${config[1]}`}>
            {ui(config[0])}
        </span>
    );
}

function CompactSeverity({ severity, ui }) {
    const value = String(severity || "").trim().toLowerCase();
    const labels = {
        mild: "เล็กน้อย",
        moderate: "ปานกลาง",
        severe: "รุนแรง",
        critical: "วิกฤต",
    };
    const styles = {
        mild: "bg-emerald-100 text-emerald-700",
        moderate: "bg-amber-100 text-amber-700",
        severe: "bg-orange-100 text-orange-700",
        critical: "bg-red-600 text-white",
    };

    return (
        <span className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${styles[value] || "bg-slate-100 text-slate-600"}`}>
            {ui(labels[value] || severity)}
        </span>
    );
}

function CompactItems({ items, ui }) {
    if (!items.length) {
        return <span className="text-[11px] text-slate-400">-</span>;
    }

    const first = items[0];
    const firstText = `${ui(first.reliefItemName || first.name || "ไม่ระบุรายการ")} ${first.quantity || 0} ${ui(first.unit || "")}`;

    return (
        <>
            <span className="max-w-[150px] truncate rounded-full bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-700" title={firstText}>
                {firstText}
            </span>
            {items.length > 1 ? (
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">
                    +{items.length - 1}
                </span>
            ) : null}
        </>
    );
}

function ReliefQuantitySummary({ items, ui }) {
    if (!items.length) {
        return <span className="text-xs text-slate-400">-</span>;
    }

    const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    return (
        <div className="text-xs text-slate-600">
            <p><strong className="text-slate-800">{items.length}</strong> {ui("รายการ")}</p>
            <p className="mt-1">{ui("รวมจำนวน")} <strong className="text-slate-800">{totalQuantity.toLocaleString()}</strong></p>
        </div>
    );
}

function getEffectiveDeathCount(request) {
    const direct = Number(request?.deathCount || 0);
    if (direct > 0) return direct;

    const rows = Array.isArray(request?.victimSeverityCounts)
        ? request.victimSeverityCounts
        : [];

    return rows.reduce((sum, row) => sum + Number(row?.deathCount || 0), 0);
}

function normalizeStatus(status) {
    return String(status || "").trim().toLowerCase();
}

function getStatusStyle(status) {
    const styles = {
        pending: {
            border: "border-orange-200",
            bar: "bg-orange-500",
            badge: "bg-orange-100 text-orange-700",
        },
        accepted: {
            border: "border-sky-200",
            bar: "bg-sky-500",
            badge: "bg-sky-100 text-sky-700",
        },
        preparing: {
            border: "border-amber-200",
            bar: "bg-amber-500",
            badge: "bg-amber-100 text-amber-700",
        },
        delivering: {
            border: "border-blue-200",
            bar: "bg-blue-600",
            badge: "bg-blue-100 text-blue-700",
        },
        completed: {
            border: "border-emerald-200",
            bar: "bg-emerald-500",
            badge: "bg-emerald-100 text-emerald-700",
        },
        cancelled: {
            border: "border-slate-200",
            bar: "bg-slate-400",
            badge: "bg-slate-100 text-slate-600",
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
        rejected: "ปฏิเสธ",
    };

    return labels[status] || status || "ไม่ระบุ";
}

function isEmergencyRequest(request) {
    return String(request?.requestType || "Relief").trim().toLowerCase() === "emergency";
}

function getRequestTitle(request) {
    if (isEmergencyRequest(request)) {
        const labels = {
            Evacuation: "SOS: ต้องการอพยพ",
            Trapped: "SOS: ติดอยู่ในพื้นที่น้ำท่วม",
            Injured: "SOS: มีผู้บาดเจ็บ",
            Medical: "SOS: ผู้ป่วยฉุกเฉิน",
            RoofTrapped: "SOS: ติดอยู่บนอาคาร/หลังคา",
            RapidFlood: "SOS: น้ำเพิ่มระดับอย่างรวดเร็ว",
            Other: "SOS: เหตุฉุกเฉินอื่น ๆ",
        };
        return labels[request.emergencyType] || "SOS ฉุกเฉิน";
    }

    const items = Array.isArray(request.items) ? request.items : [];

    if (items.length === 0) {
        return "คำขอความช่วยเหลือ";
    }

    if (items.length === 1) {
        return items[0].reliefItemName || items[0].name || "คำขอความช่วยเหลือ";
    }

    return `ขอความช่วยเหลือ ${items.length} รายการ`;
}

function getWaitInfo(value) {
    const createdAt = new Date(value || 0);

    if (Number.isNaN(createdAt.getTime())) {
        return { hours: 0, days: 0 };
    }

    const diffMs = Math.max(0, Date.now() - createdAt.getTime());
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    return { hours, days };
}

function formatLongWait(waitInfo) {
    if (waitInfo.days >= 1) {
        return `รอนาน ${waitInfo.days} วัน`;
    }

    return `รอนาน ${Math.max(waitInfo.hours, 1)} ชม.`;
}

function formatDateTime(value, language) {
    if (!value) {
        return "ไม่ระบุเวลา";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "ไม่ระบุเวลา";
    }

    return date.toLocaleString(language === "en" ? "en-US" : "th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
