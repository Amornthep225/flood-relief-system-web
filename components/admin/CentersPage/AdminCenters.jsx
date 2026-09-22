"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useNativeUi } from "@/hooks/useNativeUi";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { getSingleCenter, updateCenter } from "@/services/admin/centers";
import AdminCentersHeader from "./AdminCentersHeader";
import CenterModal from "./CenterModal";

function normalizeCenter(center) {
    return {
        id: center.id ?? center.centerId ?? "",
        centerName:
            center.centerName ??
            center.name ??
            "-",
        address: center.address ?? "",
        provinceId: center.provinceId ?? "",
        districtId: center.districtId ?? "",
        subDistrictId: center.subDistrictId ?? "",
        province: center.province ?? "",
        district: center.district ?? "",
        subDistrict:
            center.subDistrict ?? "",
        zipCode: center.zipCode ?? "",
        contactName:
            center.contactName ??
            center.manager ??
            "",
        phoneNumber:
            center.phoneNumber ??
            center.phone ??
            "",
        latitude:
            center.latitude ?? "",
        longitude:
            center.longitude ?? "",
        isActive:
            center.isActive !== false,
    };
}

export default function AdminCenters() {
    const { ui } = useNativeUi();
    const [center, setCenter] = useState(null);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [saveError, setSaveError] = useState("");
    const [success, setSuccess] = useState("");
    const savingRef = useRef(false);

    const loadData = useCallback(async (signal) => {
        setLoading(true);
        setError("");
        try {
            const data = await getSingleCenter(signal);
            if (signal?.aborted) return;
            const selected = data ? normalizeCenter(data) : null;
            setCenter(selected);
            setForm(selected);
        } catch (requestError) {
            if (signal?.aborted) return;
            setError(requestError.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        loadData(controller.signal);
        return () => controller.abort();
    }, [loadData]);

    async function saveCenter() {
        if (savingRef.current || !center) return;
        savingRef.current = true;
        setSaving(true);
        setSaveError("");
        setSuccess("");
        try {
            const payload = {
                centerName: form.centerName.trim(),
                address: form.address.trim(),
                provinceId: Number(form.provinceId),
                districtId: Number(form.districtId),
                subDistrictId: Number(form.subDistrictId),
                phoneNumber: form.phoneNumber.trim(),
                contactName: form.contactName.trim(),
                latitude: Number(form.latitude),
                longitude: Number(form.longitude),
                isActive: Boolean(form.isActive),
            };
            if (!payload.centerName || !payload.address ||
                !payload.provinceId || !payload.districtId || !payload.subDistrictId) {
                throw new Error("กรุณากรอกชื่อศูนย์และที่อยู่ให้ครบถ้วน");
            }
            if (payload.phoneNumber && !/^\d{9,10}$/.test(payload.phoneNumber)) {
                throw new Error("เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก");
            }
            if (String(form.latitude).trim() === "" || String(form.longitude).trim() === "" ||
                !Number.isFinite(payload.latitude) || Math.abs(payload.latitude) > 90 ||
                !Number.isFinite(payload.longitude) || Math.abs(payload.longitude) > 180) {
                throw new Error("กรุณาระบุ Latitude ระหว่าง -90 ถึง 90 และ Longitude ระหว่าง -180 ถึง 180");
            }
            await updateCenter(center.id, payload);
            const saved = { ...form, ...payload, id: center.id };
            setCenter(saved);
            setForm(saved);
            setSuccess("บันทึกข้อมูลศูนย์สำเร็จ");
        } catch (requestError) {
            setSaveError(requestError.message || "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            savingRef.current = false;
            setSaving(false);
        }
    }

    return (
        <RoleGuard role="Admin" storageKey="admin" loginPath="/admin-login">
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <AdminCentersHeader />
                <main className="mx-auto w-full max-w-5xl space-y-5 p-4 md:p-8">
                    {loading ? (
                        <p role="status" className="rounded-xl bg-white p-6">{ui("กำลังโหลดข้อมูลศูนย์...")}</p>
                    ) : error ? (
                        <div role="alert" className="rounded-xl bg-red-50 p-6 text-red-700">
                            <p>{ui(error)}</p>
                            <button type="button" onClick={() => loadData()} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white">{ui("ลองใหม่")}</button>
                        </div>
                    ) : !center ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <h2 className="font-bold">{ui("ยังไม่มีข้อมูลศูนย์ในระบบ")}</h2>
                            <p className="mt-2 text-slate-600">{ui("กรุณาให้ผู้ดูแลระบบตั้งค่าข้อมูลศูนย์ก่อนใช้งานหน้านี้")}</p>
                            <button type="button" onClick={() => loadData()} className="mt-3 text-teal-700">{ui("ลองใหม่")}</button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap items-right justify-end gap-3">

                                <Link href={`/admin/admin-center-inventory?centerId=${encodeURIComponent(center.id)}`} className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white">{ui("จัดการคลังสิ่งของ")}</Link>
                            </div>
                            {success && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-800">{ui(success)}</p>}
                            {saveError && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{ui(saveError)}</p>}
                            <CenterModal
                                inline
                                mode="edit"
                                form={form}
                                saving={saving}
                                onFormChange={(change) => { setForm(change); setSuccess(""); setSaveError(""); }}
                                onClose={() => { setForm({ ...center }); setSuccess(""); setSaveError(""); }}
                                onSave={saveCenter}
                            />
                        </>
                    )}
                </main>
            </div>
        </RoleGuard>
    );
}
