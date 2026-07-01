"use client";

import { useState } from "react";
import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

const mockData = {
    sosId: "#8940",
    distance: "อีก 400 ม. (2 นาที)",
    mapImage:
        "https://via.placeholder.com/800x400/e0f2fe/64748b?text=Map+to+Community+Soi+5",

    destination: {
        name: "ชุมชนริมน้ำ ซอย 5",
        victims: "ผู้ประสบภัย: 10+ คน (กลุ่มใหญ่)",
        contactName: "คุณอานนท์",
        phone: "0899998888",
        phoneText: "089-999-8888",
        note:
            "ติดอยู่ในศาลาประชาคม อาหารหมดตั้งแต่เมื่อวาน มีเด็กเล็กหลายคน ต้องการนมกล่องและน้ำสะอาดด่วน",
    },

    supplies: [
        {
            icon: "inventory_2",
            iconStyle: "text-slate-400",
            name: "ถุงยังชีพ (ชุดใหญ่)",
            amount: "5 ชุด",
        },
        {
            icon: "water_drop",
            iconStyle: "text-sky-400",
            name: "น้ำดื่มแพ็ค (12 ขวด)",
            amount: "10 แพ็ค",
        },
        {
            icon: "child_care",
            iconStyle: "text-pink-400",
            name: "นมกล่องสำหรับเด็ก",
            amount: "2 ลัง",
        },
    ],

    links: {
        back: "/staff/staff-sos",
        closeMission: "/staff/staff-close-mission",
        map: "https://maps.google.com",
    },
};

export default function MissionActivePage() {
    const [checkedIn, setCheckedIn] = useState(false);
    const [checking, setChecking] = useState(false);

    const handleCheckIn = () => {
        setChecking(true);

        setTimeout(() => {
            setChecking(false);
            setCheckedIn(true);
        }, 1000);
    };

    const handleProofUpload = () => {
        alert("บันทึกภาพการแจกจ่ายเรียบร้อยแล้ว");
    };

    return (
        <div className={`min-h-screen flex flex-col ${colors.staffMissionActive.page}`}>
            <header className={`${colors.staffMissionActive.header} px-6 py-4 sticky top-0 z-50 shadow-md`}>
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href={mockData.links.back} className={buttons.staffMissionActive.back}>
                            <span className="material-symbols-outlined text-2xl">
                                chevron_left
                            </span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />

                                <span className="material-symbols-outlined text-3xl">
                                    rice_bowl
                                </span>
                            </div>

                            <div>
                                <h1 className="text-sm font-bold opacity-90 uppercase tracking-wide">
                                    สถานะภารกิจ
                                </h1>
                                <p className="text-lg font-bold leading-none">
                                    กำลังนำส่งเสบียง
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-xs opacity-70">SOS ID</p>
                        <p className="font-mono font-bold text-white text-lg">
                            {mockData.sosId}
                        </p>
                    </div>
                </div>
            </header>

            <section className={cards.staffMissionActive.map}>
                <img
                    src={mockData.mapImage}
                    alt="แผนที่นำส่งเสบียง"
                    className="w-full h-full object-cover opacity-80"
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white flex items-center gap-2 pointer-events-auto">
                        <span className="material-symbols-outlined text-orange-500 animate-pulse">
                            navigation
                        </span>
                        <span className="text-slate-800 font-bold text-sm">
                            {mockData.distance}
                        </span>
                    </div>
                </div>

                <a
                    href={mockData.links.map}
                    target="_blank"
                    className={buttons.staffMissionActive.map}
                >
                    <span className="material-symbols-outlined text-2xl">
                        assistant_direction
                    </span>
                </a>
            </section>

            <main className={cards.staffMissionActive.content}>
                <div className="max-w-md mx-auto space-y-6">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2" />

                    <section className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                                จุดหมายปลายทาง
                            </p>

                            <h2 className="text-xl font-bold text-slate-800">
                                {mockData.destination.name}
                            </h2>

                            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-slate-400 text-base">
                                    groups
                                </span>
                                {mockData.destination.victims}
                            </p>

                            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-slate-400 text-base">
                                    call
                                </span>
                                ติดต่อ: {mockData.destination.contactName} (
                                {mockData.destination.phoneText})
                            </p>
                        </div>

                        <a
                            href={`tel:${mockData.destination.phone}`}
                            className={buttons.staffMissionActive.call}
                        >
                            <span className="material-symbols-outlined">call</span>
                        </a>
                    </section>

                    <section className={cards.staffMissionActive.note}>
                        <span className="material-symbols-outlined text-slate-300 text-base mr-2 align-middle">
                            format_quote
                        </span>
                        {mockData.destination.note}
                    </section>

                    <section className={cards.staffMissionActive.supplyBox}>
                        <div className={cards.staffMissionActive.supplyHeader}>
                            <h3 className="text-sm font-bold text-orange-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">
                                    checklist
                                </span>
                                รายการเบิกจ่าย (เสบียง)
                            </h3>

                            <span className="text-[10px] bg-white text-orange-600 px-2 py-0.5 rounded border border-orange-200 font-bold">
                                จากคลัง A
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {mockData.supplies.map((item) => (
                                <div key={item.name} className={cards.staffMissionActive.supplyRow}>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`material-symbols-outlined ${item.iconStyle}`}
                                        >
                                            {item.icon}
                                        </span>

                                        <span className="text-sm text-slate-700">
                                            {item.name}
                                        </span>
                                    </div>

                                    <span className="font-bold text-slate-800 text-sm">
                                        {item.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3 pt-2">
                        <button
                            type="button"
                            onClick={handleCheckIn}
                            disabled={checkedIn || checking}
                            className={
                                checkedIn
                                    ? buttons.staffMissionActive.checked
                                    : buttons.staffMissionActive.checkin
                            }
                        >
                            <span className="material-symbols-outlined">
                                {checking ? "progress_activity" : checkedIn ? "check_circle" : "location_on"}
                            </span>

                            {checking
                                ? "กำลังระบุพิกัด..."
                                : checkedIn
                                    ? "เช็คอินเรียบร้อย"
                                    : "เช็คอิน: ถึงจุดแจกจ่ายแล้ว"}
                        </button>

                        <button
                            type="button"
                            onClick={handleProofUpload}
                            className={buttons.staffMissionActive.proof}
                        >
                            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                                photo_camera
                            </span>
                            <span>ถ่ายรูปขณะแจกจ่าย (Proof)</span>
                        </button>

                        <div className="pt-2">
                            <Link
                                href={mockData.links.closeMission}
                                className={buttons.staffMissionActive.closeMission}
                            >
                                <span className="material-symbols-outlined">
                                    fact_check
                                </span>
                                แจกจ่ายเสร็จสิ้น / ปิดงาน
                            </Link>
                        </div>
                    </section>

                    <div className="text-center">
                        <button className="text-red-400 text-xs hover:text-red-600 hover:underline">
                            รายงานปัญหา / ขอคลังเสริม
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}