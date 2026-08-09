"use client";

import Link from "next/link";
import UserLayout from "@/components/layout/UserLayout";

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
        noteIcon: "info",
    },
    {
        title: "SOS ฉุกเฉิน",
        description:
            "สำหรับเหตุฉุกเฉินที่ต้องการให้เจ้าหน้าที่เข้าช่วยเหลือทันที เช่น ติดอยู่ในพื้นที่น้ำท่วม ผู้บาดเจ็บ หรือขออพยพ",
        icon: "SOS",
        buttonIcon: "emergency",
        buttonText: "แจ้ง SOS",
        href: "/user/emergency-sos-form",
        type: "emergency",
        note: "ปักหมุดตำแหน่งเพื่อส่งเคสไปยังเจ้าหน้าที่",
        noteIcon: "warning",
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
        noteIcon: "groups",
    },
];

function getCardConfig(type) {
    if (type === "emergency") {
        return {
            card:
                "border-red-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,248,248,0.96))] shadow-[0_22px_60px_rgba(239,68,68,0.16)] hover:border-red-300 hover:shadow-[0_28px_70px_rgba(239,68,68,0.22)]",
            innerRing: "ring-red-200/90",
            iconOuter:
                "border-red-200 bg-red-50/80 shadow-[0_12px_32px_rgba(239,68,68,0.16)]",
            iconInner:
                "border-red-200 bg-white text-red-600 shadow-[inset_0_0_18px_rgba(239,68,68,0.08)]",
            divider: "bg-red-200",
            dividerIcon: "bg-white text-red-500 ring-red-100",
            button:
                "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_12px_26px_rgba(239,68,68,0.30)] hover:from-red-600 hover:to-red-700",
            note: "text-red-600",
            noteIcon: "bg-red-50 text-red-500 ring-red-100",
            glow: "bg-red-200/40",
        };
    }

    if (type === "relief") {
        return {
            card:
                "border-sky-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,251,255,0.96))] shadow-[0_22px_60px_rgba(14,165,233,0.13)] hover:border-sky-300 hover:shadow-[0_28px_70px_rgba(14,165,233,0.20)]",
            innerRing: "ring-sky-200/90",
            iconOuter:
                "border-sky-200 bg-sky-50/80 shadow-[0_12px_32px_rgba(14,165,233,0.14)]",
            iconInner:
                "border-sky-200 bg-white text-sky-600 shadow-[inset_0_0_18px_rgba(14,165,233,0.07)]",
            divider: "bg-sky-200",
            dividerIcon: "bg-white text-sky-500 ring-sky-100",
            button:
                "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-[0_12px_26px_rgba(244,63,94,0.25)] hover:from-rose-600 hover:to-red-600",
            note: "text-sky-700",
            noteIcon: "bg-sky-50 text-sky-600 ring-sky-100",
            glow: "bg-sky-200/40",
        };
    }

    return {
        card:
            "border-blue-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,255,0.96))] shadow-[0_22px_60px_rgba(37,99,235,0.13)] hover:border-blue-300 hover:shadow-[0_28px_70px_rgba(37,99,235,0.20)]",
        innerRing: "ring-blue-200/90",
        iconOuter:
            "border-blue-200 bg-blue-50/80 shadow-[0_12px_32px_rgba(37,99,235,0.14)]",
        iconInner:
            "border-blue-200 bg-white text-blue-700 shadow-[inset_0_0_18px_rgba(37,99,235,0.07)]",
        divider: "bg-blue-200",
        dividerIcon: "bg-white text-blue-500 ring-blue-100",
        button:
            "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-[0_12px_26px_rgba(37,99,235,0.25)] hover:from-blue-700 hover:to-sky-700",
        note: "text-blue-700",
        noteIcon: "bg-blue-50 text-blue-600 ring-blue-100",
        glow: "bg-blue-200/40",
    };
}

