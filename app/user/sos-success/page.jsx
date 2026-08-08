import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

const mockData = {
    hotline: "1784",

    request: {
        id: "SOS-2026-8942",
        type: "อื่นๆ (Other)",
        detail: "นมเด็ก, ผ้าห่ม, ไฟฉาย",
        location: "บ้านเลขที่ 123 หมู่ 4 ต.แม่สาย จ.เชียงราย",
        coordinate: "(13.7563° N, 100.5018° E)",
        quantity: "4 ถุง",
    },

    links: {
        tracking: "/user/sos-tracking",
        home: "/user/sos-home",
    },
};

export default function RequestSuccessPage() {
    return (
        <div className={`min-h-screen flex flex-col ${colors.success.page}`}>
            <nav className="w-full px-6 py-4 flex justify-between items-center max-w-5xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="bg-sky-500 rounded-lg w-8 h-8 flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-white text-sm">
                            water_drop
                        </span>
                    </div>

                    <span className="text-lg font-bold text-slate-700 tracking-wide">
                        FLOOD RELIEF
                    </span>
                </div>

                <a
                    href={`tel:${mockData.hotline}`}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md shadow-red-500/20 transition-all inline-flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">call</span>
                    สายด่วน {mockData.hotline}
                </a>
            </nav>

            <main className="flex-grow flex justify-center px-4 py-8 pb-20">
                <div className="w-full max-w-lg">
                    <div className={cards.userSosSuccess.card}>
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500" />

                        <div
                            className={`w-24 h-24 ${colors.success.successBg} rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm`}
                        >
                            <span
                                className={`material-symbols-outlined text-6xl ${colors.success.successText}`}
                            >
                                check
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            ส่งคำขอความช่วยเหลือสำเร็จ!
                        </h1>

                        <p className="text-slate-500 text-sm mb-6">
                            เราได้รับข้อมูลของคุณแล้ว
                            เจ้าหน้าที่กำลังตรวจสอบและประสานงานไปยังหน่วยงานในพื้นที่
                        </p>

                        <div className={cards.userSosSuccess.info}>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                                รหัสคำขอของคุณ (Request ID)
                            </p>

                            <div className="flex items-center justify-center gap-2">
                                <span
                                    className={`text-xl font-bold font-mono ${colors.success.requestId}`}
                                >
                                    #{mockData.request.id}
                                </span>

                                <button className="text-slate-400 hover:text-sky-500 transition-colors">
                                    <span className="material-symbols-outlined text-lg">
                                        content_copy
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="text-left space-y-4 mb-8">
                            <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">
                                สรุปข้อมูลที่แจ้ง (Summary)
                            </h3>

                            <SummaryItem
                                icon="category"
                                iconClass="bg-sky-50 text-sky-500"
                                label="ประเภทความช่วยเหลือ"
                                value={mockData.request.type}
                            >
                                <div className="inline-block bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded mt-1 border border-orange-100">
                                    ระบุ: {mockData.request.detail}
                                </div>
                            </SummaryItem>

                            <SummaryItem
                                icon="location_on"
                                iconClass="bg-red-50 text-red-500"
                                label="ตำแหน่งที่แจ้ง"
                                value={mockData.request.location}
                            >
                                <p className="text-[10px] text-slate-400 font-mono">
                                    {mockData.request.coordinate}
                                </p>
                            </SummaryItem>

                            <SummaryItem
                                icon="inventory_2"
                                iconClass="bg-indigo-50 text-indigo-500"
                                label="จำนวนถุงยังชีพ"
                                value={mockData.request.quantity}
                            />
                        </div>

                        <div className="space-y-3">
                            <Link
                                href={mockData.links.tracking}
                                className={buttons.userSosSuccess.tracking}
                            >
                                <span className="material-symbols-outlined">
                                    location_searching
                                </span>
                                ติดตามสถานะคำขอ
                            </Link>

                            <Link
                                href={mockData.links.home}
                                className={buttons.userSosSuccess.home}
                            >
                                <span className="material-symbols-outlined">home</span>
                                กลับสู่หน้าหลัก
                            </Link>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-6 max-w-xs mx-auto">
                        หากสถานการณ์วิกฤตมากขึ้น โปรดโทรสายด่วน 1784 ทันที
                    </p>
                </div>
            </main>
        </div>
    );
}

function SummaryItem({ icon, iconClass, label, value, children }) {
    return (
        <div className={cards.userSosSuccess.summary}>
            <div className={`${cards.userSosSuccess.icon} ${iconClass}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>

            <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-semibold text-slate-700">{value}</p>
                {children}
            </div>
        </div>
    );
}