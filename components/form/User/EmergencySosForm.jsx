"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import LocationPicker from "@/components/user/SosForm/LocationPicker";
import FormSectionTitle from "@/components/user/SosForm/FormSectionTitle";

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
                    title: "โหลดประเภทเหตุไม่สำเร็จ",
                    text: error?.message || "ไม่สามารถโหลดประเภทเหตุฉุกเฉินได้",
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
                title: "กรุณาระบุผู้ประสบภัย",
                text: "กรุณาระบุจำนวนเด็ก ผู้สูงอายุ ผู้พิการ หรือผู้ป่วยอย่างน้อย 1 คน",
            });

            return false;
        }

        if (!form.emergencyDetail.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "กรุณาระบุรายละเอียดเหตุฉุกเฉิน",
                text: "ข้อมูลนี้ช่วยให้เจ้าหน้าที่เตรียมการช่วยเหลือได้เหมาะสม",
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
            title: "ยืนยันการแจ้ง SOS",
            text: "กรุณาตรวจสอบตำแหน่งและข้อมูลเหตุฉุกเฉินก่อนส่ง",
            showCancelButton: true,
            confirmButtonText: "ส่ง SOS",
            cancelButtonText: "ตรวจสอบอีกครั้ง",
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
                title: "ส่ง SOS สำเร็จ",
                text: `รหัสเคส: ${response?.sosRequestId ?? "-"}`,
                timer: 1400,
                showConfirmButton: false,
            });

            router.push(
                `/user/sos-success?id=${encodeURIComponent(response.sosRequestId)}`
            );
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "ส่ง SOS ไม่สำเร็จ",
                text: error?.message || "เกิดข้อผิดพลาด",
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

                <h1 className="text-3xl font-black text-slate-800">แจ้ง SOS ฉุกเฉิน</h1>

                <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                    ใช้สำหรับเหตุที่ต้องการให้เจ้าหน้าที่เข้าช่วยเหลือ ณ จุดเกิดเหตุโดยตรง
                    กรุณาปักหมุดตำแหน่งและให้ข้อมูลตามสถานการณ์จริง
                </p>
            </div>

            <div className="space-y-8 rounded-3xl border border-red-100 bg-white p-6 shadow-xl shadow-red-100/40 md:p-10">
                {/* =====================
                    1 Emergency Type
                ====================== */}

                <section className="space-y-5">
                    <FormSectionTitle
                        number="1"
                        title="ประเภทเหตุฉุกเฉิน"
                        description="เลือกเหตุการณ์ที่ตรงกับสถานการณ์มากที่สุด"
                    />

                    {loadingTypes ? (
                        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                            <div className="text-center">
                                <span className="material-symbols-outlined animate-spin text-4xl text-red-500">
                                    progress_activity
                                </span>

                                <p className="mt-2 text-sm font-bold text-slate-500">
                                    กำลังโหลดประเภทเหตุ...
                                </p>
                            </div>
                        </div>
                    ) : emergencyTypes.length === 0 ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                            <p className="font-bold text-red-600">ไม่พบประเภทเหตุฉุกเฉิน</p>

                            <p className="mt-1 text-sm text-red-400">
                                กรุณาลองโหลดหน้าใหม่อีกครั้ง
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {emergencyTypes.map((item) => {
                                const active = form.emergencyType === item.value;

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
                                            <p className="font-black text-slate-800">{item.label}</p>

                                            <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                                {item.description}
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
                        title="ตำแหน่งเหตุฉุกเฉิน"
                        description="ใช้ตำแหน่งปัจจุบันเพื่อให้เจ้าหน้าที่เดินทางไปยังจุดเกิดเหตุ"
                    />

                    <LocationPicker location={location} onLocationChange={setLocation} />
                </section>

                {/* =====================
                    3 Victims
                ====================== */}

                <section className="space-y-5">
                    <FormSectionTitle
                        number="3"
                        title="ข้อมูลผู้ประสบภัย"
                        description="ระบุจำนวนคนโดยประมาณ เพื่อช่วยให้เจ้าหน้าที่เตรียมกำลังได้เหมาะสม"
                    />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <NumberField
                            label="เด็ก"
                            value={form.childCount}
                            onChange={(value) => setNumber("childCount", value)}
                        />

                        <NumberField
                            label="ผู้สูงอายุ"
                            value={form.elderlyCount}
                            onChange={(value) => setNumber("elderlyCount", value)}
                        />

                        <NumberField
                            label="ผู้พิการ"
                            value={form.disabledCount}
                            onChange={(value) => setNumber("disabledCount", value)}
                        />

                        <NumberField
                            label="ผู้ป่วย"
                            value={form.patientCount}
                            onChange={(value) => setNumber("patientCount", value)}
                        />
                    </div>

                    <div className="max-w-sm">
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            ระดับน้ำโดยประมาณ (เมตร)
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
                            placeholder="เช่น 1.2"
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
                        title="รายละเอียดเหตุฉุกเฉิน"
                        description="บอกสภาพแวดล้อม จุดเสี่ยง อาการผู้บาดเจ็บ หรือข้อมูลที่เจ้าหน้าที่ควรรู้"
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
                        placeholder="เช่น มีผู้ป่วยติดเตียง 1 คน น้ำสูงประมาณระดับเอว ทางเข้าเป็นซอยแคบ..."
                        className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                </section>

                {/* Info */}

                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined">info</span>

                        <p>
                            การแจ้ง SOS ฉุกเฉินทุกเคสจะถูกส่งเป็นระดับ
                            <strong className="mx-1">วิกฤต (Critical)</strong>
                            เพื่อให้เจ้าหน้าที่เห็นและดำเนินการกับเคสฉุกเฉินโดยเร็ว
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

                    {submitting ? "กำลังส่ง SOS..." : "ส่ง SOS ฉุกเฉิน"}
                </button>
            </div>
        </div>
    );
}

function NumberField({ label, value, onChange, min = 0 }) {
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

            <span className="text-xs text-slate-400">คน</span>
        </label>
    );
}
