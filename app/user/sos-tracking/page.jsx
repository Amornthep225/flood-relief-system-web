import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import UserNavbar from "@/components/user/user-navbar";
const theme = colors.role;
const mockData = {
    hotline: "1784",

    caseId: "SOS-2026-8942",

    user: {
        name: "คุณ อมรเทพ ถายะ",
        image: "https://ui-avatars.com/api/?name=PA&background=0284c7&color=fff",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
        role: "ผู้ประสบภัย",
    },

    rescueTeam: {
        name: "ทีมกู้ภัยอาสา (ชุดที่ 4)",
        vehicle: "ทะเบียน: 1กข-9999 (เรือท้องแบน)",
        eta: "15 นาที",
    },

    timeline: [
        {
            title: "ส่งคำขอแล้ว",
            detail: "เมื่อ 10:20 น.",
            status: "success",
            icon: "check",
        },

        {
            title: "เจ้าหน้าที่รับเรื่องแล้ว",
            detail: "เมื่อ 10:45 น. — กำลังประสานงานทีมกู้ภัย",
            status: "success",
            icon: "support_agent",
        },

        {
            title: "กำลังเดินทาง (Dispatched)",
            detail: "คาดว่าจะถึงใน 15 นาที",
            status: "active",
            icon: "local_shipping",
        },

        {
            title: "ช่วยเหลือสำเร็จ",
            detail: "รอการยืนยัน",
            status: "pending",
            icon: "flag",
        },
    ],
};

export default function TrackingPage() {
    return (
        <div className={`min-h-screen flex flex-col ${colors.trackingSos.page}`}>
            <UserNavbar
                user={mockData.user}
                theme={theme}
                hotline={mockData.hotline}
                notificationCount={3}
                homeHref="/user/sos-home"
                backHref="/user/sos-home"
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

            <main className="flex-grow flex justify-center px-4 py-8">
                <div className="w-full max-w-lg">
                    <div className={cards.userSosTracking.card}>
                        <Link
                            href={"/user/sos-home"}
                            className="text-slate-400 hover:text-slate-600 text-xs font-medium flex items-center gap-2 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">
                                arrow_back
                            </span>
                            กลับหน้าหลัก
                        </Link>
                        <div className="p-8 text-center border-b border-slate-50 bg-slate-50/50">
                            <h1 className="text-2xl font-bold text-slate-800">
                                สถานะความช่วยเหลือ
                            </h1>

                            <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm mt-2">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">
                                    CASE ID:
                                </span>

                                <span
                                    className={`text-sm font-mono font-bold ${colors.trackingSos.caseId}`}
                                >
                                    #{mockData.caseId}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 relative">
                            <div className="absolute left-[3.25rem] top-10 bottom-10 w-0.5 bg-slate-100" />

                            <div className={cards.userSosTracking.timeline}>
                                {mockData.timeline.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        {item.status === "success" && (
                                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md shrink-0">
                                                <span className="material-symbols-outlined">
                                                    {item.icon}
                                                </span>
                                            </div>
                                        )}

                                        {item.status === "active" && (
                                            <div className="relative w-10 h-10 shrink-0">
                                                <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-25 animate-ping" />

                                                <div className="relative w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg">
                                                    <span className="material-symbols-outlined">
                                                        {item.icon}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {item.status === "pending" && (
                                            <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined">
                                                    {item.icon}
                                                </span>
                                            </div>
                                        )}

                                        <div className="pt-1 flex-1">
                                            <h3
                                                className={`font-bold ${item.status === "active"
                                                    ? "text-sky-600 text-lg"
                                                    : "text-slate-800 text-sm"
                                                    }`}
                                            >
                                                {item.title}
                                            </h3>

                                            <p className="text-xs text-slate-400">
                                                {item.detail}
                                            </p>

                                            {item.status === "active" && (
                                                <div className={cards.userSosTracking.info}>
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border">
                                                        <span className="material-symbols-outlined">
                                                            person
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700">
                                                            {mockData.rescueTeam.name}
                                                        </p>

                                                        <p className="text-[10px] text-slate-400">
                                                            {mockData.rescueTeam.vehicle}
                                                        </p>
                                                    </div>

                                                    <button className={buttons.userSosTracking.call}>
                                                        <span className="material-symbols-outlined text-sm">
                                                            call
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            <p className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sky-500">
                                    map
                                </span>

                                ตำแหน่งและผู้กู้ภัย (Live Map)
                            </p>

                            <div className={cards.userSosTracking.map}>
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                    Map View
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100">
                            <Link
                                href="/user/chat"
                                className={buttons.userSosTracking.contact}
                            >
                                <span className="material-symbols-outlined">
                                    support_agent
                                </span>

                                ติดต่อเจ้าหน้าที่ส่วนกลาง
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}