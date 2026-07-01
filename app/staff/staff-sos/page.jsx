"use client";

import { useState } from "react";
import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import StaffNavbar from "@/components/staff/staff-navbar";
const theme = colors.staff;

const mockData = {
    links: {
        home: "/staff/staff-home",
        closeCase: "/staff/staff-home",
        activeMission: "/staff/staff-active-mission",
        googleMap: "https://maps.google.com",
    },

    waitingCases: [
        {
            id: "#8943",
            title: "ขาดแคลนอาหารและน้ำดื่ม",
            location: "หอประชุมหมู่บ้าน หมู่ 5 ต.เวียงพางคำ",
            amount: "10 ถุง",
            time: "15 นาทีที่แล้ว",
            note: "ติดอยู่ในหอประชุม อาหารและน้ำดื่มหมดตั้งแต่เมื่อวาน มีเด็กและคนชราหลายคน ต้องการข้าวกล่องและน้ำแพ็คจำนวนมาก",
            distance: "2.5 กม.",
        },
    ],

    progressCases: [
        {
            id: "#8940",
            title: "ขาดแคลนอาหารและน้ำดื่ม",
            location: "ชุมชนริมน้ำ ซอย 5",
            amount: "10 ถุง",
            status: "กำลังเดินทาง (อีก 400 ม.)",
            color: "orange",
            href: "/staff/staff-mission-active",
        },
        {
            id: "#8938",
            title: "ส่งยารักษาโรค",
            location: "หมู่บ้านจัดสรรร่มรื่น",
            amount: "",
            status: "ถึงพื้นที่แล้ว",
            color: "blue",
            href: "/staff/staff-mission-active",
        },
    ],

    completedCases: [
        {
            id: "#8930",
            title: "ส่งเสบียงอาหารแห้ง",
            location: "หอประชุมหมู่บ้าน หมู่ 5 ต.เวียงพางคำ",
            closedAt: "10:30 น.",
        },
    ],
};

