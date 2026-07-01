import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

const mockData = {
    trackingId: "DON-8821",
    savedTime: "14:30 น.",
    donorName: "คุณสมชาย ใจดี",
    itemCount: "+2 รายการ",

    links: {
        verify: "/staff/staff-verify",
        home: "/staff/staff-home",
    },
};

export default function StaffVerifySuccessPage() {
    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden ${colors.staffVerifySuccess.page}`}
        >
            <div className="absolute inset-0 pointer-events-none">
                <span className="material-symbols-outlined absolute top-10 left-10 text-slate-800 opacity-20 text-5xl">
                    star
                </span>
                <span className="material-symbols-outlined absolute bottom-20 right-10 text-slate-800 opacity-20 text-7xl">
                    inventory_2
                </span>
                <span className="material-symbols-outlined absolute top-1/2 left-5 text-slate-800 opacity-20 text-3xl">
                    circle
                </span>
            </div>

            <div className={cards.staffVerifySuccessCard}>
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                    <span className="material-symbols-outlined text-6xl text-white">
                        check
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">
                    รับเข้าคลังเรียบร้อย!
                </h1>

                <p className="text-slate-400 text-sm mb-8">
                    ข้อมูลของบริจาคและของในคลังถูกอัปเดตเข้าระบบแล้ว
                </p>

                <div className={cards.staffVerifySuccessInfo}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />

                    <div className="flex justify-between items-end mb-4 border-b border-slate-700 pb-3">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                                Tracking ID
                            </p>
                            <p className="text-lg font-mono font-bold text-sky-500 tracking-widest">
                                {mockData.trackingId}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase">
                                เวลาที่บันทึก
                            </p>
                            <p className="text-xs text-slate-300">
                                {mockData.savedTime}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <InfoRow label="ผู้บริจาค" value={mockData.donorName} />

                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">รายการรับเข้า</span>
                            <span className="text-emerald-400 font-bold">
                                {mockData.itemCount}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">สถานะ</span>
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">
                                สมบูรณ์
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link href={mockData.links.verify} className={buttons.staffVerifyNext}>
                        <span className="material-symbols-outlined text-sm align-middle mr-2">
                            qr_code_scanner
                        </span>
                        รับบริจาครายการต่อไป
                    </Link>

                    <Link href={mockData.links.home} className={buttons.staffVerifyHome}>
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="text-white font-medium">{value}</span>
        </div>
    );
}