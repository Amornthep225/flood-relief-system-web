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

const initialForm = {
    emergencyType: "",
    childCount: 0,
    elderlyCount: 0,
    disabledCount: 0,
    patientCount: 0,
    waterLevel: "",
    emergencyDetail: "",
};

export default function EmergencySosForm() {
    const router = useRouter();
    const { language, dictionary, t } = useLanguage();

    const [location, setLocation] = useState(initialLocation);

    const [form, setForm] = useState(initialForm);

    const [emergencyTypes, setEmergencyTypes] = useState([]);

    const [loadingTypes, setLoadingTypes] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    // ==========================================
    // โหลดประเภท SOS จาก Backend
    // ==========================================

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
    const victimCount =
        Number(form.childCount) +
        Number(form.elderlyCount) +
        Number(form.disabledCount) +
        Number(form.patientCount);
    // ==========================================
    // จำนวนคน
    // ==========================================

    const setNumber = (name, value, min = 0) => {
        const number = Number(value);

        setForm((previous) => ({
            ...previous,

            [name]: Number.isFinite(number) ? Math.max(min, Math.floor(number)) : min,
        }));
    };

    // ==========================================
    // Validation
    // ==========================================

    const validate = async () => {
        if (victimCount < 1) {
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

    // ==========================================
    // ส่ง SOS
    // ==========================================

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

                victimCount,

                childCount: Number(form.childCount),

                elderlyCount: Number(form.elderlyCount),

                disabledCount: Number(form.disabledCount),

                patientCount: Number(form.patientCount),

                waterLevel: form.waterLevel === "" ? null : Number(form.waterLevel),

                emergencyDetail: form.emergencyDetail.trim(),
            });

            await Swal.fire({
                icon: "success",
                title: t("sos.emergency.successTitle"),
                text: t("sos.emergency.caseId", { id: response?.sosRequestId ?? "-" }),
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
                text: error?.message || t("sos.emergency.genericError"),
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl py-4">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-red-500">
                    <span className="material-symbols-outlined text-5xl">sos</span>
                </div>

                <h1 className="text-3xl font-black text-slate-800">{t("sos.emergency.title")}</h1>

                <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                    {t("sos.emergency.subtitle")}
                </p>
            </div>

            <div className="space-y-8 rounded-3xl border border-red-100 bg-white p-6 shadow-xl shadow-red-100/40 md:p-10">
                {/* =====================
                    1 Emergency Type
                ====================== */}

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
                            <p className="font-bold text-red-600">{t("sos.emergency.noTypes")}</p>

                            <p className="mt-1 text-sm text-red-400">
                                {t("sos.emergency.reload")}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {emergencyTypes.map((item) => {
                                const active = form.emergencyType === item.value;
                                const translatedType = dictionary.sos.emergency.typeLabels?.[item.value];
                                const displayLabel = language === "en" && translatedType?.label ? translatedType.label : item.label;
                                const displayDescription = language === "en" && translatedType?.description ? translatedType.description : item.description;

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
                                            <p className="font-black text-slate-800">{displayLabel}</p>

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

                {/* =====================
                    2 Location
                ====================== */}

                <section className="space-y-5">
                    <FormSectionTitle
                        number="2"
                        title={t("sos.emergency.locationTitle")}
                        description={t("sos.emergency.locationDescription")}
                    />

                    <LocationPicker location={location} onLocationChange={setLocation} />
                </section>

                {/* =====================
                    3 Victims
                ====================== */}

                <section className="space-y-5">
                    <FormSectionTitle
                        number="3"
                        title={t("sos.emergency.victimsTitle")}
                        description={t("sos.emergency.victimsDescription")}
                    />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <NumberField
                            label={t("sos.emergency.child")}
                            unit={t("sos.emergency.personUnit")}
                            value={form.childCount}
                            onChange={(value) => setNumber("childCount", value)}
                        />

                        <NumberField
                            label={t("sos.emergency.elderly")}
                            unit={t("sos.emergency.personUnit")}
                            value={form.elderlyCount}
                            onChange={(value) => setNumber("elderlyCount", value)}
                        />

                        <NumberField
                            label={t("sos.emergency.disabled")}
                            unit={t("sos.emergency.personUnit")}
                            value={form.disabledCount}
                            onChange={(value) => setNumber("disabledCount", value)}
                        />

                        <NumberField
                            label={t("sos.emergency.patient")}
                            unit={t("sos.emergency.personUnit")}
                            value={form.patientCount}
                            onChange={(value) => setNumber("patientCount", value)}
                        />
                    </div>

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

                {/* =====================
                    4 Details
                ====================== */}

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

                {/* Info */}

                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined">info</span>

                        <p>
                            {t("sos.emergency.criticalPrefix")}
                            <strong className="mx-1">{t("sos.emergency.criticalLabel")}</strong>
                            {t("sos.emergency.criticalSuffix")}
                        </p>
                    </div>
                </div>

                {/* Submit */}

                <button
                    type="button"
                    disabled={submitting || loadingTypes}
                    onClick={handleSubmit}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-red-200 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
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

function NumberField({ label, value, onChange, min = 0, unit }) {
    return (
        <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="mb-2 block text-xs font-bold text-slate-500">
                {label}
            </span>

            <input
                type="number"
                min={min}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full bg-transparent text-2xl font-black text-slate-800 outline-none"
            />

            <span className="text-xs text-slate-400">{unit}</span>
        </label>
    );
}
