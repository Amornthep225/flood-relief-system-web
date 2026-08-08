"use client";

import { useState } from "react";
import Link from "next/link";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";
import UserNavbar from "@/components/user/user-navbar";
const theme = colors.role;
const mockData = {
    hotline: "1784",
    user: {
        name: "คุณ อมรเทพ ถายะ",
        image: "https://ui-avatars.com/api/?name=PA&background=0284c7&color=fff",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
        role: "ผู้ประสบภัย",
    },
    links: {
        home: "/user/sos-home",
        success: "/user/sos-success",
    },
    categories: [
        { id: "food", title: "อาหาร/น้ำ", icon: "restaurant" },
        { id: "medicine", title: "ยารักษาโรค", icon: "medical_services" },
        { id: "clothes", title: "เสื้อผ้า", icon: "checkroom" },
        { id: "other", title: "อื่นๆ", icon: "more_horiz" },
    ],
    items: {
        food: [
            { id: "f1", name: "ข้าวสาร 5 กก.", unit: "ถุง" },
            { id: "f2", name: "ปลากระป๋อง (แพ็ค 10)", unit: "แพ็ค" },
            { id: "f3", name: "บะหมี่กึ่งสำเร็จรูป", unit: "ลัง" },
            { id: "f4", name: "น้ำดื่ม 1.5L (แพ็ค)", unit: "แพ็ค" },
        ],
        medicine: [
            { id: "m1", name: "ชุดยาสามัญประจำบ้าน", unit: "ชุด" },
            { id: "m3", name: "ยาลดไข้ / พารา", unit: "แผง" },
            { id: "m4", name: "ยาแก้น้ำกัดเท้า", unit: "หลอด" },
        ],
        clothes: [
            { id: "c1", name: "เสื้อผ้าผู้ใหญ่", unit: "ชุด" },
            { id: "c2", name: "เสื้อผ้าเด็ก", unit: "ชุด" },
            { id: "c3", name: "ผ้าห่ม / เครื่องนอน", unit: "ผืน" },
        ],
        other: [
            { id: "o1", name: "ถ่านไฟฉาย AA/AAA", unit: "แพ็ค" },
            { id: "o2", name: "ผ้าอ้อมเด็ก", unit: "ห่อ" },
            { id: "o3", name: "ผ้าอนามัย", unit: "ห่อ" },
        ],
    },
};

