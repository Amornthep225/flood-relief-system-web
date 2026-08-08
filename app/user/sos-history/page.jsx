import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
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

    summary: {
        totalRequests: 3,
        completedRequests: 2,
    },

    requests: [
        {
            id: "SOS-2026-8942",
            title: "ขออาหารและยารักษาโรค",
            status: "processing",
            date: "วันนี้, 10:20 น.",
            bags: "4 ถุง",
            categories: ["อาหาร/น้ำ", "ยา"],
        },

        {
            id: "SOS-2025-9988",
            title: "ขอเสบียงอาหารแห้ง",
            status: "success",
            date: "12 ธ.ค. 68",
            bags: "2 ถุง",
            categories: ["อาหาร"],
        },
    ],
};

export default function HistoryPage() {
    return (
        <div className={`min-h-screen flex flex-col ${colors.history.page}`}>
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

            <main className="max-w-5xl mx-auto px-6 py-8 pb-20 w-full">
                <div className="mb-8">

                    <h1 className="text-2xl font-bold text-slate-800 mb-6">
                        ประวัติการขอความช่วยเหลือ
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className={cards.userSosHistory.summaryPrimary}>
                            <p className="text-orange-100 text-sm mb-1">
                                ขอความช่วยเหลือรวม
                            </p>

                            <h2 className="text-3xl font-bold">
                                {mockData.summary.totalRequests} ครั้ง
                            </h2>
                        </div>

                        <div className={cards.userSosHistory.summary}>
                            <p className="text-white text-sm mb-1">
                                ได้รับความช่วยเหลือแล้ว
                            </p>

                            <h2 className="text-3xl font-bold text-white">
                                {mockData.summary.completedRequests}
                                <span className="text-sm font-normal text-white ml-1">
                                    ครั้ง
                                </span>
                            </h2>   
                        </div>
                    </div>

                    <div className="flex gap-2 border-b border-slate-200 pb-1 overflow-x-auto mb-6">
                        <button className="px-4 py-2 text-sky-600 border-b-2 border-sky-600 font-bold text-sm">
                            ทั้งหมด
                        </button>

                        <button className="px-4 py-2 text-slate-500 text-sm">
                            กำลังดำเนินการ (1)
                        </button>

                        <button className="px-4 py-2 text-slate-500 text-sm">
                            เสร็จสิ้น (2)
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {mockData.requests.map((item) => (
                        <div key={item.id} className={cards.userSosHistory.card}>
                            <div
                                className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status === "processing"
                                        ? "bg-sky-500"
                                        : "bg-green-500"
                                    }`}
                            />

                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.status === "processing"
                                                ? "bg-sky-50 text-sky-600"
                                                : "bg-green-50 text-green-600"
                                            }`}
                                    >
                                        <span className="material-symbols-outlined">
                                            {item.status === "processing"
                                                ? "local_shipping"
                                                : "check_circle"}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-800 text-lg">
                                                {item.title}
                                            </h3>

                                            {item.status === "processing" ? (
                                                <span className="bg-sky-100 text-sky-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                                                    กำลังช่วยเหลือ
                                                </span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                                                    สำเร็จแล้ว
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-slate-500 mb-2">
                                            รหัส:
                                            <span className="font-mono font-bold ml-1">
                                                #{item.id}
                                            </span>
                                            {" • "}
                                            {item.date}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {item.categories.map((category) => (
                                                <span
                                                    key={category}
                                                    className={cards.userSosHistory.tag}
                                                >
                                                    {category}
                                                </span>
                                            ))}

                                            <span className={cards.userSosHistory.tag}>
                                                {item.bags}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {item.status === "processing" ? (
                                        <Link
                                            href="/user/tracking"
                                            className={buttons.userSosHistory.tracking}
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                location_on
                                            </span>

                                            ติดตามสถานะ
                                        </Link>
                                    ) : (
                                        <button className={buttons.userSosHistory.detail}>
                                            ดูรายละเอียด
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <button className={buttons.userSosHistory.more}>
                        ดูประวัติย้อนหลังทั้งหมด
                    </button>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">
                        © 2026 Flood Relief Coordination Center
                    </p>

                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                        <a href="#">หน้าหลัก</a>
                        <a href="#">เกี่ยวกับเรา</a>
                        <Link href="/user/chat">
                            ติดต่อสอบถาม
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}