"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

import {
    getStaffSosRequestById,
    updateSosRequestStatus,
} from "@/services/staff/sos";

const STATUS_CONFIG = {
    Accepted: {
        label: "รับเรื่องแล้ว",
        description: "เริ่มจัดเตรียมสิ่งของสำหรับภารกิจ",
        nextStatus: "Preparing",
        nextLabel: "เริ่มจัดเตรียมสิ่งของ",
        icon: "support_agent",
        colour: "bg-sky-600",
    },
    Preparing: {
        label: "กำลังจัดเตรียม",
        description: "ตรวจสอบสิ่งของให้ครบก่อนออกเดินทาง",
        nextStatus: "Delivering",
        nextLabel: "ยืนยันออกเดินทาง",
        icon: "inventory_2",
        colour: "bg-amber-500",
    },
    Delivering: {
        label: "กำลังนำส่ง",
        description: "กำลังเดินทางไปยังตำแหน่งผู้ประสบภัย",
        nextStatus: "Completed",
        nextLabel: "ช่วยเหลือสำเร็จ / ปิดงาน",
        icon: "local_shipping",
        colour: "bg-blue-600",
    },
    Completed: {
        label: "ภารกิจเสร็จสิ้น",
        description: "ดำเนินการช่วยเหลือเรียบร้อยแล้ว",
        nextStatus: null,
        nextLabel: null,
        icon: "task_alt",
        colour: "bg-emerald-500",
    },
};

