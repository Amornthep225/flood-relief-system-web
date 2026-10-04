"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import LocationPicker from "@/components/user/SosForm/LocationPicker";
import FormSectionTitle from "@/components/user/SosForm/FormSectionTitle";
import { useLanguage } from "@/contexts/LanguageContext";

import {
    createEmergencySosRequest,
    getEmergencyTypes,
} from "@/services/user/sos";

const initialLocation = {
    latitude: null,
    longitude: null,
    addressDetail: "",
};

// ======================================================
// จำนวนผู้ประสบภัย แยกตามระดับความรุนแรง
// ผู้เสียชีวิตจะไม่เก็บแยกตามระดับ
// deathCount ในแต่ละ row คงไว้เป็น 0 เพื่อรองรับ Backend DTO เดิม
// ======================================================

const emptySeverityCounts = () => ({
    Mild: {
        childCount: 0,
        adultCount: 0,
        elderlyCount: 0,
        disabledCount: 0,
        patientCount: 0,
        deathCount: 0,
    },

    Moderate: {
        childCount: 0,
        adultCount: 0,
        elderlyCount: 0,
        disabledCount: 0,
        patientCount: 0,
        deathCount: 0,
    },

    Severe: {
        childCount: 0,
        adultCount: 0,
        elderlyCount: 0,
        disabledCount: 0,
        patientCount: 0,
        deathCount: 0,
    },

    Critical: {
        childCount: 0,
        adultCount: 0,
        elderlyCount: 0,
        disabledCount: 0,
        patientCount: 0,
        deathCount: 0,
    },
});

const initialForm = {
    emergencyType: "",

    victimSeverityCounts: emptySeverityCounts(),

    // ผู้เสียชีวิตรวม
    // ไม่แยกตามระดับความรุนแรง
    deathCount: 0,

    waterLevel: "",

    emergencyDetail: "",
};

// ======================================================
// ระดับความรุนแรง
// ======================================================

const severityOptions = [
    {
        value: "Mild",
        icon: "sentiment_satisfied",
        labelTh: "เล็กน้อย",
        labelEn: "Mild",
    },

    {
        value: "Moderate",
        icon: "warning",
        labelTh: "ปานกลาง",
        labelEn: "Moderate",
    },

    {
        value: "Severe",
        icon: "personal_injury",
        labelTh: "รุนแรง",
        labelEn: "Severe",
    },

    {
        value: "Critical",
        icon: "emergency",
        labelTh: "วิกฤต",
        labelEn: "Critical",
    },
];

// ======================================================
// ช่องในตารางความรุนแรง
// ไม่มี "เสียชีวิต"
// ======================================================

const severityFields = [
    {
        key: "childCount",
        labelTh: "เด็ก",
        labelEn: "Children",
    },

    {
        key: "adultCount",
        labelTh: "ผู้ใหญ่",
        labelEn: "Adults",
    },

    {
        key: "elderlyCount",
        labelTh: "ผู้สูงอายุ",
        labelEn: "Elderly",
    },

    {
        key: "disabledCount",
        labelTh: "ผู้พิการ",
        labelEn: "Disabled",
    },

    {
        key: "patientCount",
        labelTh: "บาดเจ็บ / ผู้ป่วย",
        labelEn: "Injured / patients",
    },
];

