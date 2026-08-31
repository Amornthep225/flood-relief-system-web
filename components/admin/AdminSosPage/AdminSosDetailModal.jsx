"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

import AdminSosPriorityBadge from "./AdminSosPriorityBadge";
import AdminSosStatusBadge from "./AdminSosStatusBadge";

function formatDate(value, language) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat(
        language === "en" ? "en-US" : "th-TH",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(date);
}

function getEmergencyTypeLabel(type, language) {
    const labels = {
        Evacuation: {
            th: "ต้องการอพยพ",
            en: "Evacuation needed",
        },
        Trapped: {
            th: "ติดอยู่ในพื้นที่น้ำท่วม",
            en: "Trapped in flooded area",
        },
        Injured: {
            th: "มีผู้บาดเจ็บ",
            en: "Injured person",
        },
        Medical: {
            th: "ผู้ป่วยฉุกเฉิน",
            en: "Medical emergency",
        },
        RoofTrapped: {
            th: "ติดอยู่บนอาคาร/หลังคา",
            en: "Trapped on building/roof",
        },
        RapidFlood: {
            th: "น้ำเพิ่มระดับอย่างรวดเร็ว",
            en: "Rapidly rising floodwater",
        },
        Other: {
            th: "เหตุฉุกเฉินอื่น ๆ",
            en: "Other emergency",
        },
    };

    return (
        labels[type]?.[language] ||
        labels[type]?.th ||
        type ||
        "-"
    );
}

