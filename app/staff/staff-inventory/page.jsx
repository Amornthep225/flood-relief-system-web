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
    },
    user: {
        name: "คุณ อมรเทพ ถายะ",
        image: "https://ui-avatars.com/api/?name=PA&background=0284c7&color=fff",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
        role: "หน่วยประสานงานกู้ภัย",
    },
    hotline: "1784",
    warehouses: [
        "โรงเรียนเทศบาล 1 (วัดพรหมวิหาร)",
        "หอประชุมอำเภอแม่สาย",
        "วัดพระธาตุดอยเวา",
        "จุดพักพิงชั่วคราว อบต.เวียงพางคำ",
    ],

    summary: {
        total: "1,240",
        urgent: "3",
    },

    tabs: ["ทั้งหมด", "อาหาร/น้ำ", "เวชภัณฑ์", "ของใช้จำเป็น"],

    items: [
        {
            name: "ชุดปฐมพยาบาล",
            category: "เวชภัณฑ์",
            icon: "medical_services",
            amount: "12",
            unit: "ชุด",
            status: "วิกฤต",
            cardStyle: "border-2 border-red-100",
            iconStyle: "bg-red-50 text-red-500",
            amountStyle: "text-red-600",
            badgeStyle: "bg-red-100 text-red-600 animate-pulse",
        },
        {
            name: "ข้าวสาร (5 กก.)",
            category: "อาหารแห้ง",
            icon: "rice_bowl",
            amount: "45",
            unit: "ถุง",
            status: "ใกล้หมด",
            cardStyle: "border border-orange-100",
            iconStyle: "bg-orange-50 text-orange-500",
            amountStyle: "text-orange-500",
            badgeStyle: "bg-orange-100 text-orange-600",
        },
        {
            name: "น้ำดื่ม (แพ็ค)",
            category: "น้ำดื่ม",
            icon: "water_drop",
            amount: "850",
            unit: "แพ็ค",
            status: "เพียงพอ",
            cardStyle: "border border-slate-100 opacity-90 hover:opacity-100",
            iconStyle: "bg-sky-50 text-sky-500",
            amountStyle: "text-sky-600",
            badgeStyle: "bg-green-100 text-green-600",
        },
        {
            name: "เสื้อผ้า (รวม)",
            category: "เครื่องนุ่งห่ม",
            icon: "checkroom",
            amount: "320",
            unit: "ชุด",
            status: "เพียงพอ",
            cardStyle: "border border-slate-100 opacity-90 hover:opacity-100",
            iconStyle: "bg-sky-50 text-sky-500",
            amountStyle: "text-sky-600",
            badgeStyle: "bg-green-100 text-green-600",
        },
        {
            name: "สบู่/ยาสระผม",
            category: "ของใช้",
            icon: "soap",
            amount: "400",
            unit: "ชุด",
            status: "เพียงพอ",
            cardStyle: "border border-slate-100 opacity-90 hover:opacity-100",
            iconStyle: "bg-sky-50 text-sky-500",
            amountStyle: "text-sky-600",
            badgeStyle: "bg-green-100 text-green-600",
        },
    ],
};

export default function StaffInventoryPage() {
    const [activeTab, setActiveTab] = useState("ทั้งหมด");
    const [searchText, setSearchText] = useState("");

    const filteredItems = mockData.items.filter((item) => {
        const matchSearch = item.name
            .toLowerCase()
            .includes(searchText.toLowerCase());

        if (activeTab === "ทั้งหมด") return matchSearch;

        if (activeTab === "อาหาร/น้ำ") {
            return (
                matchSearch &&
                (item.category.includes("อาหาร") || item.category.includes("น้ำ"))
            );
        }

        if (activeTab === "เวชภัณฑ์") {
            return matchSearch && item.category.includes("เวชภัณฑ์");
        }

        if (activeTab === "ของใช้จำเป็น") {
            return (
                matchSearch &&
                (item.category.includes("ของใช้") ||
                    item.category.includes("เครื่องนุ่งห่ม"))
            );
        }

        return matchSearch;
    });

    return (
        <div className={`relative min-h-screen flex flex-col font-sans ${colors.staffInventory.page}`}>
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
                <div className="mb-6">
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

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div className="w-full md:w-auto">
                        <h1 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sky-600">
                                warehouse
                            </span>
                            ตรวจสอบคลังสินค้า
                        </h1>

                        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex flex-col w-full md:w-[350px]">
                            <label className="text-[10px] text-slate-400 font-bold uppercase px-3 pt-1">
                                เลือกคลังสินค้า / ศูนย์พักพิง
                            </label>

                            <div className="relative">
                                <select className="w-full appearance-none bg-transparent text-slate-800 font-bold text-lg py-1 pl-3 pr-10 focus:outline-none cursor-pointer">
                                    {mockData.warehouses.map((warehouse, index) => (
                                        <option key={warehouse} value={index + 1}>
                                            {warehouse}
                                        </option>
                                    ))}
                                </select>

                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined text-sm">
                                        expand_more
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className={`${cards.staffInventoryStat} bg-white border-slate-100`}>
                            <p className="text-xs text-slate-400 font-bold uppercase">
                                สิ่งของทั้งหมด
                            </p>
                            <p className="text-xl font-bold text-slate-800">
                                {mockData.summary.total}
                                <span className="text-xs font-normal text-slate-400 ml-1">
                                    ชิ้น
                                </span>
                            </p>
                        </div>

                        <div className={`${cards.staffInventoryStat} bg-red-50 border-red-100`}>
                            <p className="text-xs text-red-400 font-bold uppercase">
                                ต้องเติมด่วน
                            </p>
                            <p className="text-xl font-bold text-red-600">
                                {mockData.summary.urgent}
                                <span className="text-xs font-normal text-red-400 ml-1">
                                    รายการ
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className={cards.staffInventory.filter}>
                    <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto p-1">
                        {mockData.tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${buttons.staffInventory.tab} ${activeTab === tab
                                    ? buttons.staffInventory.tabActive
                                    : buttons.staffInventory.tabInactive
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-grow">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                            search
                        </span>

                        <input
                            type="text"
                            placeholder="ค้นหาสิ่งของ..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                        />
                    </div>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item.name}
                            className={`${cards.staffInventory.card} ${item.cardStyle}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3">
                                    <div
                                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${item.iconStyle}`}
                                    >
                                        <span className="material-symbols-outlined text-3xl">
                                            {item.icon}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            {item.category}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${item.badgeStyle}`}
                                >
                                    {item.status}
                                </span>
                            </div>

                            <div className="flex items-end gap-2">
                                <span className={`text-4xl font-black ${item.amountStyle}`}>
                                    {item.amount}
                                </span>
                                <span className="text-sm font-bold text-slate-400 mb-1.5">
                                    {item.unit}
                                </span>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}