"use client";

import {
    formatCrisisCaseStatus,
    getCrisisCaseDetailPresentation,
} from "./crisisCaseDetailState.mjs";

export default function CrisisCaseModal({
    caseItem,
    loading,
    onClose,
    onAccept,
    accepting,
}) {
    if (!caseItem) return null;

    const presentation = getCrisisCaseDetailPresentation(caseItem);
    const items = Array.isArray(caseItem.items) ? caseItem.items : [];
    const canAccept = !caseItem.assignedStaffId &&
        String(caseItem.status || "Pending").toLowerCase() === "pending";

    const maps =
        caseItem.latitude && caseItem.longitude
            ? `https://www.google.com/maps/dir/?api=1&destination=${caseItem.latitude},${caseItem.longitude}`
            : null;

    return (
        <div className="absolute right-4 top-4 z-[700] flex max-h-[calc(100%-2rem)] w-[460px] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
            <div
                className={`flex shrink-0 items-start justify-between border-b p-5 ${
                    presentation.isEmergency ? "bg-red-50" : "bg-sky-50"
                }`}
            >
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h2
                            className={`text-xl font-black ${
                                presentation.isEmergency
                                    ? "text-red-700"
                                    : "text-sky-700"
                            }`}
                        >
                            {presentation.typeLabel} #{caseItem.id}
                        </h2>

                        {presentation.isEmergency ? (
                            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                                วิกฤต
                            </span>
                        ) : (
                            <span className="rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white">
                                ขอรับของ
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs font-semibold text-slate-500">
                        {formatCrisisCaseStatus(caseItem.status)}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
                    aria-label="ปิดรายละเอียดเคส"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
                {loading ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                        <span
                            className={`material-symbols-outlined animate-spin text-4xl ${
                                presentation.isEmergency
                                    ? "text-red-500"
                                    : "text-sky-500"
                            }`}
                        >
                            progress_activity
                        </span>
                        <p className="mt-3 text-sm font-bold text-slate-500">
                            กำลังโหลดรายละเอียดเคส...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <Section title="ข้อมูลผู้ขอความช่วยเหลือ" icon="person">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Info label="ชื่อ" value={caseItem.userName} />
                                <Info label="เบอร์โทร" value={caseItem.phone} />
                            </div>
                        </Section>

                        {presentation.showEmergencyInfo && (
                            <Section title="รายละเอียดเหตุฉุกเฉิน" icon="emergency">
                                <div className="space-y-3">
                                    <Info
                                        label="ประเภทเหตุฉุกเฉิน"
                                        value={caseItem.emergencyType || "ไม่ระบุ"}
                                        accent="red"
                                    />
                                    <Info
                                        label="รายละเอียด"
                                        value={caseItem.emergencyDetail || "ไม่ระบุ"}
                                        accent="red"
                                    />

                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        <Stat label="ผู้ประสบภัย" value={caseItem.victimCount} />
                                        <Stat label="เด็ก" value={caseItem.childCount} />
                                        <Stat label="ผู้สูงอายุ" value={caseItem.elderlyCount} />
                                        <Stat label="ผู้พิการ" value={caseItem.disabledCount} />
                                        <Stat label="ผู้ป่วย" value={caseItem.patientCount} />
                                        {caseItem.waterLevel !== null &&
                                            caseItem.waterLevel !== undefined && (
                                                <Stat
                                                    label="ระดับน้ำ"
                                                    value={`${caseItem.waterLevel} ม.`}
                                                />
                                            )}
                                    </div>
                                </div>
                            </Section>
                        )}

                        {presentation.showItems && (
                            <Section title="รายการสิ่งของที่ขอ" icon="inventory_2">
                                {items.length === 0 ? (
                                    <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-400">
                                        ไม่พบรายการสิ่งของในคำขอนี้
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {items.map((item, index) => (
                                            <div
                                                key={
                                                    item.id ||
                                                    `${item.reliefItemId || "item"}-${index}`
                                                }
                                                className="flex items-center justify-between gap-4 rounded-xl border border-sky-100 bg-sky-50/70 p-3"
                                            >
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-800">
                                                        {item.reliefItemName ||
                                                            item.name ||
                                                            "ไม่ระบุรายการ"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        รหัส {item.reliefItemId || "-"}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <p className="text-lg font-black text-sky-700">
                                                        {item.quantity ?? 0}
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-500">
                                                        {item.unit || "ชิ้น"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Section>
                        )}

                        <Section title="สถานที่และการติดต่อ" icon="location_on">
                            <div className="space-y-3">
                                <Info label="สถานที่" value={caseItem.address} />
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Info
                                        label="Latitude"
                                        value={formatCoordinate(caseItem.latitude)}
                                    />
                                    <Info
                                        label="Longitude"
                                        value={formatCoordinate(caseItem.longitude)}
                                    />
                                </div>
                            </div>
                        </Section>

                        {(caseItem.remark || caseItem.staffRemark) && (
                            <Section title="หมายเหตุ" icon="notes">
                                <div className="space-y-3">
                                    {caseItem.remark && (
                                        <Info
                                            label="จากผู้แจ้ง"
                                            value={caseItem.remark}
                                        />
                                    )}
                                    {caseItem.staffRemark && (
                                        <Info
                                            label="จากเจ้าหน้าที่"
                                            value={caseItem.staffRemark}
                                        />
                                    )}
                                </div>
                            </Section>
                        )}

                        <Section title="ข้อมูลการดำเนินงาน" icon="assignment_ind">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Info
                                    label="ศูนย์"
                                    value={caseItem.centerName || "ยังไม่ระบุศูนย์"}
                                />
                                <Info
                                    label="เจ้าหน้าที่รับผิดชอบ"
                                    value={caseItem.assignedStaffName || "ยังไม่มีผู้รับงาน"}
                                />
                                <Info
                                    label="สถานะ"
                                    value={formatCrisisCaseStatus(caseItem.status)}
                                />
                                <Info
                                    label="เวลาแจ้ง"
                                    value={formatDateTime(caseItem.createdAt)}
                                />
                            </div>
                        </Section>
                    </div>
                )}
            </div>

            {!loading && (
                <div className="grid shrink-0 grid-cols-2 gap-3 border-t bg-white p-4">
                    {maps ? (
                        <a
                            href={maps}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            <span className="material-symbols-outlined text-lg">
                                near_me
                            </span>
                            นำทาง
                        </a>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-300"
                        >
                            ไม่มีพิกัด
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => onAccept(caseItem)}
                        disabled={accepting || !canAccept}
                        className={`rounded-xl px-4 py-3 font-bold text-white transition disabled:bg-slate-300 ${
                            presentation.isEmergency
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-sky-600 hover:bg-sky-700"
                        }`}
                    >
                        {caseItem.assignedStaffId
                            ? "รับงานแล้ว"
                            : !canAccept
                              ? formatCrisisCaseStatus(caseItem.status)
                              : accepting
                                ? "กำลังรับงาน..."
                                : presentation.isEmergency
                                  ? "รับเคสทันที"
                                  : "รับคำขอนี้"}
                    </button>
                </div>
            )}
        </div>
    );
}

function Section({ title, icon, children }) {
    return (
        <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
                <span className="material-symbols-outlined text-lg text-slate-400">
                    {icon}
                </span>
                {title}
            </h3>
            {children}
        </section>
    );
}

function Info({ label, value, accent }) {
    return (
        <div
            className={`rounded-xl border p-3 ${
                accent === "red"
                    ? "border-red-100 bg-red-50/70"
                    : "border-slate-100 bg-slate-50"
            }`}
        >
            <p className="text-[11px] font-bold text-slate-400">{label}</p>
            <p className="mt-1 break-words text-sm font-bold text-slate-700">
                {value === undefined || value === null || value === "" ? "-" : value}
            </p>
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div className="rounded-xl border border-red-100 bg-white p-3 text-center">
            <p className="text-lg font-black text-red-700">{value ?? 0}</p>
            <p className="mt-0.5 text-[10px] font-bold text-slate-500">{label}</p>
        </div>
    );
}

function formatCoordinate(value) {
    const number = Number(value);
    return Number.isFinite(number) && number !== 0 ? number.toFixed(6) : "-";
}

function formatDateTime(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}
