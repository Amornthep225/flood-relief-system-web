"use client";

import { useMemo } from "react";

export default function DonationTimeline({ status }) {
    // นิยามขั้นตอนทั้งหมดของกระบวนการบริจาค
    const STEPS = [
        {
            key: "REGISTERED",
            title: "ลงทะเบียนบริจาคสำเร็จ",
            description: "บันทึกรายการบริจาคเข้าสู่ระบบแล้ว",
        },
        {
            key: "IN_TRANSIT",
            title: "กำลังจัดส่ง / อยู่ระหว่างขนส่ง",
            description: "สิ่งของกำลังเดินทางไปยังศูนย์รับบริจาค",
        },
        {
            key: "RECEIVED",
            title: "ศูนย์รับบริจาคได้รับของแล้ว",
            description: "เจ้าหน้าที่ปลายทางตรวจสอบและลงรับเรียบร้อย",
        },
    ];

    // คำนวณลำดับ Current Step ตามสถานะที่ส่งมาจาก Backend
    const currentStepIndex = useMemo(() => {
        if (!status) return 0;
        const normalizedStatus = status.toUpperCase();

        if (normalizedStatus.includes("REC") || normalizedStatus.includes("SUCCESS") || normalizedStatus.includes("COMPLETED")) {
            return 2;
        }
        if (normalizedStatus.includes("TRANSIT") || normalizedStatus.includes("DELIVER")) {
            return 1;
        }
        return 0; // Default: ลงทะเบียนสำเร็จ / รอดำเนินการ
    }, [status]);

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
                สถานะการบริจาค
            </h2>

            <div className="relative pl-2">
                {STEPS.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isLast = index === STEPS.length - 1;

                    return (
                        <div key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
                            {/* เส้นเชื่อมระหว่างขั้นตอน (Connector Line) */}
                            {!isLast && (
                                <span
                                    className={`absolute left-5 top-10 -ml-px h-full w-0.5 ${index < currentStepIndex ? "bg-emerald-500" : "bg-slate-200"
                                        }`}
                                    aria-hidden="true"
                                />
                            )}

                            {/* ไอคอนแสดงสถานะ (Step Badge) */}
                            <div className="relative z-10 flex-shrink-0">
                                {isCompleted ? (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                                        <span className="material-symbols-outlined text-xl font-bold">
                                            check
                                        </span>
                                    </div>
                                ) : isCurrent ? (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs ring-4 ring-amber-100 animate-pulse">
                                        <span className="material-symbols-outlined text-xl">
                                            sync
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                                        <span className="text-sm font-semibold">{index + 1}</span>
                                    </div>
                                )}
                            </div>

                            {/* ข้อความอธิบายสถานะ */}
                            <div className="flex flex-col justify-center pt-0.5">
                                <p
                                    className={`text-sm font-bold ${isCurrent
                                            ? "text-amber-600"
                                            : isCompleted
                                                ? "text-emerald-700"
                                                : "text-slate-400"
                                        }`}
                                >
                                    {step.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {isCurrent && status ? `(${status}) - ` : ""}
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}