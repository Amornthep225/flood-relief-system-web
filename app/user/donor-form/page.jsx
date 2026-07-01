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
    },

    links: {
        home: "/user/donor-home",
        confirm: "/user/donor-confirm",
        map: "/user/donor/map",
    },

    categories: [
        { id: "food", title: "อาหาร/น้ำ", icon: "restaurant" },
        { id: "medicine", title: "ยารักษาโรค", icon: "medical_services" },
        { id: "clothes", title: "เสื้อผ้า", icon: "checkroom" },
        { id: "other", title: "อื่นๆ", icon: "more_horiz" },
    ],

    items: {
        food: [
            { id: "f1", name: "ข้าวสาร 5 กก. (ถุง)" },
            { id: "f2", name: "น้ำดื่มบรรจุขวด 1.5L (แพ็ค)" },
            { id: "f3", name: "บะหมี่กึ่งสำเร็จรูป (กล่อง/ลัง)" },
            { id: "f4", name: "อาหารกระป๋อง (แพ็ค)" },
        ],
        medicine: [
            { id: "m1", name: "ชุดยาสามัญประจำบ้าน (ชุด)" },
            { id: "m2", name: "ชุดปฐมพยาบาลทำแผล (ชุด)" },
            { id: "m3", name: "ยาแก้น้ำกัดเท้า (หลอด)" },
        ],
        clothes: [
            { id: "c1", name: "เสื้อผ้าสภาพดี (ชุด)" },
            { id: "c2", name: "ผ้าห่ม / เครื่องนอน (ผืน)" },
        ],
        other: [
            { id: "o1", name: "ถ่านไฟฉาย AA / AAA (แพ็ค)" },
            { id: "o2", name: "ผ้าอ้อมเด็ก / ผู้ใหญ่ (ห่อ)" },
            { id: "o3", name: "ผ้าอนามัย (ห่อ)" },
            { id: "o4", name: "ไฟฉาย (กระบอก)" },
        ],
    },
};

export default function DonateFormPage() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [quantities, setQuantities] = useState({});

   const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
        prev.includes(id)
            ? prev.filter((item) => item !== id)
            : [...prev, id]
    );
};

const increaseQty = (id) => {
    setQuantities((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
    }));
};

