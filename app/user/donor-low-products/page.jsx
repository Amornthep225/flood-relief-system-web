"use client";

import { useState } from "react";
import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import UserNavbar from "@/components/user/user-navbar";
const theme = colors.role;
const mockData = {
    user: {
        name: "คุณ อมรเทพ ถายะ",
        image: "https://ui-avatars.com/api/?name=PA&background=0284c7&color=fff",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
        level: "ผู้บริจาคระดับ GOLD",
    },

    links: {
        home: "/user/donor-home",
        donate: "/user/donor-form",
    },

    centers: [
        { value: "all", label: "ทั้งหมด (ทุกศูนย์)" },
        { value: "center1", label: "ศูนย์พักพิงวัดดอน (ดอนเมือง)" },
        { value: "center2", label: "ศูนย์ช่วยเหลือแม่สาย (เชียงราย)" },
        { value: "center3", label: "โรงเรียนเทศบาล 1 (อุบลฯ)" },
    ],

    products: [
        {
            id: 1,
            center: "center2",
            name: "น้ำดื่มสะอาด",
            unit: "แพ็ค",
            icon: "water_drop",
            iconBox: "bg-red-50 text-red-400",
            received: 120,
            missing: 380,
            target: 500,
            progress: 24,
            progressColor: "bg-red-500",
            missingColor: "text-red-500",
            button:
                "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
            urgent: true,
        },
        {
            id: 2,
            center: "center1",
            name: "ข้าวสาร",
            unit: "ถุง (5กก.)",
            icon: "rice_bowl",
            iconBox: "bg-orange-50 text-orange-400",
            received: 45,
            missing: 55,
            target: 100,
            progress: 45,
            progressColor: "bg-orange-400",
            missingColor: "text-orange-500",
            button:
                "bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50",
        },
        {
            id: 3,
            center: "center1",
            name: "เสื้อผ้า",
            unit: "ชุด",
            icon: "checkroom",
            iconBox: "bg-sky-50 text-sky-400",
            received: 180,
            missing: 20,
            target: 200,
            progress: 90,
            progressColor: "bg-sky-500",
            missingColor: "text-sky-500",
            button:
                "bg-white border-2 border-sky-500 text-sky-500 hover:bg-sky-50",
        },
        {
            id: 4,
            center: "all",
            name: "ชุดปฐมพยาบาล",
            unit: "ชุด",
            icon: "medical_services",
            iconBox: "bg-teal-50 text-teal-500",
            received: 10,
            missing: 90,
            target: 100,
            progress: 10,
            progressColor: "bg-teal-500",
            missingColor: "text-teal-600",
            button:
                "bg-white border-2 border-teal-500 text-teal-600 hover:bg-teal-50",
        },
        {
            id: 5,
            center: "all",
            name: "อื่นๆ (ทั่วไป)",
            unit: "ไม่จำกัด",
            icon: "inventory_2",
            iconBox:
                "bg-slate-100 text-slate-400 border-2 border-slate-200 border-dashed",
            description:
                "ผ้าอนามัย, ทิชชู่, ของใช้เด็กเล็ก หรืออุปกรณ์ทำความสะอาด",
            button: "bg-slate-800 text-white hover:bg-slate-700 shadow-md",
            isOther: true,
        },
    ],
};

export default function LowProductsPage() {
    const [selectedCenter, setSelectedCenter] = useState("all");

    const filteredProducts = mockData.products.filter(
        (item) =>
            selectedCenter === "all" ||
            item.center === "all" ||
            item.center === selectedCenter
    );

    return (
        <div className={`min-h-screen flex flex-col ${colors.lowProducts.page}`}>
            <UserNavbar
                user={mockData.user}
                theme={theme}
                hotline={mockData.hotline}
                notificationCount={3}
                homeHref="/user/sos-home"
                backHref="/user/donor-home"
                logoutHref="/user/users-login"
                options={{
                    back: true,
                    home: false,
                    logout: true,
                    notification: true,
                    profile: true,
                    hotlineButton: true,
                }}
            />
            <main className="max-w-7xl mx-auto px-6 py-8 pb-20 w-full">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div className="w-full md:w-auto">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500">
                                inventory_2
                            </span>
                            สิ่งของที่ขาดแคลน
                        </h1>

                        <p className="text-slate-500 mb-4">
                            เลือกศูนย์รับบริจาคเพื่อดูความต้องการในพื้นที่นั้น
                        </p>

                        <div className="relative w-full md:w-80">
                            <select
                                value={selectedCenter}
                                onChange={(e) => setSelectedCenter(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-medium cursor-pointer shadow-sm hover:border-sky-400 transition-colors"
                            >
                                {mockData.centers.map((center) => (
                                    <option key={center.value} value={center.value}>
                                        {center.label}
                                    </option>
                                ))}
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                <span className="material-symbols-outlined text-sm">
                                    expand_more
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                        <button className={buttons.donorLowProducts.filterActive}>ทั้งหมด</button>
                        <button className={buttons.donorLowProducts.filter}>อาหาร/น้ำ</button>
                        <button className={buttons.donorLowProducts.filter}>ยารักษาโรค</button>
                    </div>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((item) => (
                        <div key={item.id} className={cards.donorLowProducts.card}>
                            {item.urgent && (
                                <div className="absolute top-3 right-3 text-red-500 animate-pulse">
                                    <span className="material-symbols-outlined text-[10px]">
                                        circle
                                    </span>
                                </div>
                            )}

                            <div className={`${cards.donorLowProducts.image} ${item.iconBox}`}>
                                <span className="material-symbols-outlined text-6xl group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </span>
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-800">
                                    {item.name}
                                </h3>

                                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-bold">
                                    {item.unit}
                                </span>
                            </div>

                            {item.isOther ? (
                                <>
                                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto">
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm">
                                                <span className="material-symbols-outlined text-sm">
                                                    volunteer_activism
                                                </span>
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold text-slate-600">
                                                    รับบริจาคตลอด
                                                </p>
                                                <p className="text-[10px] text-slate-400">
                                                    เพื่อสำรองในคลังกลาง
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={mockData.links.donate}
                                            className={`${buttons.donorLowProducts.primary} ${item.button}`}
                                        >
                                            บริจาคสิ่งของอื่นๆ
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500">
                                                ได้รับแล้ว:{" "}
                                                <b className="text-sky-600">{item.received}</b>
                                            </span>

                                            <span className={`font-bold ${item.missingColor}`}>
                                                ขาดอีก: {item.missing}
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className={`${item.progressColor} h-2.5 rounded-full`}
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>

                                        <p className="text-[10px] text-slate-400 mt-1 text-right">
                                            เป้าหมาย: {item.target} {item.unit}
                                        </p>
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            href={mockData.links.donate}
                                            className={`${buttons.donorLowProducts.primary} ${item.button}`}
                                        >
                                            บริจาครายการนี้
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}