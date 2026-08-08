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
        home: "/",
        donateForm: "/user/donor-form",
        lowProducts: "/user/donor-low-products",
        donationTracking: "/user/donor-tracking",
        donationHistory: "/user/donor/history",
        notifications: "/user/donor/notifications",
    },

    notifications: [
        {
            id: 1,
            type: "success",
            title: "ของถึงมือผู้รับแล้ว!",
            detail:
                "รายการบริจาค #DON-8821 ถูกส่งมอบให้ศูนย์พักพิงวัดดอนเรียบร้อยแล้ว",
            time: "เมื่อสักครู่",
            icon: "check_circle",
        },
        {
            id: 2,
            type: "shipping",
            title: "กำลังดำเนินการจัดส่ง",
            detail: "เจ้าหน้าที่ได้รับของบริจาคแล้ว กำลังเดินทางไปยังพื้นที่",
            time: "2 ชั่วโมงที่แล้ว",
            icon: "local_shipping",
        },
    ],

    menu: [
        {
            title: "รายการของที่กำลังขาดแคลน",
            description:
                "สิ่งของอุปโภคบริโภคที่มีความจำเป็นเร่งด่วนในพื้นที่ประสบภัยขณะนี้",
            icon: "inventory_2",
            iconBox: "bg-orange-100 text-orange-600",
            href: "/user/donor-low-products",
            actionText: "ดูรายการทั้งหมด",
        },
        {
            title: "ดูรหัสการบริจาค",
            description:
                "ตรวจสอบสถานะสิ่งของที่คุณบริจาคและการส่งมอบแบบเรียลไทม์",
            icon: "package_2",
            iconBox: "bg-green-100 text-green-600",
            href: "/user/donor-tracking",
            actionText: "ดูรายละเอียด",
        },
        {
            title: "ประวัติการบริจาค",
            description:
                "ตรวจสอบรายการที่คุณเคยบริจาคและสถานะการส่งมอบ",
            icon: "history",
            iconBox: "bg-blue-100 text-blue-600",
            href: "/user/donor-history",
            actionText: "ดูประวัติทั้งหมด",
        },
    ],
};

export default function DonorHomePage() {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    const toggleNotifications = () => {
        setIsNotificationOpen((prev) => !prev);
        setHasUnread(false);
    };

    return (
        <div className={`min-h-screen flex flex-col relative ${colors.donor.page}`}>
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
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:py-12 flex flex-col justify-center">
                <section className={cards.donorHome.hero}>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-white text-center md:text-left">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl md:text-5xl font-black mb-4">
                                สวัสดีครับ, {mockData.user.name}
                            </h1>

                            <p className="text-blue-100 text-lg md:text-xl leading-relaxed">
                                ขอบคุณสำหรับการร่วมเป็นส่วนหนึ่งของการช่วยเหลือผู้ประสบภัยน้ำท่วม
                                น้ำใจของคุณช่วยให้ผู้คนก้าวผ่านวิกฤตนี้ไปด้วยกัน
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <Link
                                href={mockData.links.donateForm}
                                className={buttons.donorHome.primary}
                            >
                                <span className="material-symbols-outlined text-2xl">
                                    volunteer_activism
                                </span>
                                เริ่มบริจาคตอนนี้
                            </Link>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none flex items-center justify-end pr-8">
                        <span className="material-symbols-outlined text-[240px] leading-none">
                            water_drop
                        </span>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mockData.menu.map((item) => (
                        <Link key={item.href} href={item.href} className={cards.donorHome.menu}>
                            <div
                                className={`size-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${item.iconBox}`}
                            >
                                <span className="material-symbols-outlined text-5xl">
                                    {item.icon}
                                </span>
                            </div>

                            <h3 className={`${colors.donor.primaryText} text-2xl font-extrabold mb-3`}>
                                {item.title}
                            </h3>

                            <p className={`${colors.donor.secondaryText} text-base mb-6 leading-relaxed`}>
                                {item.description}
                            </p>

                            <div className="mt-auto flex items-center text-sky-500 font-bold text-base">
                                {item.actionText}
                                <span className="material-symbols-outlined ml-2 text-xl">
                                    arrow_forward
                                </span>
                            </div>
                        </Link>
                    ))}
                </section>
            </main>

            <footer className="w-full py-8 border-t border-blue-100 bg-white/40 mt-auto relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-[#475569] text-sm font-medium">
                        <span className="material-symbols-outlined text-sm text-green-500">
                            check_circle
                        </span>
                        ระบบสถานะ: ปกติ (Active) | อัปเดตข้อมูลล่าสุด: 5 นาทีที่แล้ว
                    </div>

                    <div className="flex items-center gap-8">
                        <a
                            className="text-xs font-bold text-[#475569] hover:text-sky-500 transition-colors uppercase"
                            href="#"
                        >
                            ความช่วยเหลือ
                        </a>

                        <a
                            className="text-xs font-bold text-[#475569] hover:text-sky-500 transition-colors uppercase"
                            href="#"
                        >
                            นโยบายความเป็นส่วนตัว
                        </a>

                        <a
                            className="text-xs font-bold text-[#475569] hover:text-sky-500 transition-colors uppercase"
                            href="#"
                        >
                            ติดต่อเรา
                        </a>
                    </div>

                    <div className="flex gap-4">
                        <a
                            className="size-9 rounded-full bg-white/80 flex items-center justify-center text-[#475569] hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-lg">
                                share
                            </span>
                        </a>

                        <a
                            className="size-9 rounded-full bg-white/80 flex items-center justify-center text-[#475569] hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-lg">
                                help
                            </span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}