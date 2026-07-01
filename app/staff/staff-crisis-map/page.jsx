"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

const mockData = {
    summary: {
        critical: 5,
        teams: 8,
    },

    sos: {
        id: "8942",
        title: "ขออพยพด่วน (ผู้ป่วยติดเตียง)",
        location: "บ้านเลขที่ 123 หมู่ 4 ต.แม่สาย",
    },
};

export default function StaffCrisisPage() {
    const [showPopup, setShowPopup] = useState(false);

    const [truckPosition, setTruckPosition] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTruckPosition({
                x: Math.random() * 10 - 5,
                y: Math.random() * 10 - 5,
            });
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`h-screen flex flex-col overflow-hidden ${colors.staffMap.page}`}>
            <nav
                className={`${colors.staffMap.navbar} border-b border-slate-200 shadow-sm shrink-0`}
            >
                <div className="px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Link
                            href="/staff/staff-home"
                            className={buttons.staffMapBack}
                        >
                            <span className="material-symbols-outlined text-sm">
                                arrow_back
                            </span>
                        </Link>

                        <div className="bg-red-500 rounded-lg w-8 h-8 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-sm">
                                map
                            </span>
                        </div>

                        <span className="text-lg font-bold text-slate-800">
                            CRISIS MAP

                            <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">
                                LIVE
                            </span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            ระบบติดตาม: ปกติ
                        </div>

                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="material-symbols-outlined">
                                admin_panel_settings
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative flex-1 overflow-hidden">
                <div className="absolute inset-0 bg-sky-100">
                    <img
                        src="https://via.placeholder.com/1920x1080/e0f2fe/94a3b8?text=Crisis+Map"
                        alt="map"
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>

                {/* SOS */}
                <button
                    onClick={() => setShowPopup(true)}
                    className="absolute top-[40%] left-[45%] z-20"
                >
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />

                    <div className="relative w-8 h-8 bg-red-600 rounded-full border-2 border-white flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm">
                            emergency
                        </span>
                    </div>
                </button>

                {/* Truck */}
                <div
                    className="absolute top-[55%] left-[35%] z-20 transition-all duration-[2000ms]"
                    style={{
                        transform: `translate(${truckPosition.x}px, ${truckPosition.y}px)`,
                    }}
                >
                    <div className="w-10 h-10 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">
                            local_shipping
                        </span>
                    </div>
                </div>

                {/* Shelter */}
                <div className="absolute top-[20%] left-[20%] z-20">
                    <div className="w-10 h-10 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">
                            home
                        </span>
                    </div>
                </div>

                {/* Sidebar */}
                <div className={`absolute top-4 left-4 z-30 ${cards.staffMapSidebar}`}>
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800">
                            ชั้นข้อมูล (Layers)
                        </h2>
                    </div>

                    <div className="p-4">
                        <div className={cards.staffMapSummary}>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white p-2 rounded text-center">
                                    <p className="text-red-500 text-lg font-bold">
                                        {mockData.summary.critical}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        จุดวิกฤต
                                    </p>
                                </div>

                                <div className="bg-white p-2 rounded text-center">
                                    <p className="text-blue-600 text-lg font-bold">
                                        {mockData.summary.teams}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        ทีมลงพื้นที่
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popup */}
                {showPopup && (
                    <div className="absolute top-[40%] left-[45%] z-40 -translate-x-1/2 -translate-y-[110%]">
                        <div className={cards.staffMapPopup}>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="absolute top-2 right-2"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>

                            <div className="p-4">
                                <div className="mb-2">
                                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded">
                                        CRITICAL
                                    </span>
                                </div>

                                <h3 className="font-bold text-sm">
                                    {mockData.sos.title}
                                </h3>

                                <p className="text-xs text-slate-500 mt-1">
                                    {mockData.sos.location}
                                </p>

                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <button className={buttons.staffMapAccept}>
                                        รับงานทันที
                                    </button>

                                    <button className={buttons.staffMapDetail}>
                                        ดูรายละเอียด
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 z-20 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg flex justify-around md:gap-6">
                    <Legend color="bg-red-500" text="วิกฤต" />
                    <Legend color="bg-orange-500" text="แจ้งเตือน" />
                    <Legend color="bg-blue-600" text="ทีมกู้ภัย" />
                    <Legend color="bg-green-500" text="จุดพักพิง" />
                </div>
            </main>
        </div>
    );
}

function Legend({ color, text }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-xs font-bold text-slate-600">
                {text}
            </span>
        </div>
    );
}