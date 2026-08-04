"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import StaffLayout from "@/components/layout/StaffLayout";

export default function StaffVerifySuccessPage() {
    const searchParams = useSearchParams();
    const donationId = searchParams.get("id") || "-";
    const donorName = searchParams.get("donor") || "ไม่ระบุ";
    const itemCount = searchParams.get("count") || "0";

    return (
        <StaffLayout showHome backHref="/staff/staff-verify" showBack>
            <div className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center">
                <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-emerald-100/60">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                        <span className="material-symbols-outlined text-6xl">
                            check
                        </span>
                    </div>

                    <h1 className="text-3xl font-black text-slate-800">
                        รับเข้าคลังเรียบร้อย
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        สถานะบริจาคและจำนวนสิ่งของในคลังถูกอัปเดตแล้ว
                    </p>

                    <div className="my-7 space-y-3 rounded-2xl bg-slate-50 p-5 text-left">
                        <InfoRow label="Tracking ID" value={donationId} mono />
                        <InfoRow label="ผู้บริจาค" value={donorName} />
                        <InfoRow label="จำนวนรายการ" value={`${itemCount} รายการ`} />
                        <InfoRow label="สถานะ" value="รับเข้าคลังแล้ว" success />
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/staff/staff-verify"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 font-bold text-white hover:bg-sky-700"
                        >
                            <span className="material-symbols-outlined">
                                qr_code_scanner
                            </span>
                            รับบริจาครายการต่อไป
                        </Link>
                        <Link
                            href="/staff/staff-home"
                            className="block w-full rounded-xl border border-slate-200 py-3 font-bold text-slate-600 hover:bg-slate-50"
                        >
                            กลับหน้าหลัก
                        </Link>
                    </div>
                </section>
            </div>
        </StaffLayout>
    );
}

function InfoRow({ label, value, mono = false, success = false }) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">{label}</span>
            <span
                className={`${mono ? "font-mono" : ""} ${
                    success ? "text-emerald-600" : "text-slate-800"
                } text-right font-bold`}
            >
                {value}
            </span>
        </div>
    );
}
