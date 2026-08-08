"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import LocationPicker from "@/components/user/SosForm/LocationPicker";
import FormSectionTitle from "@/components/user/SosForm/FormSectionTitle";
import { createEmergencySosRequest } from "@/services/user/sos";

const EMERGENCY_TYPES = [
    {
        value: "Evacuation",
        label: "ต้องการอพยพ",
        description: "ไม่สามารถอยู่ในพื้นที่ได้อย่างปลอดภัย",
        icon: "directions_run",
    },
    {
        value: "Trapped",
        label: "ติดอยู่ในพื้นที่น้ำท่วม",
        description: "ออกจากพื้นที่ด้วยตนเองไม่ได้",
        icon: "flood",
    },
    {
        value: "Injured",
        label: "มีผู้บาดเจ็บ",
        description: "มีผู้บาดเจ็บและต้องการเจ้าหน้าที่เข้าช่วยเหลือ",
        icon: "personal_injury",
    },
    {
        value: "Medical",
        label: "ผู้ป่วยฉุกเฉิน",
        description: "มีผู้ป่วยที่ต้องการความช่วยเหลือเร่งด่วน",
        icon: "medical_services",
    },
    {
        value: "RoofTrapped",
        label: "ติดอยู่บนอาคาร/หลังคา",
        description: "ระดับน้ำสูงและไม่สามารถลงจากอาคารได้",
        icon: "roofing",
    },
    {
        value: "RapidFlood",
        label: "น้ำเพิ่มระดับอย่างรวดเร็ว",
        description: "สถานการณ์มีแนวโน้มอันตรายอย่างรวดเร็ว",
        icon: "warning",
    },
    {
        value: "Other",
        label: "เหตุฉุกเฉินอื่น ๆ",
        description: "เหตุฉุกเฉินที่ไม่อยู่ในรายการข้างต้น",
        icon: "sos",
    },
];

const initialLocation = {
    latitude: null,
    longitude: null,
    addressDetail: "",
};

const initialForm = {
    emergencyType: "",
    victimCount: 1,
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
    const [submitting, setSubmitting] = useState(false);

    const setNumber = (name, value, min = 0) => {
        const number = Number(value);
        setForm((previous) => ({
            ...previous,
            [name]: Number.isFinite(number) ? Math.max(min, Math.floor(number)) : min,
        }));
    };

    const validate = async () => {
        if (!form.emergencyType) {
            await Swal.fire({
                icon: "warning",
                title: "กรุณาเลือกประเภทเหตุฉุกเฉิน",
            });
            return false;
        }

        if (location.latitude === null || location.longitude === null) {
            await Swal.fire({
                icon: "warning",
                title: "กรุณาปักหมุดตำแหน่ง",
                text: "เจ้าหน้าที่ต้องใช้พิกัดในการเดินทางไปยังจุดเกิดเหตุ",
            });
            return false;
        }

        if (!location.addressDetail.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "กรุณาระบุรายละเอียดสถานที่",
            });
            return false;
        }

        if (Number(form.victimCount) < 1) {
            await Swal.fire({
                icon: "warning",
                title: "จำนวนผู้ประสบภัยไม่ถูกต้อง",
                text: "ต้องมีผู้ประสบภัยอย่างน้อย 1 คน",
            });
            return false;
        }

        const vulnerableTotal =
            Number(form.childCount) +
            Number(form.elderlyCount) +
            Number(form.disabledCount) +
            Number(form.patientCount);

        if (vulnerableTotal > Number(form.victimCount)) {
            await Swal.fire({
                icon: "warning",
                title: "จำนวนบุคคลไม่สอดคล้องกัน",
                text: "จำนวนเด็ก ผู้สูงอายุ ผู้พิการ และผู้ป่วยรวมกันต้องไม่เกินจำนวนผู้ประสบภัยทั้งหมด",
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

    const handleSubmit = async () => {
        if (submitting || !(await validate())) return;

        const confirm = await Swal.fire({
            icon: "warning",
            title: "ยืนยันการแจ้ง SOS",
            text: "กรุณาตรวจสอบตำแหน่งและข้อมูลเหตุฉุกเฉินก่อนส่ง",
            showCancelButton: true,
            confirmButtonText: "ส่ง SOS",
            cancelButtonText: "ตรวจสอบอีกครั้ง",
            confirmButtonColor: "#ef4444",
        });

        if (!confirm.isConfirmed) return;

        try {
            setSubmitting(true);

            const response = await createEmergencySosRequest({
                latitude: Number(location.latitude),
                longitude: Number(location.longitude),
                addressDetail: location.addressDetail.trim(),
                emergencyType: form.emergencyType,
                victimCount: Number(form.victimCount),
                childCount: Number(form.childCount),
                elderlyCount: Number(form.elderlyCount),
                disabledCount: Number(form.disabledCount),
                patientCount: Number(form.patientCount),
                waterLevel:
                    form.waterLevel === "" ? null : Number(form.waterLevel),
                emergencyDetail: form.emergencyDetail.trim(),
            });

            await Swal.fire({
                icon: "success",
                title: "ส่ง SOS สำเร็จ",
                text: `รหัสเคส: ${response.sosRequestId}`,
                timer: 1400,
                showConfirmButton: false,
            });

            router.push(`/user/sos-success?id=${response.sosRequestId}`);
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "ส่ง SOS ไม่สำเร็จ",
                text: error.message || "เกิดข้อผิดพลาด",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl py-4">
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
                <section className="space-y-5">
                    <FormSectionTitle
                        number="1"
                        title="ประเภทเหตุฉุกเฉิน"
                        description="เลือกเหตุการณ์ที่ตรงกับสถานการณ์มากที่สุด"
                    />

                    <div className="grid gap-3 md:grid-cols-2">
                        {EMERGENCY_TYPES.map((item) => {
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
                                    className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${
                                        active
                                            ? "border-red-400 bg-red-50 ring-2 ring-red-100"
                                            : "border-slate-200 hover:border-red-200 hover:bg-red-50/40"
                                    }`}
                                >
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                            active
                                                ? "bg-red-500 text-white"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined">
                                            {item.icon}
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
                </section>

                <section className="space-y-5">
                    <FormSectionTitle
                        number="2"
                        title="ตำแหน่งเหตุฉุกเฉิน"
                        description="ใช้ตำแหน่งปัจจุบันเพื่อให้เจ้าหน้าที่เดินทางไปยังจุดเกิดเหตุ"
                    />
                    <LocationPicker location={location} onLocationChange={setLocation} />
                </section>

                <section className="space-y-5">
                    <FormSectionTitle
                        number="3"
                        title="ข้อมูลผู้ประสบภัย"
                        description="ระบุจำนวนคนโดยประมาณ เพื่อช่วยให้เจ้าหน้าที่เตรียมกำลังได้เหมาะสม"
                    />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <NumberField
                            label="ทั้งหมด"
                            value={form.victimCount}
                            min={1}
                            onChange={(value) => setNumber("victimCount", value, 1)}
                        />
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

                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined">info</span>
                        <p>
                            ระบบจะประเมินระดับความเร่งด่วนเบื้องต้นจากประเภทเหตุ จำนวนผู้ประสบภัย
                            กลุ่มเปราะบาง และระดับน้ำ เพื่อให้เคสเร่งด่วนถูกแสดงต่อเจ้าหน้าที่ก่อน
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-red-200 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className={`material-symbols-outlined ${submitting ? "animate-spin" : ""}`}>
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
            <span className="mb-2 block text-xs font-bold text-slate-500">{label}</span>
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
