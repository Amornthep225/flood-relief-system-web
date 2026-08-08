"use client";

import Link from "next/link";
import UserLayout from "@/components/layout/UserLayout";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";

const theme = colors.role;

const menu = [
    {
        title: "ขอรับของบริจาค",
        description:
            "สำหรับผู้ประสบภัยที่ต้องการอาหาร น้ำ ยา เสื้อผ้า หรือสิ่งของช่วยเหลือจากศูนย์",
        icon: "inventory_2",
        buttonIcon: "shopping_bag",
        buttonText: "ขอรับสิ่งของ",
        href: "/user/sos-home",
        type: "relief",
        note: "เลือกสิ่งของที่ต้องการและติดตามสถานะได้",
    },
    {
        title: "SOS ฉุกเฉิน",
        description:
            "สำหรับเหตุฉุกเฉินที่ต้องการให้เจ้าหน้าที่เข้าช่วยเหลือทันที เช่น ติดอยู่ในพื้นที่น้ำท่วม ผู้บาดเจ็บ หรือขออพยพ",
        icon: "sos",
        buttonIcon: "emergency",
        buttonText: "แจ้ง SOS",
        href: "/user/emergency-sos-form",
        type: "emergency",
        note: "ปักหมุดตำแหน่งเพื่อส่งเคสไปยังเจ้าหน้าที่",
    },
    {
        title: "ต้องการร่วมบริจาค?",
        description:
            "สำหรับผู้ที่ประสงค์จะบริจาคสิ่งของ เงินทุน หรือสนับสนุนเครื่องมือช่วยเหลือต่าง ๆ",
        icon: "volunteer_activism",
        buttonIcon: "favorite",
        buttonText: "เริ่มการบริจาค",
        href: "/user/donor-home",
        type: "donation",
        note: "ร่วมเป็นส่วนหนึ่งของการส่งต่อกำลังใจ",
    },
];

function getCardConfig(type) {
    if (type === "emergency") {
        return {
            card: "border-red-200 hover:border-red-300",
            iconBg: "bg-red-50",
            iconColor: "text-red-500",
            button: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200",
            note: "text-red-500",
        };
    }

    if (type === "relief") {
        return {
            card: "border-sky-200 hover:border-sky-300",
            iconBg: "bg-sky-50",
            iconColor: "text-sky-500",
            button: buttons.selectRole.emergency,
            note: "text-sky-600",
        };
    }

    return {
        card: cards.selectRole.donation,
        iconBg: theme.donationBg,
        iconColor: theme.donationText,
        button: buttons.selectRole.donation,
        note: theme.donationText,
    };
}

export default function SelectRolePage() {
    return (
        <UserLayout
            homeHref="/user/sos-home"
            backHref="/select-role"
            logoutHref="/user/users-login"
            showHome={false}
            showBack={false}
        >
            <main className="flex-1 flex items-center justify-center p-6 md:p-10">
                <div className="max-w-7xl w-full">
                    <div className="text-center mb-10">
                        <h1
                            className={`${theme.primaryText} text-4xl md:text-5xl font-black mb-4 tracking-tight`}
                        >
                            กรุณาเลือกประเภทการใช้งาน
                        </h1>
                        <p className={`${theme.secondaryText} text-lg font-medium`}>
                            เลือกบริการให้ตรงกับสถานการณ์ เพื่อให้ระบบประสานความช่วยเหลือได้รวดเร็วที่สุด
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {menu.map((item) => {
                            const config = getCardConfig(item.type);

                            return (
                                <div
                                    key={item.href}
                                    className={`${cards.selectRole.roleBase} ${config.card} min-h-[570px] px-7`}
                                >
                                    <div className={`${cards.selectRole.icon} ${config.iconBg}`}>
                                        <span
                                            className={`material-symbols-outlined text-6xl ${config.iconColor}`}
                                        >
                                            {item.icon}
                                        </span>
                                    </div>

                                    <h2
                                        className={`${theme.primaryText} text-2xl md:text-3xl font-black mb-4 text-center`}
                                    >
                                        {item.title}
                                    </h2>

                                    <p
                                        className={`${theme.secondaryText} text-base mb-10 max-w-sm leading-relaxed font-medium text-center`}
                                    >
                                        {item.description}
                                    </p>

                                    <Link
                                        href={item.href}
                                        className={`w-full max-w-72 h-14 rounded-xl ${config.button} text-lg font-bold flex items-center justify-center gap-2 transition-colors`}
                                    >
                                        <span className="material-symbols-outlined text-[22px]">
                                            {item.buttonIcon}
                                        </span>
                                        {item.buttonText}
                                    </Link>

                                    <div
                                        className={`mt-8 font-bold text-sm flex items-center justify-center text-center gap-2 ${config.note}`}
                                    >
                                        {item.type === "emergency" && (
                                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-500" />
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                                            </span>
                                        )}
                                        {item.note}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </UserLayout>
    );
}