export default function EmergencySosForm() {
    const router = useRouter();

    const { language, dictionary, t } = useLanguage();

    const [location, setLocation] = useState(initialLocation);

    const [form, setForm] = useState(initialForm);

    const [emergencyTypes, setEmergencyTypes] = useState([]);

    const [loadingTypes, setLoadingTypes] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    // ======================================================
    // โหลดประเภท SOS จาก Backend
    // ======================================================

    useEffect(() => {
        let active = true;

        const loadEmergencyTypes = async () => {
            try {
                setLoadingTypes(true);

                const response = await getEmergencyTypes();

                const list = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response?.items)
                            ? response.items
                            : [];

                if (active) {
                    setEmergencyTypes(list);
                }
            } catch (error) {
                if (!active) {
                    return;
                }

                setEmergencyTypes([]);

                await Swal.fire({
                    icon: "error",

                    title: t("sos.emergency.loadTypeErrorTitle"),

                    text: error?.message || t("sos.emergency.loadTypeErrorText"),
                });
            } finally {
                if (active) {
                    setLoadingTypes(false);
                }
            }
        };

        loadEmergencyTypes();

        return () => {
            active = false;
        };
    }, []);

    // ======================================================
    // รวม option + จำนวนผู้ประสบภัย
    // ======================================================

    const severityRows = severityOptions.map((option) => ({
        ...option,

        ...(form.victimSeverityCounts?.[option.value] || {}),
    }));

    // ======================================================
    // รวมจำนวนผู้ประสบภัยแต่ละประเภท
    // ไม่รวมผู้เสียชีวิต
    // ======================================================

    const aggregateVictimCounts = severityRows.reduce(
        (totals, row) => {
            severityFields.forEach((field) => {
                totals[field.key] += Number(row[field.key] || 0);
            });

            return totals;
        },
        {
            childCount: 0,

            adultCount: 0,

            elderlyCount: 0,

            disabledCount: 0,

            patientCount: 0,
        }
    );

    // ======================================================
    // จำนวนผู้ประสบภัยรวม
    // ไม่รวมผู้เสียชีวิต
    // ======================================================

    const victimCount = Object.values(aggregateVictimCounts).reduce(
        (sum, value) => sum + Number(value || 0),
        0
    );

    // ======================================================
    // ผู้เสียชีวิตรวม
    // ======================================================

    const deathCount = Number(form.deathCount || 0);

    // ======================================================
    // ลำดับความรุนแรง
    // ======================================================

    const severityRank = {
        Mild: 1,

        Moderate: 2,

        Severe: 3,

        Critical: 4,
    };

    // ======================================================
    // หาความรุนแรงสูงสุดจากผู้ประสบภัย
    //
    // ผู้เสียชีวิตไม่อยู่ในระดับความรุนแรงรายบุคคล
    // แต่ถ้ามีผู้เสียชีวิตและไม่มีข้อมูลผู้รอดชีวิตเลย
    // ให้เคสเป็น Critical เพื่อไม่ให้เคสถูกจัดเป็น Mild
    // ======================================================

    const highestLivingSeverity = severityRows
        .filter((row) =>
            severityFields.some((field) => Number(row[field.key] || 0) > 0)
        )
        .sort((a, b) => severityRank[b.value] - severityRank[a.value])[0]?.value;

    const highestSeverity =
        highestLivingSeverity || (deathCount > 0 ? "Critical" : "Mild");

    // ======================================================
    // เปลี่ยนจำนวนใน Matrix
    // ======================================================

    const setSeverityNumber = (severity, name, value) => {
        const number = Number(value);

        const safeValue = Number.isFinite(number)
            ? Math.max(0, Math.floor(number))
            : 0;

        setForm((previous) => ({
            ...previous,

            victimSeverityCounts: {
                ...previous.victimSeverityCounts,

                [severity]: {
                    ...previous.victimSeverityCounts[severity],

                    [name]: safeValue,
                },
            },
        }));
    };

    // ======================================================
    // เปลี่ยนจำนวนผู้เสียชีวิต
    // ======================================================

    const setDeathNumber = (value) => {
        const number = Number(value);

        const safeValue = Number.isFinite(number)
            ? Math.max(0, Math.floor(number))
            : 0;

        setForm((previous) => ({
            ...previous,

            deathCount: safeValue,
        }));
    };

    // ======================================================
    // Validation
    // ======================================================

    const validate = async () => {
        /*
         * ต้องมีอย่างน้อย:
         * - ผู้ประสบภัย 1 คน
         * หรือ
         * - ผู้เสียชีวิต 1 คน
         */

        if (victimCount < 1 && deathCount < 1) {
            await Swal.fire({
                icon: "warning",

                title: t("sos.emergency.victimWarningTitle"),

                text: t("sos.emergency.victimWarningText"),
            });

            return false;
        }

        if (!form.emergencyDetail.trim()) {
            await Swal.fire({
                icon: "warning",

                title: t("sos.emergency.detailWarningTitle"),

                text: t("sos.emergency.detailWarningText"),
            });

            return false;
        }

        return true;
    };

    // ======================================================
    // ส่ง SOS
    // ======================================================

    const handleSubmit = async () => {
        if (submitting || !(await validate())) {
            return;
        }

        const confirm = await Swal.fire({
            icon: "warning",

            title: t("sos.emergency.confirmTitle"),

            text: t("sos.emergency.confirmText"),

            showCancelButton: true,

            confirmButtonText: t("sos.emergency.confirmButton"),

            cancelButtonText: t("sos.emergency.reviewButton"),

            confirmButtonColor: "#ef4444",
        });

        if (!confirm.isConfirmed) {
            return;
        }

        try {
            setSubmitting(true);

            const response = await createEmergencySosRequest({
                latitude: Number(location.latitude),

                longitude: Number(location.longitude),

                addressDetail: location.addressDetail.trim(),

                emergencyType: form.emergencyType,

                /*
                 * จำนวนผู้ประสบภัย
                 * ไม่รวมผู้เสียชีวิต
                 */
                victimCount,

                childCount: aggregateVictimCounts.childCount,

                elderlyCount: aggregateVictimCounts.elderlyCount,

                disabledCount: aggregateVictimCounts.disabledCount,

                patientCount: aggregateVictimCounts.patientCount,

                /*
                 * ผู้เสียชีวิตรวม
                 * อยู่แยกจากระดับความรุนแรง
                 */
                deathCount,

                severity: highestSeverity,

                /*
                 * ข้อมูลแยกระดับ
                 * deathCount = 0 ทุกระดับ
                 */
                victimSeverityCounts: severityRows.map((row) => ({
                    severity: row.value,

                    childCount: Number(row.childCount || 0),

                    adultCount: Number(row.adultCount || 0),

                    elderlyCount: Number(row.elderlyCount || 0),

                    disabledCount: Number(row.disabledCount || 0),

                    patientCount: Number(row.patientCount || 0),

                    deathCount: 0,
                })),

                waterLevel: form.waterLevel === "" ? null : Number(form.waterLevel),

                emergencyDetail: form.emergencyDetail.trim(),
            });

            await Swal.fire({
                icon: "success",

                title: t("sos.emergency.successTitle"),

                text: t("sos.emergency.caseId", {
                    id: response?.sosRequestId ?? "-",
                }),

                timer: 1400,

                showConfirmButton: false,
            });

            router.push(
                `/user/sos-success?id=${encodeURIComponent(response.sosRequestId)}`
            );
        } catch (error) {
            await Swal.fire({
                icon: "error",

                title: t("sos.emergency.failedTitle"),

                text:
                    error?.message ||
                    t("sos.emergency.genericError") ||
                    "กรุณากรอกข้อมูลให้ครบถ้วน",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl py-4">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-red-500">
                    <span className="material-symbols-outlined text-5xl">sos</span>
                </div>

                <h1 className="text-3xl font-black text-slate-800">
                    {t("sos.emergency.title")}
                </h1>

                <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                    {t("sos.emergency.subtitle")}
                </p>
            </div>

            <div className="space-y-8 rounded-3xl border border-red-100 bg-white p-4 shadow-xl shadow-red-100/40 sm:p-6 md:p-10">
                {/* ==================================================
                    1. ประเภท SOS
                ================================================== */}

                <section className="space-y-5">
                    <FormSectionTitle
                        number="1"
                        title={t("sos.emergency.typeTitle")}
                        description={t("sos.emergency.typeDescription")}
                    />

                    {loadingTypes ? (
                        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                            <div className="text-center">
                                <span className="material-symbols-outlined animate-spin text-4xl text-red-500">
                                    progress_activity
                                </span>

                                <p className="mt-2 text-sm font-bold text-slate-500">
                                    {t("sos.emergency.loadingTypes")}
                                </p>
                            </div>
                        </div>
                    ) : emergencyTypes.length === 0 ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                            <p className="font-bold text-red-600">
                                {t("sos.emergency.noTypes")}
                            </p>

                            <p className="mt-1 text-sm text-red-400">
                                {t("sos.emergency.reload")}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {emergencyTypes.map((item) => {
                                const active = form.emergencyType === item.value;

                                const translatedType =
                                    dictionary?.sos?.emergency?.typeLabels?.[item.value];

                                const displayLabel =
                                    language === "en" && translatedType?.label
                                        ? translatedType.label
                                        : item.label;

                                const displayDescription =
                                    language === "en" && translatedType?.description
                                        ? translatedType.description
                                        : item.description;

                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() =>
                                            setForm((previous) => ({
                                                ...previous,

                                                emergencyType: item.value,
                                            }))
                                        }
                                        className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${active
                                                ? "border-red-400 bg-red-50 ring-2 ring-red-100"
                                                : "border-slate-200 hover:border-red-200 hover:bg-red-50/40"
                                            }`}
                                    >
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${active
                                                    ? "bg-red-500 text-white"
                                                    : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">
                                                {item.icon || "sos"}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="font-black text-slate-800">
                                                {displayLabel}
                                            </p>

                                            <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                                {displayDescription}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* ==================================================
                    2. ตำแหน่ง
                ================================================== */}

                <section className="space-y-5">
                    <FormSectionTitle
                        number="2"
                        title={t("sos.emergency.locationTitle")}
                        description={t("sos.emergency.locationDescription")}
                    />

                    <LocationPicker location={location} onLocationChange={setLocation} />
                </section>

                {/* ==================================================
                    3. ผู้ประสบภัย
                ================================================== */}

                <section className="space-y-5">
                    <FormSectionTitle
                        number="3"
                        title={t("sos.emergency.victimsTitle")}
                        description={t("sos.emergency.victimsDescription")}
                    />

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                        {/* ------------------------------------------
                            หัวข้อ
                        ------------------------------------------ */}

                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-black text-slate-800">
                                    {language === "en"
                                        ? "Victims by severity level"
                                        : "จำนวนผู้ประสบภัยแยกตามระดับความรุนแรง"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {language === "en"
                                        ? "Enter the number of victims in each group and severity level."
                                        : "ระบุจำนวนแต่ละกลุ่มในแต่ละระดับ เช่น เล็กน้อยมีเด็ก 2 คน ปานกลางมีผู้ใหญ่ 1 คน"}
                                </p>
                            </div>

                            {/* จำนวนผู้ประสบภัยรวม */}

                            <div className="rounded-xl bg-white px-4 py-2 text-right shadow-sm ring-1 ring-slate-200">
                                <p className="text-[11px] font-bold text-slate-400">
                                    {language === "en" ? "Total victims" : "ผู้ประสบภัยรวม"}
                                </p>

                                <p className="text-xl font-black text-slate-800">
                                    {victimCount}

                                    <span className="ml-1 text-xs font-bold text-slate-400">
                                        {language === "en" ? "people" : "คน"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* ==================================================
                            DESKTOP / TABLET TABLE
                        ================================================== */}

                        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
                            {/* Header */}

                            <div className="grid grid-cols-[150px_repeat(5,minmax(92px,1fr))] bg-slate-100 text-xs font-black text-slate-600">
                                <div className="p-3">
                                    {language === "en" ? "Severity" : "ระดับ"}
                                </div>

                                {severityFields.map((field) => (
                                    <div key={field.key} className="p-3 text-center">
                                        {language === "en" ? field.labelEn : field.labelTh}
                                    </div>
                                ))}
                            </div>

                            {/* Rows */}

                            {severityOptions.map((option) => {
                                const row = form.victimSeverityCounts[option.value];

                                const rowTotal = severityFields.reduce(
                                    (sum, field) => sum + Number(row?.[field.key] || 0),
                                    0
                                );

                                return (
                                    <div
                                        key={option.value}
                                        className="grid grid-cols-[150px_repeat(5,minmax(92px,1fr))] items-center border-t border-slate-100"
                                    >
                                        {/* ชื่อระดับ */}

                                        <div className="p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400">
                                                    {option.icon}
                                                </span>

                                                <div>
                                                    <p className="text-sm font-black text-slate-800">
                                                        {language === "en"
                                                            ? option.labelEn
                                                            : option.labelTh}
                                                    </p>

                                                    <p className="text-[10px] font-bold text-slate-400">
                                                        {language === "en"
                                                            ? `Total ${rowTotal}`
                                                            : `รวม ${rowTotal} คน`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Inputs */}

                                        {severityFields.map((field) => (
                                            <div key={field.key} className="p-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    inputMode="numeric"
                                                    value={row?.[field.key] ?? 0}
                                                    onFocus={(event) => event.target.select()}
                                                    onChange={(event) =>
                                                        setSeverityNumber(
                                                            option.value,
                                                            field.key,
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-center text-base font-black text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>

                        {/* ==================================================
                            MOBILE
                        ================================================== */}

                        <div className="mt-4 space-y-3 md:hidden">
                            {severityOptions.map((option) => {
                                const row = form.victimSeverityCounts[option.value];

                                const rowTotal = severityFields.reduce(
                                    (sum, field) => sum + Number(row?.[field.key] || 0),
                                    0
                                );

                                return (
                                    <div
                                        key={option.value}
                                        className="rounded-2xl border border-slate-200 bg-white p-3"
                                    >
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400">
                                                    {option.icon}
                                                </span>

                                                <p className="font-black text-slate-800">
                                                    {language === "en" ? option.labelEn : option.labelTh}
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                                                {language === "en"
                                                    ? `Total ${rowTotal}`
                                                    : `รวม ${rowTotal} คน`}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {severityFields.map((field) => (
                                                <label
                                                    key={field.key}
                                                    className="rounded-xl border border-slate-100 bg-slate-50 p-2"
                                                >
                                                    <span className="block text-[11px] font-bold text-slate-500">
                                                        {language === "en" ? field.labelEn : field.labelTh}
                                                    </span>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        inputMode="numeric"
                                                        value={row?.[field.key] ?? 0}
                                                        onFocus={(event) => event.target.select()}
                                                        onChange={(event) =>
                                                            setSeverityNumber(
                                                                option.value,
                                                                field.key,
                                                                event.target.value
                                                            )
                                                        }
                                                        className="mt-1 w-full bg-transparent text-xl font-black text-slate-800 outline-none"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ==================================================
                            SUMMARY ความรุนแรง
                        ================================================== */}

                        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                            {severityOptions.map((option) => {
                                const row = form.victimSeverityCounts[option.value];

                                const count = severityFields.reduce(
                                    (sum, field) => sum + Number(row?.[field.key] || 0),
                                    0
                                );

                                return (
                                    <div
                                        key={option.value}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                                    >
                                        <p className="text-[11px] font-bold text-slate-400">
                                            {language === "en" ? option.labelEn : option.labelTh}
                                        </p>

                                        <p className="mt-0.5 font-black text-slate-800">
                                            {count} {language === "en" ? "people" : "คน"}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ==================================================
                            ผู้เสียชีวิต
                            ไม่แยกระดับความรุนแรง
                        ================================================== */}

                        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                {/* Left */}

                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                        <span className="material-symbols-outlined text-2xl">
                                            deceased
                                        </span>
                                    </div>

                                    <div>
                                        <p className="font-black text-red-700">
                                            {language === "en" ? "Deceased" : "ผู้เสียชีวิต"}
                                        </p>

                                        <p className="mt-1 text-xs text-red-500">
                                            {language === "en"
                                                ? "Enter the total number of deceased persons."
                                                : "ระบุจำนวนผู้เสียชีวิตทั้งหมด โดยไม่แยกระดับความรุนแรง"}
                                        </p>
                                    </div>
                                </div>

                                {/* Input */}

                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="0"
                                        inputMode="numeric"
                                        value={form.deathCount}
                                        onFocus={(event) => event.target.select()}
                                        onChange={(event) => setDeathNumber(event.target.value)}
                                        className="w-32 rounded-xl border border-red-200 bg-white px-3 py-3 text-center text-2xl font-black text-red-700 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    />

                                    <span className="font-bold text-red-600">
                                        {language === "en" ? "people" : "คน"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ==================================================
                            Overall Severity
                        ================================================== */}

                        <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs leading-relaxed text-sky-700">
                            {language === "en"
                                ? `Overall case severity is calculated automatically from the highest victim severity entered: ${highestSeverity}.`
                                : `ระบบจะกำหนดความรุนแรงรวมของเคสอัตโนมัติจากระดับสูงสุดของผู้ประสบภัยที่กรอก: ${severityOptions.find(
                                    (item) => item.value === highestSeverity
                                )?.labelTh || "เล็กน้อย"
                                }`}
                        </div>
                    </div>

                    {/* ==================================================
                        ระดับน้ำ
                    ================================================== */}

                    <div className="max-w-sm">
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            {t("sos.emergency.waterLevel")}
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            value={form.waterLevel}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,

                                    waterLevel: event.target.value,
                                }))
                            }
                            placeholder={t("sos.emergency.waterPlaceholder")}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        />
                    </div>
                </section>

                {/* ==================================================
                    4. รายละเอียดเหตุฉุกเฉิน
                ================================================== */}

                <section className="space-y-5">
                    <FormSectionTitle
                        number="4"
                        title={t("sos.emergency.detailTitle")}
                        description={t("sos.emergency.detailDescription")}
                    />

                    <textarea
                        rows={5}
                        value={form.emergencyDetail}
                        onChange={(event) =>
                            setForm((previous) => ({
                                ...previous,

                                emergencyDetail: event.target.value,
                            }))
                        }
                        placeholder={t("sos.emergency.detailPlaceholder")}
                        className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                </section>

                {/* ==================================================
                    INFO
                ================================================== */}

                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined">info</span>

                        <p>
                            {t("sos.emergency.criticalPrefix")}

                            <strong className="mx-1">
                                {t("sos.emergency.criticalLabel")}
                            </strong>

                            {t("sos.emergency.criticalSuffix")}
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <button
                    type="button"
                    disabled={submitting || loadingTypes}
                    onClick={handleSubmit}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 px-4 py-4 text-lg font-black text-white shadow-lg shadow-red-200 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
                >
                    <span
                        className={`material-symbols-outlined ${submitting ? "animate-spin" : ""
                            }`}
                    >
                        {submitting ? "progress_activity" : "sos"}
                    </span>

                    {submitting ? t("sos.emergency.sending") : t("sos.emergency.submit")}
                </button>
            </div>
        </div>
    );
}
