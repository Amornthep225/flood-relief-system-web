"use client";

import { useEffect, useState } from "react";
import {
    getDistricts,
    getProvinces,
    getSubDistricts,
} from "@/services/thaiAddresses/thaiAddresses";
import InputField from "./InputField";

function SelectField({ label, value, onChange, options, disabled, loading, required }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">
                {label}{required ? <span className="text-red-500"> *</span> : null}
            </span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled || loading}
                required={required}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
                <option value="">{loading ? "กำลังโหลด..." : `เลือก${label}`}</option>
                {options.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                        {item.nameTh}
                    </option>
                ))}
            </select>
        </label>
    );
}

export default function CenterModal({ mode, form, saving, onFormChange, onClose, onSave }) {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subDistricts, setSubDistricts] = useState([]);
    const [loadingProvince, setLoadingProvince] = useState(true);
    const [loadingDistrict, setLoadingDistrict] = useState(false);
    const [loadingSubDistrict, setLoadingSubDistrict] = useState(false);
    const [addressError, setAddressError] = useState("");

    function updateField(field, value) {
        onFormChange((current) => ({ ...current, [field]: value }));
    }

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                setLoadingProvince(true);
                setAddressError("");
                const data = await getProvinces();
                if (active) setProvinces(data);
            } catch (error) {
                if (active) setAddressError(error.message);
            } finally {
                if (active) setLoadingProvince(false);
            }
        }
        load();
        return () => { active = false; };
    }, []);

    useEffect(() => {
        let active = true;
        async function load() {
            if (!form.provinceId) {
                setDistricts([]);
                return;
            }
            try {
                setLoadingDistrict(true);
                setAddressError("");
                const data = await getDistricts(form.provinceId);
                if (active) setDistricts(data);
            } catch (error) {
                if (active) setAddressError(error.message);
            } finally {
                if (active) setLoadingDistrict(false);
            }
        }
        load();
        return () => { active = false; };
    }, [form.provinceId]);

    useEffect(() => {
        let active = true;
        async function load() {
            if (!form.districtId) {
                setSubDistricts([]);
                return;
            }
            try {
                setLoadingSubDistrict(true);
                setAddressError("");
                const data = await getSubDistricts(form.districtId);
                if (active) setSubDistricts(data);
            } catch (error) {
                if (active) setAddressError(error.message);
            } finally {
                if (active) setLoadingSubDistrict(false);
            }
        }
        load();
        return () => { active = false; };
    }, [form.districtId]);

    function handleProvinceChange(value) {
        onFormChange((current) => ({
            ...current,
            provinceId: value,
            districtId: "",
            subDistrictId: "",
            province: provinces.find((x) => String(x.id) === value)?.nameTh ?? "",
            district: "",
            subDistrict: "",
            zipCode: "",
        }));
    }

    function handleDistrictChange(value) {
        onFormChange((current) => ({
            ...current,
            districtId: value,
            subDistrictId: "",
            district: districts.find((x) => String(x.id) === value)?.nameTh ?? "",
            subDistrict: "",
            zipCode: "",
        }));
    }

    function handleSubDistrictChange(value) {
        const selected = subDistricts.find((x) => String(x.id) === value);
        onFormChange((current) => ({
            ...current,
            subDistrictId: value,
            subDistrict: selected?.nameTh ?? "",
            zipCode: selected?.zipCode ?? "",
            latitude: current.latitude === "" && selected?.latitude != null ? String(selected.latitude) : current.latitude,
            longitude: current.longitude === "" && selected?.longitude != null ? String(selected.longitude) : current.longitude,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSave();
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/50 px-4 py-8 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-5">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                        <span className="material-symbols-outlined text-teal-600">{mode === "edit" ? "edit_square" : "add_business"}</span>
                        {mode === "edit" ? `แก้ไขข้อมูลศูนย์ ${form.id}` : "เพิ่มจุดรับบริจาคใหม่"}
                    </h2>
                    <button type="button" onClick={onClose} disabled={saving} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 disabled:opacity-50">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>

                <div className="max-h-[80vh] space-y-4 overflow-y-auto p-6">
                    <InputField label="ชื่อจุดรับบริจาค" value={form.centerName} onChange={(value) => updateField("centerName", value)} required />
                    <InputField label="ที่อยู่ เลขที่/หมู่/ถนน" value={form.address} onChange={(value) => updateField("address", value)} required />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <SelectField label="จังหวัด" value={String(form.provinceId ?? "")} onChange={handleProvinceChange} options={provinces} loading={loadingProvince} required />
                        <SelectField label="อำเภอ / เขต" value={String(form.districtId ?? "")} onChange={handleDistrictChange} options={districts} loading={loadingDistrict} disabled={!form.provinceId} required />
                        <SelectField label="ตำบล / แขวง" value={String(form.subDistrictId ?? "")} onChange={handleSubDistrictChange} options={subDistricts} loading={loadingSubDistrict} disabled={!form.districtId} required />
                    </div>

                    {addressError ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{addressError}</p> : null}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InputField label="รหัสไปรษณีย์" value={form.zipCode} onChange={() => {}} maxLength={5} disabled />
                        <InputField label="ชื่อผู้ประสานงาน" value={form.contactName} onChange={(value) => updateField("contactName", value)} />
                        <InputField label="เบอร์โทรศัพท์" value={form.phoneNumber} onChange={(value) => updateField("phoneNumber", value.replace(/\D/g, ""))} maxLength={10} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField label="Latitude" type="number" step="any" value={form.latitude} onChange={(value) => updateField("latitude", value)} />
                        <InputField label="Longitude" type="number" step="any" value={form.longitude} onChange={(value) => updateField("longitude", value)} />
                    </div>

                    {mode === "edit" && (
                        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <input type="checkbox" checked={Boolean(form.isActive)} onChange={(event) => updateField("isActive", event.target.checked)} className="h-5 w-5 accent-teal-600" />
                            <span className="font-bold text-slate-700">เปิดใช้งานศูนย์</span>
                        </label>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} disabled={saving} className="flex-1 rounded-xl border border-slate-200 bg-white py-3 font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">ยกเลิก</button>
                        <button type="submit" disabled={saving || loadingProvince || loadingDistrict || loadingSubDistrict} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-bold text-white shadow-lg shadow-teal-500/30 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60">
                            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