export default function AdminSosDetailModal({
    caseItem,
    onClose,
}) {
    const { ui, language } = useNativeUi();

    if (!caseItem) {
        return null;
    }

    const tx = (th, en) =>
        language === "en" ? en : th;

    const isEmergency =
        String(caseItem.requestType || "Relief")
            .trim()
            .toLowerCase() === "emergency";

    const items = Array.isArray(caseItem.items)
        ? caseItem.items
        : [];

    const mapsUrl =
        caseItem.latitude &&
        caseItem.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${caseItem.latitude},${caseItem.longitude}`
            : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white p-5">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-black text-slate-800">
                                {isEmergency
                                    ? tx(
                                          "รายละเอียด SOS ฉุกเฉิน",
                                          "Emergency SOS Details"
                                      )
                                    : tx(
                                          "รายละเอียดคำขอรับสิ่งของ",
                                          "Relief Request Details"
                                      )}
                            </h2>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-black ${
                                    isEmergency
                                        ? "bg-red-100 text-red-700"
                                        : "bg-sky-100 text-sky-700"
                                }`}
                            >
                                {isEmergency
                                    ? tx(
                                          "SOS ฉุกเฉิน",
                                          "Emergency SOS"
                                      )
                                    : tx(
                                          "ขอรับสิ่งของ",
                                          "Relief Request"
                                      )}
                            </span>
                        </div>

                        <p className="mt-1 font-mono text-sm text-slate-500">
                            CASE #{caseItem.id}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <AdminSosPriorityBadge
                            priority={
                                isEmergency
                                    ? "Critical"
                                    : caseItem.priority
                            }
                        />
                        <AdminSosStatusBadge
                            status={caseItem.status}
                        />
                    </div>
                </div>

                <div className="space-y-5 p-6">
                    <Section
                        title={tx(
                            "ข้อมูลผู้แจ้ง",
                            "Requester Information"
                        )}
                    >
                        <Info
                            label={tx("ชื่อ", "Name")}
                            value={caseItem.name}
                        />
                        <Info
                            label={tx(
                                "เบอร์ติดต่อ",
                                "Phone"
                            )}
                            value={caseItem.phone}
                        />
                        <Info
                            label={tx("อีเมล", "Email")}
                            value={caseItem.email || "-"}
                        />
                        <Info
                            label={tx(
                                "วันที่แจ้ง",
                                "Reported At"
                            )}
                            value={formatDate(
                                caseItem.createdAt,
                                language
                            )}
                        />
                    </Section>

                    {isEmergency ? (
                        <>
                            <Section
                                title={tx(
                                    "รายละเอียดเหตุฉุกเฉิน",
                                    "Emergency Details"
                                )}
                            >
                                <Info
                                    label={tx(
                                        "ประเภทเหตุฉุกเฉิน",
                                        "Emergency Type"
                                    )}
                                    value={getEmergencyTypeLabel(
                                        caseItem.emergencyType,
                                        language
                                    )}
                                />
                                <Info
                                    label={tx(
                                        "ระดับน้ำโดยประมาณ",
                                        "Approximate Water Level"
                                    )}
                                    value={
                                        caseItem.waterLevel !==
                                            null &&
                                        caseItem.waterLevel !==
                                            undefined
                                            ? `${caseItem.waterLevel} ${
                                                  language ===
                                                  "en"
                                                      ? "m"
                                                      : "ม."
                                              }`
                                            : "-"
                                    }
                                />
                            </Section>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                                <StatCard
                                    label={tx(
                                        "ผู้ประสบภัย",
                                        "Affected People"
                                    )}
                                    value={
                                        caseItem.victimCount ||
                                        0
                                    }
                                />
                                <StatCard
                                    label={tx(
                                        "เด็ก",
                                        "Children"
                                    )}
                                    value={
                                        caseItem.childCount ||
                                        0
                                    }
                                />
                                <StatCard
                                    label={tx(
                                        "ผู้สูงอายุ",
                                        "Elderly"
                                    )}
                                    value={
                                        caseItem.elderlyCount ||
                                        0
                                    }
                                />
                                <StatCard
                                    label={tx(
                                        "ผู้พิการ",
                                        "People with Disabilities"
                                    )}
                                    value={
                                        caseItem.disabledCount ||
                                        0
                                    }
                                />
                                <StatCard
                                    label={tx(
                                        "ผู้ป่วย",
                                        "Patients"
                                    )}
                                    value={
                                        caseItem.patientCount ||
                                        0
                                    }
                                />
                            </div>

                            {caseItem.emergencyDetail && (
                                <TextBlock
                                    title={tx(
                                        "รายละเอียดเพิ่มเติม",
                                        "Additional Emergency Details"
                                    )}
                                    value={
                                        caseItem.emergencyDetail
                                    }
                                />
                            )}
                        </>
                    ) : (
                        <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-black text-slate-800">
                                        {tx(
                                            "รายการสิ่งของที่ขอ",
                                            "Requested Relief Supplies"
                                        )}
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {tx(
                                            "ตรวจสอบรายการนี้ก่อนมอบหมายเจ้าหน้าที่",
                                            "Review these items before assigning staff"
                                        )}
                                    </p>
                                </div>

                                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-sky-700">
                                    {items.length}{" "}
                                    {tx(
                                        "รายการ",
                                        "items"
                                    )}
                                </span>
                            </div>

                            {items.length === 0 ? (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-700">
                                    {tx(
                                        "ไม่พบรายการสิ่งของในคำขอนี้",
                                        "No requested items were found in this request."
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {items.map(
                                        (item, index) => (
                                            <div
                                                key={
                                                    item.id ||
                                                    item.reliefItemId ||
                                                    index
                                                }
                                                className="flex items-center justify-between gap-4 rounded-xl border border-sky-100 bg-white px-4 py-3"
                                            >
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-800">
                                                        {ui(
                                                            item.reliefItemName
                                                        )}
                                                    </p>
                                                    <p className="mt-1 font-mono text-[11px] text-slate-400">
                                                        #
                                                        {item.reliefItemId ||
                                                            "-"}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <p className="text-lg font-black text-sky-600">
                                                        {
                                                            item.quantity
                                                        }
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-400">
                                                        {ui(
                                                            item.unit
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <Section
                        title={tx(
                            "สถานที่และศูนย์",
                            "Location & Center"
                        )}
                    >
                        <Info
                            label={tx("ที่อยู่", "Address")}
                            value={caseItem.address}
                        />
                        <Info
                            label={tx("ศูนย์", "Center")}
                            value={ui(
                                caseItem.centerName
                            )}
                        />
                        <Info
                            label={tx(
                                "พิกัด",
                                "Coordinates"
                            )}
                            value={
                                caseItem.latitude &&
                                caseItem.longitude
                                    ? `${caseItem.latitude}, ${caseItem.longitude}`
                                    : "-"
                            }
                        />
                        <Info
                            label={tx(
                                "ระดับความเร่งด่วน",
                                "Priority"
                            )}
                            value={ui(
                                caseItem.priority
                            )}
                        />
                    </Section>

                    {caseItem.userRemark && (
                        <TextBlock
                            title={tx(
                                "รายละเอียดจากผู้แจ้ง",
                                "Requester Note"
                            )}
                            value={caseItem.userRemark}
                        />
                    )}

                    <Section
                        title={tx(
                            "การมอบหมาย",
                            "Assignment"
                        )}
                    >
                        <Info
                            label={tx(
                                "เจ้าหน้าที่",
                                "Staff"
                            )}
                            value={
                                caseItem.assignedStaffName ||
                                tx(
                                    "ยังไม่มอบหมาย",
                                    "Not Assigned"
                                )
                            }
                        />
                        <Info
                            label="Staff ID"
                            value={
                                caseItem.assignedStaffId ||
                                "-"
                            }
                        />
                        <Info
                            label={tx(
                                "ศูนย์ที่รับผิดชอบ",
                                "Assigned Center"
                            )}
                            value={ui(
                                caseItem.centerName
                            )}
                        />
                        <Info
                            label={tx(
                                "เวลารับเรื่อง",
                                "Accepted At"
                            )}
                            value={formatDate(
                                caseItem.acceptedAt,
                                language
                            )}
                        />
                    </Section>

                    {caseItem.staffRemark && (
                        <TextBlock
                            title={tx(
                                "หมายเหตุเจ้าหน้าที่",
                                "Staff Note"
                            )}
                            value={caseItem.staffRemark}
                        />
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row">
                        {mapsUrl && (
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-bold text-slate-600 hover:text-sky-600"
                            >
                                <span className="material-symbols-outlined">
                                    map
                                </span>
                                {tx(
                                    "เปิด Google Maps",
                                    "Open Google Maps"
                                )}
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-slate-800 py-3 font-bold text-white"
                        >
                            {tx(
                                "ปิดหน้าต่าง",
                                "Close"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({
    title,
    children,
}) {
    return (
        <div className="rounded-xl border border-slate-100 p-4">
            <p className="mb-3 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {title}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {children}
            </div>
        </div>
    );
}

function Info({
    label,
    value,
}) {
    return (
        <div>
            <p className="text-xs text-slate-400">
                {label}
            </p>
            <p className="mt-1 break-words font-bold text-slate-700">
                {value || "-"}
            </p>
        </div>
    );
}

function TextBlock({
    title,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {title}
            </p>
            <p
                data-i18n-ignore="true"
                className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700"
            >
                {value}
            </p>
        </div>
    );
}

function StatCard({
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center">
            <p className="text-xs font-bold text-red-400">
                {label}
            </p>
            <p className="mt-1 text-2xl font-black text-red-600">
                {value}
            </p>
        </div>
    );
}