export default function StaffSosPage() {
    const [activeTab, setActiveTab] = useState("waiting");
    const [confirmId, setConfirmId] = useState("");
    const [gpsData, setGpsData] = useState(null);
    const [detailId, setDetailId] = useState("");

    const openConfirmModal = (id) => {
        setConfirmId(id);
    };

    const confirmJob = () => {
        setConfirmId("");
        setActiveTab("progress");
    };

    return (
        <div className={`min-h-screen flex flex-col ${colors.staffSos.page}`}>
            <StaffNavbar
                user={mockData.user}
                theme={theme}
                hotline={mockData.hotline}
                notificationCount={3}
                homeHref="/staff/staff-home"
                backHref="/staff/staff-home"
                logoutHref="/staff/staff-login"
                options={{
                    back: true,
                    home: false,
                    logout: true,
                    notification: true,
                    profile: true,
                    hotlineButton: true,
                }}
            />
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
                <div className="mb-4">
                    <Link
                        href={mockData.links.home}
                        className="inline-flex items-center text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 shadow-sm group-hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-xs">
                                chevron_left
                            </span>
                        </div>
                        กลับสู่หน้าหลัก
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-500 animate-pulse">
                                cell_tower
                            </span>
                            รายการแจ้งขอความช่วยเหลือ (SOS)
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            จัดการภารกิจและติดตามสถานะการช่วยเหลือ
                        </p>
                    </div>

                    <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                        <TabButton
                            active={activeTab === "waiting"}
                            onClick={() => setActiveTab("waiting")}
                        >
                            รอช่วยเหลือ (1)
                        </TabButton>

                        <TabButton
                            active={activeTab === "progress"}
                            onClick={() => setActiveTab("progress")}
                        >
                            กำลังดำเนินการ (2)
                        </TabButton>

                        <TabButton
                            active={activeTab === "completed"}
                            onClick={() => setActiveTab("completed")}
                        >
                            เสร็จสิ้น (1)
                        </TabButton>
                    </div>
                </div>

                <div className="space-y-4">
                    {activeTab === "waiting" && (
                        <div className="space-y-4">
                            {mockData.waitingCases.map((item) => (
                                <div
                                    key={item.id}
                                    className={`${cards.staffSos.card} border-l-4 border-l-orange-500`}
                                >
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <span className="text-xs text-slate-400">
                                            {item.time}
                                        </span>
                                        <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            ต้องการความช่วยเหลือ
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 min-w-[80px] md:border-r md:border-slate-100 md:pr-4">
                                            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-xl shadow-sm">
                                                <span className="material-symbols-outlined">
                                                    restaurant
                                                </span>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">
                                                    SOS ID
                                                </p>
                                                <p className="text-sm font-mono font-bold text-slate-700">
                                                    {item.id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-grow">
                                            <h3 className="text-lg font-bold text-slate-800 mb-1">
                                                {item.title}
                                            </h3>

                                            <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-slate-600 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-slate-400 text-sm">
                                                        location_on
                                                    </span>
                                                    {item.location}
                                                </span>

                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-slate-400 text-sm">
                                                        groups
                                                    </span>
                                                    {item.amount}
                                                </span>
                                            </div>

                                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-500 italic">
                                                “{item.note}”
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col gap-2 justify-end min-w-[140px]">
                                            <button
                                                onClick={() => openConfirmModal(item.id)}
                                                className={buttons.staffSos.acceptJob}
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    inventory_2
                                                </span>
                                                รับงานส่งเสบียง
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setGpsData({
                                                        target: item.location,
                                                        distance: item.distance,
                                                    })
                                                }
                                                className={buttons.staffSos.gps}
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    map
                                                </span>
                                                ดูพิกัด
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "progress" && (
                        <div className="space-y-4">
                            {mockData.progressCases.map((item) => {
                                const isOrange = item.color === "orange";

                                return (
                                    <div
                                        key={item.id}
                                        className={`bg-white rounded-xl border shadow-md p-5 relative overflow-hidden ${isOrange ? "border-orange-200" : "border-blue-200"
                                            }`}
                                    >
                                        <div
                                            className={`absolute top-0 right-0 text-white text-[10px] px-3 py-1 rounded-bl-xl font-bold ${isOrange ? "bg-orange-500" : "bg-blue-600"
                                                }`}
                                        >
                                            {isOrange ? "กำลังนำส่งเสบียง" : "กำลังดำเนินการ"}
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 min-w-[80px] md:border-r md:border-slate-100 md:pr-4">
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${isOrange
                                                        ? "bg-orange-100 text-orange-600 animate-pulse"
                                                        : "bg-blue-100 text-blue-600"
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        {isOrange ? "rice_bowl" : "medical_services"}
                                                    </span>
                                                </div>

                                                <div className="text-center">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                                                        SOS ID
                                                    </p>
                                                    <p className="text-sm font-mono font-bold text-slate-700">
                                                        {item.id}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex-grow">
                                                <h3 className="text-lg font-bold text-slate-800 mb-1">
                                                    {item.title}
                                                </h3>

                                                <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-slate-600 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-slate-400 text-sm">
                                                            location_on
                                                        </span>
                                                        {item.location}
                                                    </span>

                                                    {item.amount && (
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-slate-400 text-sm">
                                                                person
                                                            </span>
                                                            {item.amount}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs text-slate-500">
                                                        สถานะล่าสุด:
                                                    </span>

                                                    <span
                                                        className={`text-xs font-bold px-2 py-0.5 rounded ${isOrange
                                                            ? "text-orange-600 bg-orange-50"
                                                            : "text-blue-600 bg-blue-50"
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col gap-2 justify-center min-w-[160px]">
                                                <Link
                                                    href={item.href}
                                                    className={`text-white text-sm font-bold py-3 px-4 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 ${isOrange
                                                        ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
                                                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        play_arrow
                                                    </span>
                                                    ดำเนินการต่อ
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === "completed" && (
                        <div className="space-y-4">
                            {mockData.completedCases.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
                                >
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
                                            <span className="material-symbols-outlined">
                                                check
                                            </span>
                                        </div>

                                        <div className="flex-grow text-center md:text-left">
                                            <h3 className="text-lg font-bold text-slate-800">
                                                {item.title}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-1 flex items-center justify-center md:justify-start gap-1">
                                                <span className="material-symbols-outlined text-slate-400 text-sm">
                                                    location_on
                                                </span>
                                                {item.location}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center md:items-end gap-2">
                                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                                ปิดงานเมื่อ: {item.closedAt}
                                            </span>

                                            <button
                                                onClick={() => setDetailId(item.id)}
                                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    description
                                                </span>
                                                ดูรายละเอียด
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {confirmId && (
                <ConfirmModal
                    id={confirmId}
                    onClose={() => setConfirmId("")}
                    onConfirm={confirmJob}
                />
            )}

            {gpsData && (
                <GpsModal
                    target={gpsData.target}
                    distance={gpsData.distance}
                    onClose={() => setGpsData(null)}
                />
            )}

            {detailId && (
                <DetailsModal id={detailId} onClose={() => setDetailId("")} />
            )}
        </div>
    );
}

function TabButton({
    active,
    children,
    onClick,
}) {
    return (
        <button
            onClick={onClick}
            className={`${buttons.staffSos.tab} ${active ? buttons.staffSos.tabActive : buttons.staffSos.tabInactive
                }`}
        >
            {children}
        </button>
    );
}

function ConfirmModal({
    id,
    onClose,
    onConfirm,
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        <span className="material-symbols-outlined text-4xl">
                            help
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        ยืนยันการรับงาน?
                    </h3>

                    <p className="text-slate-500 text-sm mb-1">
                        คุณกำลังจะรับผิดชอบเคส{" "}
                        <span className="font-bold text-slate-800">{id}</span>
                    </p>

                    <p className="text-xs text-slate-400 mb-6">
                        เมื่อยืนยันแล้ว งานจะย้ายไปที่แท็บ “กำลังดำเนินการ”
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-colors"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={onConfirm}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                        >
                            ยืนยันรับงาน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GpsModal({
    target,
    distance,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative flex flex-col h-[80vh] md:h-auto">
                <div className="bg-white p-4 border-b border-slate-100 flex justify-between items-center z-10">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">
                            location_on
                        </span>
                        ตำแหน่งผู้ประสบภัย
                    </h3>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                    >
                        <span className="material-symbols-outlined text-sm">
                            close
                        </span>
                    </button>
                </div>

                <div className="relative flex-grow bg-slate-200 min-h-[300px]">
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        Google Map View
                    </div>

                    <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-red-500 drop-shadow-md animate-bounce">
                        location_on
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl border border-white shadow-lg">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">
                                    Destination
                                </p>

                                <h4 className="font-bold text-slate-800 text-lg line-clamp-1">
                                    {target}
                                </h4>
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-slate-500 font-bold uppercase">
                                    Distance
                                </p>

                                <h4 className="font-bold text-blue-600 text-lg">
                                    {distance}
                                </h4>
                            </div>
                        </div>

                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-center shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">
                                near_me
                            </span>
                            นำทางด้วย Google Maps
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailsModal({
    id,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-4 overflow-y-auto py-10">
            <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/50 my-auto">
                <div className="h-32 bg-gradient-to-br from-emerald-400 to-teal-600 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white"
                    >
                        <span className="material-symbols-outlined text-sm">
                            close
                        </span>
                    </button>
                </div>

                <div className="absolute top-20 left-8 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white rotate-3">
                    <div className="w-full h-full bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 text-3xl -rotate-3">
                        <span className="material-symbols-outlined text-4xl">
                            done_all
                        </span>
                    </div>
                </div>

                <div className="px-8 pt-12 pb-8">
                    <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-6">
                        <div>
                            <p className="text-sm font-bold text-emerald-600 mb-1 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                ภารกิจเสร็จสิ้น
                            </p>

                            <h3 className="text-2xl font-black text-slate-800">
                                ส่งเสบียงอาหาร
                            </h3>

                            <p className="text-sm text-slate-500 font-mono mt-1">
                                Ref: <span className="text-slate-700 font-bold">{id}</span>
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <InfoBox
                            icon="location_on"
                            title="สถานที่จัดส่ง"
                            text="หอประชุมหมู่บ้าน หมู่ 5 ต.เวียงพางคำ"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <InfoBox
                                icon="schedule"
                                title="เวลาดำเนินการ"
                                text="10:30 น."
                                subText="วันนี้ (19 ก.พ. 69)"
                            />

                            <InfoBox
                                icon="inventory_2"
                                title="สิ่งของที่มอบ"
                                text="อาหารแห้ง, น้ำดื่ม"
                                subText="จำนวน 15 ชุด"
                            />
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-slate-300 text-sm">
                                    photo_camera
                                </span>
                                ภาพหลักฐานการส่งมอบ
                            </p>

                            <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center text-slate-400">
                                Proof of delivery
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100/50 mt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold border-2 border-white shadow-sm text-xs">
                                    T1
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                                        ผู้รับผิดชอบ
                                    </p>

                                    <p className="text-sm font-bold text-slate-800">
                                        นายสมชาย ใจดี
                                    </p>
                                </div>
                            </div>

                            <span className="bg-white text-slate-500 border border-slate-200 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                                ยืนยันแล้ว
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-800/20"
                        >
                            ปิดหน้าต่าง
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoBox({
    icon,
    title,
    text,
    subText,
}) {
    return (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 shrink-0">
                <span className="material-symbols-outlined text-sm">
                    {icon}
                </span>
            </div>

            <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    {title}
                </p>

                <p className="text-sm font-bold text-slate-700">
                    {text}
                </p>

                {subText && (
                    <p className="text-xs text-slate-500">
                        {subText}
                    </p>
                )}
            </div>
        </div>
    );
}