export default function RequestHelpFormPage() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);

    const toggleCategory = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const toggleItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );

        setQuantities((prev) => ({
            ...prev,
            [id]: prev[id] || 1,
        }));
    };

    const increaseQty = (id) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: (prev[id] || 1) + 1,
        }));
    };

    const decreaseQty = (id) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 1) - 1, 1),
        }));
    };

    return (
        <div className={`relative min-h-screen flex flex-col font-sans ${colors.requestFormSos.page}`}>
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-slate-100 to-transparent" />
            </div>

            <UserNavbar
                            user={mockData.user}
                            theme={theme}
                            hotline={mockData.hotline}
                            notificationCount={3}
                            homeHref="/user/sos-home"
                            backHref="/select-role"
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

            <main className="relative z-10 flex-grow flex justify-center px-4 py-8 pb-20">
                <div className="w-full max-w-3xl">
                    <div className="text-center mb-8">
                        <h1 className={`${colors.requestFormSos.primaryText} text-3xl font-bold mb-2`}>
                            แจ้งความประสงค์ขอรับสิ่งของบรรเทาทุกข์
                        </h1>
                        <p className={colors.requestFormSos.secondaryText}>
                            โปรดระบุรายละเอียดความต้องการเพื่อให้เจ้าหน้าที่เข้าช่วยเหลือได้ตรงจุด
                        </p>
                    </div>
                    <Link
                        href={mockData.links.home}
                        className="text-slate-400 hover:text-slate-600 text-xs font-medium flex items-center gap-2 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">
                            arrow_back
                        </span>
                        กลับหน้าหลัก
                    </Link>
                    <form className={cards.userSosForm.form}>
                        <section className="space-y-4">
                            <SectionTitle number="1" title="เลือกสิ่งของที่ต้องการรับความช่วยเหลือ" />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {mockData.categories.map((category) => {
                                    const selected = selectedCategories.includes(category.id);

                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => toggleCategory(category.id)}
                                            className={`${cards.userSosForm.category} ${selected
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

                                            <span className="font-bold text-slate-700 mb-1 text-sm md:text-base">
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
                                            <div key={categoryId} className={cards.userSosForm.itemGroup}>
                                                <h4 className="font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2 flex items-center gap-2 text-sm">
                                                    <span className="material-symbols-outlined text-sky-500">
                                                        {category?.icon}
                                                    </span>
                                                    ระบุจำนวน {category?.title}
                                                </h4>

                                                <div className="space-y-3">
                                                    {items.map((item) => {
                                                        const checked = selectedItems.includes(item.id);

                                                        return (
                                                            <div key={item.id} className="relative">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleItem(item.id)}
                                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer relative ${checked
                                                                        ? "bg-sky-50 border-sky-500 text-sky-700 rounded-b-none"
                                                                        : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                                                                        }`}
                                                                >
                                                                    <div
                                                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${checked
                                                                            ? "bg-sky-500 border-sky-500"
                                                                            : "border-slate-300"
                                                                            }`}
                                                                    >
                                                                        {checked && (
                                                                            <span className="material-symbols-outlined text-white text-[12px]">
                                                                                check
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <span className="text-sm font-medium flex-grow text-left truncate">
                                                                        {item.name}
                                                                    </span>
                                                                </button>

                                                                {checked && (
                                                                    <div className="flex items-center justify-between px-3 py-2.5 bg-sky-50/50 border border-t-0 border-sky-500 rounded-b-xl -mt-1 pt-3">
                                                                        <div className="flex items-center gap-2 bg-white border border-sky-200 rounded-lg p-0.5 shadow-sm">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => decreaseQty(item.id)}
                                                                                className="w-6 h-6 rounded flex items-center justify-center text-sky-500 hover:bg-sky-100"
                                                                            >
                                                                                -
                                                                            </button>

                                                                            <input
                                                                                type="number"
                                                                                min="1"
                                                                                value={quantities[item.id] || 1}
                                                                                onChange={(e) =>
                                                                                    setQuantities((prev) => ({
                                                                                        ...prev,
                                                                                        [item.id]: Number(e.target.value),
                                                                                    }))
                                                                                }
                                                                                className="w-8 text-center text-xs font-bold text-slate-700 focus:outline-none bg-transparent"
                                                                            />

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => increaseQty(item.id)}
                                                                                className="w-6 h-6 rounded bg-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-200"
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>

                                                                        <span className="text-[10px] text-slate-500 font-bold">
                                                                            {item.unit}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        <section className="space-y-4">
                            <SectionTitle number="2" title="จำนวนชุดถุงยังชีพที่ต้องการ" />

                            <div className="relative max-w-sm">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    inventory_2
                                </span>

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="ระบุจำนวนชุด..."
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700 shadow-sm"
                                    required
                                />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <SectionTitle number="3" title="พิกัดจัดส่ง / ตำแหน่งของท่าน" />

                            <div className="relative h-72 rounded-3xl overflow-hidden border-2 border-slate-100 shadow-sm group">
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xl">
                                    Map View
                                </div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/10">
                                    <span className="material-symbols-outlined text-6xl text-sky-500 drop-shadow-lg mb-4 animate-bounce">
                                        location_on
                                    </span>

                                    <button
                                        type="button"
                                        className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-3.5 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-sky-500">
                                            my_location
                                        </span>
                                        ปักหมุดตำแหน่งปัจจุบัน
                                    </button>
                                </div>
                            </div>
                        </section>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(true)}
                                className={buttons.userSosForm.submit}
                            >
                                <span className="material-symbols-outlined">
                                    send
                                </span>
                                ส่งข้อมูลแจ้งขอความช่วยเหลือ
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-[90%] max-w-md rounded-3xl p-8 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                            <span className="material-symbols-outlined text-5xl">
                                assignment_turned_in
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                            ส่งคำขอรับความช่วยเหลือ?
                        </h3>

                        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                            ข้อมูลพิกัดและรายการสิ่งของจะถูกส่งไปยังศูนย์บริหารจัดการน้ำท่วม
                            เพื่อจัดส่งความช่วยเหลือให้ท่านโดยเร็วที่สุด
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className={buttons.userSosForm.cancel}
                            >
                                ย้อนกลับ
                            </button>

                            <Link href={mockData.links.success} className={buttons.userSosForm.confirm}>
                                ยืนยันส่ง
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SectionTitle({ number, title }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`${colors.requestFormSos.accentBg} ${colors.requestFormSos.accentText} w-8 h-8 rounded-full flex items-center justify-center font-bold`}>
                {number}
            </div>
            <h3 className="text-lg font-bold text-slate-700">{title}</h3>
        </div>
    );
}