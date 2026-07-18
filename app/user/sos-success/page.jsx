"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { getSosRequestById } from "@/services/user/sos";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

export default function RequestSuccessPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const loadData = async () => {
            try {
                const data = await getSosRequestById(id);
                setRequest(data);
                console.log("SUCCESS REQUEST",request)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500 font-semibold">
                กำลังโหลดข้อมูล...
            </div>
        );
    }

    if (!request) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500 font-semibold">
                ไม่พบข้อมูลคำขอ
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex flex-col ${colors.success.page}`}>
            {/* Navigation */}
            <nav className="w-full px-6 py-4 flex justify-between items-center max-w-5xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="bg-sky-500 rounded-lg w-8 h-8 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-sm">water_drop</span>
                    </div>
                    <span className="text-lg font-bold text-slate-700">FLOOD RELIEF</span>
                </div>
                <a
                    href="tel:1784"
                    className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm"
                >
                    ☎ สายด่วน 1784
                </a>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex justify-center px-4 py-8">
                <div className="w-full max-w-lg">
                    <div className={cards.userSosSuccess.card}>
                        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
                            ส่งคำขอความช่วยเหลือสำเร็จ!
                        </h1>

                        {/* Request Info Box */}
                        <div className={`${cards.userSosSuccess.info} text-center my-6`}>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Request ID</p>
                            <h2 className="text-xl text-sky-600 font-bold mt-1">#{request.id}</h2>
                        </div>

                        {/* Summary List */}
                        <div className="space-y-4 border-t border-b py-6 my-6 border-slate-100">
                            <SummaryItem
                                icon="inventory_2"
                                label="รายการสิ่งของ"
                                value={
                                    request.items?.length > 0
                                        ? request.items.map((x) => `${x.reliefItemName} ${x.quantity} ${x.unit}`).join(", ")
                                        : "ไม่ได้ระบุรายการสิ่งของ"
                                }
                            />

                            <SummaryItem
                                icon="location_on"
                                label="ตำแหน่ง"
                                value={request.addressDetail}
                            />

                            <SummaryItem
                                icon="flag"
                                label="สถานะ"
                                value={request.status}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 space-y-3">
                            <Link
                                href={`/user/sos-tracking?id=${request.id}`}
                                className={buttons.userSosSuccess.tracking}
                            >
                                ติดตามสถานะคำขอ
                            </Link>

                            <Link
                                href="/user/sos-home"
                                className={buttons.userSosSuccess.home}
                            >
                                กลับหน้าหลัก
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Reusable Summary Item Component
function SummaryItem({ icon, label, value }) {
    return (
        <div className="flex gap-3 items-start">
            <div className="text-slate-400 mt-0.5">
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                <p className="font-semibold text-slate-700 text-sm mt-0.5 leading-relaxed">{value || "-"}</p>
            </div>
        </div>
    );
}