export default function StaffMission() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestId = searchParams.get("id");

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const loadRequest = useCallback(async () => {
        if (!requestId) {
            setRequest(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getStaffSosRequestById(requestId);
            setRequest(data);
        } catch (error) {
            setRequest(null);
            await Swal.fire({
                icon: "error",
                title: "โหลดภารกิจไม่สำเร็จ",
                text: error.message || "ไม่สามารถโหลดข้อมูลภารกิจได้",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setLoading(false);
        }
    }, [requestId]);

    useEffect(() => {
        loadRequest();
    }, [loadRequest]);

    const statusConfig = useMemo(() => {
        return STATUS_CONFIG[request?.status] || null;
    }, [request?.status]);

    const handleUpdateStatus = async () => {
        if (!request?.id || !statusConfig?.nextStatus) return;

        const result = await Swal.fire({
            icon: "question",
            title: `เปลี่ยนสถานะเป็น “${STATUS_CONFIG[statusConfig.nextStatus]?.label || statusConfig.nextStatus}”`,
            input: "textarea",
            inputLabel: "หมายเหตุเจ้าหน้าที่ (ไม่บังคับ)",
            inputPlaceholder: "ระบุรายละเอียดเพิ่มเติม...",
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            setUpdating(true);

            await updateSosRequestStatus(
                request.id,
                statusConfig.nextStatus,
                result.value || ""
            );

            await loadRequest();

            await Swal.fire({
                icon: "success",
                title: "อัปเดตสถานะสำเร็จ",
                text: `สถานะถูกเปลี่ยนเป็น ${STATUS_CONFIG[statusConfig.nextStatus]?.label || statusConfig.nextStatus}`,
                confirmButtonText: "ตกลง",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "อัปเดตสถานะไม่สำเร็จ",
                text: error.message || "ไม่สามารถอัปเดตสถานะได้",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <MissionState icon="progress_activity" title="กำลังโหลดภารกิจ..." spinning />;
    }

    if (!request) {
        return (
            <MissionState
                icon="search_off"
                title="ไม่พบภารกิจ"
                description="กรุณาเลือกภารกิจจากหน้ารายการ SOS"
            />
        );
    }

    const items = Array.isArray(request.items) ? request.items : [];
    const isEmergency =
        String(request.requestType || "Relief")
            .trim()
            .toLowerCase() === "emergency";
    const latitude = Number(request.latitude);
    const longitude = Number(request.longitude);
    const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
    const mapUrl = hasCoordinates
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(request.addressDetail || "")}`;

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <section className={`overflow-hidden rounded-3xl text-white shadow-xl ${statusConfig?.colour || "bg-slate-700"}`}>
                <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                            <span className="material-symbols-outlined text-3xl">
                                {statusConfig?.icon || "emergency"}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-white/75">สถานะภารกิจ</p>
                            <h1 className="mt-1 text-2xl font-black md:text-3xl">
                                {statusConfig?.label || request.status}
                            </h1>
                            <p className="mt-1 text-sm text-white/80">
                                {statusConfig?.description}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white/15 px-5 py-3 text-right">
                        <p className="text-xs text-white/70">SOS ID</p>
                        <p className="font-mono text-lg font-black">#{request.id}</p>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <span className="material-symbols-outlined text-sky-500">person_pin_circle</span>
                            ข้อมูลผู้ประสบภัย
                        </h2>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <InfoBox label="ชื่อผู้แจ้ง" value={request.userFullName || "ไม่ระบุ"} />
                            <InfoBox label="เบอร์โทร" value={request.userPhoneNumber || "ไม่ระบุ"} />
                            {isEmergency && (
                                <InfoBox
                                    label="ระดับความเร่งด่วน"
                                    value={formatPriorityLabel(request.priority)}
                                />
                            )}
                            <InfoBox label="ศูนย์รับผิดชอบ" value={request.centerName || "ไม่ระบุ"} />
                        </div>

                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">สถานที่</p>
                            <p className="mt-1 font-bold text-slate-700">
                                {request.addressDetail || "ไม่ระบุสถานที่"}
                            </p>
                        </div>

                        {request.userRemark && (
                            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                                {request.userRemark}
                            </div>
                        )}

                        {request.userPhoneNumber && (
                            <a
                                href={`tel:${request.userPhoneNumber}`}
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-bold text-white transition hover:bg-emerald-600"
                            >
                                <span className="material-symbols-outlined">call</span>
                                โทรหาผู้แจ้ง
                            </a>
                        )}
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <span className="material-symbols-outlined text-orange-500">inventory_2</span>
                            รายการสิ่งของที่ร้องขอ
                        </h2>

                        <div className="mt-5 space-y-3">
                            {items.length === 0 ? (
                                <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-400">
                                    ไม่พบรายการสิ่งของ
                                </p>
                            ) : (
                                items.map((item, index) => (
                                    <div
                                        key={item.id || `${item.reliefItemId}-${index}`}
                                        className="flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 p-4"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-800">
                                                {item.reliefItemName || item.name || "ไม่ระบุรายการ"}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                จำนวน {item.quantity || 0} {item.unit || ""}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-orange-500">package_2</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-sky-100 bg-sky-50 p-6 shadow-sm">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <span className="material-symbols-outlined text-sky-500">map</span>
                            ตำแหน่งภารกิจ
                        </h2>

                        <div className="mt-5 flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-sky-100 bg-white p-6 text-center">
                            <span className="material-symbols-outlined text-6xl text-red-500">location_on</span>
                            <p className="mt-3 font-bold text-slate-700">
                                {request.addressDetail || "ไม่ระบุสถานที่"}
                            </p>
                            {hasCoordinates && (
                                <p className="mt-2 font-mono text-xs text-slate-400">
                                    {latitude}, {longitude}
                                </p>
                            )}
                        </div>

                        <a
                            href={mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 font-bold text-white transition hover:bg-sky-700"
                        >
                            <span className="material-symbols-outlined">near_me</span>
                            เปิด Google Maps
                        </a>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800">ดำเนินการภารกิจ</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            ระบบจะอนุญาตให้อัปเดตสถานะตามลำดับเท่านั้น
                        </p>

                        {statusConfig?.nextStatus ? (
                            <button
                                type="button"
                                onClick={handleUpdateStatus}
                                disabled={updating}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-4 font-bold text-white shadow-lg transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className={`material-symbols-outlined ${updating ? "animate-spin" : ""}`}>
                                    {updating ? "progress_activity" : "arrow_forward"}
                                </span>
                                {updating ? "กำลังอัปเดต..." : statusConfig.nextLabel}
                            </button>
                        ) : (
                            <div className="mt-5 rounded-2xl bg-emerald-50 p-5 text-center font-bold text-emerald-600">
                                ภารกิจนี้เสร็จสิ้นแล้ว
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => router.push("/staff/staff-sos")}
                            className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-3 font-bold text-slate-600 transition hover:bg-slate-50"
                        >
                            กลับไปรายการ SOS
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function InfoBox({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 break-words font-bold text-slate-700">{value}</p>
        </div>
    );
}

function MissionState({ icon, title, description = "กรุณารอสักครู่", spinning = false }) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                    <span className={`material-symbols-outlined text-3xl ${spinning ? "animate-spin" : ""}`}>
                        {icon}
                    </span>
                </div>
                <h1 className="mt-4 text-lg font-bold text-slate-700">{title}</h1>
                <p className="mt-1 text-sm text-slate-400">{description}</p>
            </div>
        </div>
    );
}


function formatPriorityLabel(priority) {
    const value = String(priority || "")
        .trim()
        .toLowerCase();

    if (value === "critical") {
        return "วิกฤต";
    }

    if (value === "urgent") {
        return "เร่งด่วน";
    }

    return "ปกติ";
}