const decreaseQty = (id) => {
    setQuantities((prev) => ({
        ...prev,
        [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
};

const toggleItem = (id) => {
    setQuantities((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) > 0 ? 0 : 1,
    }));
};

    return (
        <div className={`relative min-h-screen flex flex-col font-sans ${colors.donateForm.page}`}>
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-slate-100 to-transparent" />
            </div>

            <UserNavbar
                user={mockData.user}
                theme={theme}
                hotline={mockData.hotline}
                notificationCount={3}
                homeHref="/user/donor-home"
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

            <main className="relative z-10 flex-grow flex justify-center px-4 py-6 pb-20">
                <div className="w-full max-w-3xl">
                    <div className="text-center mb-8 pt-4">
                        <h1 className={`${colors.donateForm.primaryText} text-3xl font-bold mb-2`}>
                            แบบฟอร์มบริจาคสิ่งของ
                        </h1>

                        <p className={colors.donateForm.secondaryText}>
                            Donation Form — ร่วมส่งต่อความช่วยเหลือแก่ผู้ประสบภัย
                        </p>
                    </div>

                    <Link href={mockData.links.home} className={buttons.donorForm.back}>
                        <span className="material-symbols-outlined text-sm">
                            chevron_left
                        </span>
                        ย้อนกลับ
                    </Link>

                    <form className={cards.donorForm.form}>
                        <section className="space-y-4">
                            <SectionTitle
                                number="1"
                                title="เลือกหมวดหมู่สิ่งของบริจาค (เลือกได้มากกว่า 1)"
                            />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {mockData.categories.map((category) => {
                                    const selected = selectedCategories.includes(category.id);

                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => toggleCategory(category.id)}
                                            className={`${cards.donorForm.category} ${selected
                                                ? "border-sky-500 bg-sky-50 shadow-md"
                                                : "border-slate-100"
                                                }`}
                                        >
                                            <div
                                                className={`absolute top-2 right-2 w-6 h-6 bg-sky-500 text-white rounded-full flex items-center justify-center text-xs shadow-sm z-10 transition-transform ${selected ? "scale-100" : "scale-0"
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    check
                                                </span>
                                            </div>

                                            <span
                                                className={`material-symbols-outlined text-3xl mb-3 transition-colors ${selected ? "text-sky-500" : "text-slate-400"
                                                    }`}
                                            >
                                                {category.icon}
                                            </span>

                                            <span className="font-bold text-slate-700 mb-1">
                                                {category.title}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedCategories.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    {selectedCategories.map((categoryId) => {
                                        const category = mockData.categories.find(
                                            (item) => item.id === categoryId
                                        );
                                        const items =
                                            mockData.items[categoryId] || [];

                                        return (
                                            <div key={categoryId} className={cards.donorForm.itemGroup}>
                                                <h4 className="font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sky-500">
                                                        {category?.icon}
                                                    </span>
                                                    ระบุจำนวน {category?.title}
                                                </h4>

                                                <div className="space-y-3">
                                                    {items.map((item) => {
                                                        const qty = quantities[item.id] || 0;
                                                        const selectedItem = qty > 0;

                                                        return (
                                                            <div
                                                                key={item.id}
                                                                onClick={() => toggleItem(item.id)}
                                                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${selectedItem
                                                                    ? "bg-sky-50 border-sky-500 text-sky-700"
                                                                    : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedItem
                                                                            ? "bg-sky-500 border-sky-500"
                                                                            : "border-slate-300"
                                                                            }`}
                                                                    >
                                                                        {selectedItem && (
                                                                            <span className="material-symbols-outlined text-white text-[12px]">
                                                                                check
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <span className="text-sm font-medium text-slate-700">
                                                                        {item.name}
                                                                    </span>
                                                                </div>

                                                                <div
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-1 py-1"
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => decreaseQty(item.id)}
                                                                        className="text-slate-400 hover:text-red-500 w-6 h-6 rounded bg-slate-50"
                                                                    >
                                                                        -
                                                                    </button>

                                                                    <input
                                                                        type="number"
                                                                        value={qty}
                                                                        readOnly
                                                                        className="w-8 text-center bg-transparent text-sm text-slate-500 font-medium p-0 border-none focus:ring-0"
                                                                    />

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => increaseQty(item.id)}
                                                                        className="text-slate-400 hover:text-sky-500 w-6 h-6 rounded bg-slate-50"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {selectedCategories.includes("other") && (
                                <div className="mt-4 border-l-4 border-sky-400 pl-4 py-2 bg-sky-50/50 rounded-r-xl">
                                    <label className="block text-sm font-semibold text-sky-700 mb-2">
                                        ระบุสิ่งของบริจาคเพิ่มเติม (ถ้ามี)
                                    </label>

                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sky-400">
                                            edit_square
                                        </span>

                                        <input
                                            type="text"
                                            placeholder="เช่น อาหารสุนัข, เต็นท์, เครื่องปั่นไฟ..."
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-sky-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-300 text-slate-700 shadow-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="space-y-4 pt-4 border-t border-slate-100">
                            <SectionTitle number="2" title="จุดรับบริจาคส่วนกลาง" small />

                            <div className={cards.donorForm.center}>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="material-symbols-outlined text-6xl text-sky-600">
                                        map
                                    </span>
                                </div>

                                <p className="text-lg font-bold text-slate-800 mb-1">
                                    ศูนย์รับบริจาคทั่วเชียงราย
                                </p>

                                <div className="w-full h-40 bg-slate-200 rounded-xl overflow-hidden relative mb-3 flex items-center justify-center text-slate-400">
                                    Map View Center
                                </div>

                                <Link href={mockData.links.map} className={buttons.donorForm.map}>
                                    เปิดแผนที่นำทาง (Google Maps)
                                </Link>
                            </div>
                        </section>

                        <section className="space-y-4 pt-4 border-t border-slate-100">
                            <SectionTitle
                                number="3"
                                title="แนบรูปภาพสิ่งของที่นำมาบริจาค (Optional)"
                                small
                            />

                            <div className={cards.donorForm.upload }>
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-sky-500">
                                        photo_camera
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 font-medium">
                                    คลิกเพื่อถ่ายรูป หรือ อัปโหลดรูปภาพ
                                </p>
                            </div>
                        </section>

                        <Link href={mockData.links.confirm} className={buttons.donorForm.submit}>
                            <span className="material-symbols-outlined">
                                send
                            </span>
                            ยืนยันข้อมูลการบริจาค
                        </Link>
                    </form>
                </div>
            </main>
        </div>
    );
}

function SectionTitle({
    number,
    title,
    small = false,
}) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <span
                className={`${small ? "w-6 h-6 text-xs" : "w-8 h-8"} rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold`}
            >
                {number}
            </span>

            <h3 className={`${small ? "font-bold" : "text-lg font-bold"} text-slate-700`}>
                {title}
            </h3>
        </div>
    );
}