function CardIcon({ item, config }) {
    return (
        <div className="relative mx-auto mb-7 flex h-36 w-36 items-center justify-center">
            <div
                className={`absolute inset-0 rounded-full blur-2xl ${config.glow}`}
            />

            {item.type === "emergency" && (
                <>
                    <span className="absolute h-32 w-32 animate-ping rounded-full border border-red-200/70 opacity-20" />
                    <span className="absolute h-28 w-28 rounded-full border border-red-100" />
                </>
            )}

            <div
                className={`relative flex h-32 w-32 items-center justify-center rounded-full border ${config.iconOuter}`}
            >
                <div
                    className={`flex h-24 w-24 items-center justify-center rounded-full border ${config.iconInner}`}
                >
                    {item.type === "emergency" ? (
                        <span className="text-3xl font-black tracking-tight">
                            SOS
                        </span>
                    ) : (
                        <span className="material-symbols-outlined text-[46px]">
                            {item.icon}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
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
            <section className="relative isolate overflow-hidden rounded-[38px] px-2 py-8 sm:px-5 md:py-12 lg:px-7">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-white/28 blur-3xl" />
                    <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-sky-100/35 blur-3xl" />
                    <div className="absolute bottom-[-160px] left-1/2 h-80 w-[75%] -translate-x-1/2 rounded-[50%] bg-white/22 blur-3xl" />
                    <div className="absolute left-4 top-8 grid grid-cols-4 gap-2 opacity-25">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <span
                                key={index}
                                className="h-1.5 w-1.5 rounded-full bg-white"
                            />
                        ))}
                    </div>
                    <span className="material-symbols-outlined absolute right-8 top-12 rotate-12 text-4xl text-white/35">
                        favorite
                    </span>
                    <span className="material-symbols-outlined absolute bottom-16 left-10 -rotate-12 text-5xl text-white/25">
                        volunteer_activism
                    </span>
                </div>

                <div className="mx-auto w-full max-w-7xl">
                    <header className="mb-9 text-center md:mb-12">
                        <div className="mb-3 flex items-center justify-center gap-2 text-sky-700/70">
                            <span className="h-px w-12 bg-sky-700/25" />
                            <span className="material-symbols-outlined text-xl">
                                water_drop
                            </span>
                            <span className="h-px w-12 bg-sky-700/25" />
                        </div>

                        <h1 className="text-3xl font-black tracking-tight text-blue-800 sm:text-4xl md:text-5xl lg:text-[54px]">
                            กรุณาเลือกประเภทการใช้งาน
                        </h1>
                        <p className="mx-auto mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-600 sm:text-base md:text-lg">
                            เลือกบริการให้ตรงกับสถานการณ์ เพื่อให้ระบบประสานความช่วยเหลือได้รวดเร็วที่สุด
                        </p>
                    </header>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-7">
                        {menu.map((item) => {
                            const config = getCardConfig(item.type);

                            return (
                                <article
                                    key={item.href}
                                    className={`group relative flex min-h-[610px] flex-col overflow-hidden rounded-[32px] border p-2 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${config.card}`}
                                >
                                    <div
                                        className={`pointer-events-none absolute inset-4 rounded-[26px] ring-1 ring-inset ${config.innerRing}`}
                                    />

                                    <div className="pointer-events-none absolute -right-10 -top-8 h-28 w-28 rounded-full border border-current opacity-[0.04]" />
                                    <div className="pointer-events-none absolute -right-3 top-8 h-16 w-16 rounded-full border border-current opacity-[0.035]" />

                                    <div className="relative flex h-full flex-1 flex-col px-6 pb-7 pt-9 sm:px-8">
                                        <CardIcon item={item} config={config} />

                                        <h2 className="text-center text-2xl font-black leading-tight text-blue-800 md:text-[30px]">
                                            {item.title}
                                        </h2>

                                        <div className="my-5 flex items-center justify-center gap-2">
                                            <span
                                                className={`h-px w-20 ${config.divider}`}
                                            />
                                            <span
                                                className={`flex h-7 w-7 items-center justify-center rounded-full ring-1 ${config.dividerIcon}`}
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    {item.type === "emergency"
                                                        ? "shield"
                                                        : "favorite"}
                                                </span>
                                            </span>
                                            <span
                                                className={`h-px w-20 ${config.divider}`}
                                            />
                                        </div>

                                        <p className="mx-auto min-h-[108px] max-w-sm text-center text-[15px] font-medium leading-7 text-slate-600 sm:text-base">
                                            {item.description}
                                        </p>

                                        <div className="mt-auto pt-7">
                                            <Link
                                                href={item.href}
                                                className={`mx-auto flex h-16 w-full max-w-[310px] items-center justify-center gap-3 rounded-2xl border border-white/70 text-lg font-black transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/60 ${config.button}`}
                                            >
                                                <span className="material-symbols-outlined text-[25px]">
                                                    {item.buttonIcon}
                                                </span>
                                                {item.buttonText}
                                            </Link>

                                            <div
                                                className={`mx-auto mt-7 flex max-w-[310px] items-start justify-center gap-2.5 text-center text-sm font-bold leading-6 ${config.note}`}
                                            >
                                                <span
                                                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ${config.noteIcon}`}
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {item.noteIcon}
                                                    </span>
                                                </span>
                                                <span>{item.note}</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}