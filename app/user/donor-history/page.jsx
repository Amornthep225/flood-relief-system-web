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
        tracking: "/user/donor-tracking",
    },

    summary: {
        totalDonations: 5,
        totalItems: 42,
    },

    donations: [
        {
            id: "DON-2026-8821",
            title: "บริจาคน้ำดื่มและข้าวสาร",
            status: "processing",
            date: "1 ก.พ. 69, 14:05 น.",
            icon: "local_shipping",
            items: [
                { name: "น้ำดื่ม x12", icon: "water_drop", color: "text-sky-400" },
                { name: "ข้าวสาร x2", icon: "rice_bowl", color: "text-orange-400" },
            ],
        },
        {
            id: "DON-2026-8100",
            title: "บริจาคเสื้อผ้าและผ้าห่ม",
            status: "success",
            date: "28 ม.ค. 69",
            icon: "check",
            items: [
                { name: "เสื้อผ้า x20", icon: "checkroom", color: "text-purple-400" },
                { name: "ผ้าห่ม x5", icon: "bed", color: "text-indigo-400" },
            ],
        },
        {
            id: "DON-2026-7542",
            title: "บริจาคยารักษาโรค",
            status: "success",
            date: "15 ม.ค. 69",
            icon: "check",
            items: [
                {
                    name: "ชุดยาสามัญ x3",
                    icon: "medical_services",
                    color: "text-red-400",
                },
            ],
        },
    ],
};

export default function DonationHistoryPage() {
    return (
        <div className={`min-h-screen flex flex-col ${colors.donationHistory.page}`}>
            <UserNavbar
                user={mockData.user}
                theme={theme}
                hotline={mockData.hotline}
                notificationCount={3}
                homeHref="/user/sos-home"
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
            <main className="max-w-5xl mx-auto px-6 py-8 pb-20 w-full">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 mb-6">
                        ประวัติการบริจาคของคุณ
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className={cards.donorHistory.summaryPrimary}>
                            <p className="text-sky-100 text-sm mb-1">บริจาคไปแล้ว</p>
                            <h2 className="text-3xl font-bold">
                                {mockData.summary.totalDonations} ครั้ง
                            </h2>
                        </div>

                        <div className={cards.donorHistory.summary}>
                            <p className="text-sky-100 text-sm mb-1">สิ่งของรวม</p>
                            <h2 className="text-3xl font-bold">
                                {mockData.summary.totalItems}
                                <span className="text-sm font-normal text-sky-100 ml-1">
                                    ชิ้น
                                </span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
                        <button className="px-4 py-2 text-sky-600 border-b-2 border-sky-600 font-bold text-sm">
                            ทั้งหมด
                        </button>

                        <button className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium text-sm">
                            กำลังดำเนินการ (1)
                        </button>

                        <button className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium text-sm">
                            เสร็จสิ้น (4)
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {mockData.donations.map((item) => {
                        const isProcessing = item.status === "processing";

                        return (
                            <div key={item.id} className={cards.donorHistory.card}>
                                <div
                                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${isProcessing ? "bg-sky-500" : "bg-green-500"
                                        }`}
                                />

                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isProcessing
                                                ? "bg-sky-50 text-sky-600"
                                                : "bg-green-50 text-green-600"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">
                                                {item.icon}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-slate-800 text-lg">
                                                    {item.title}
                                                </h3>

                                                <span
                                                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isProcessing
                                                        ? "bg-sky-100 text-sky-700"
                                                        : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {isProcessing ? "กำลังจัดส่ง" : "ถึงมือผู้รับแล้ว"}
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-500 mb-2">
                                                รหัส: #{item.id} • {item.date}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {item.items.map((donatedItem) => (
                                                    <span
                                                        key={donatedItem.name}
                                                        className={cards.donorHistory.tag}
                                                    >
                                                        <span
                                                            className={`material-symbols-outlined text-sm ${donatedItem.color}`}
                                                        >
                                                            {donatedItem.icon}
                                                        </span>
                                                        {donatedItem.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        {isProcessing ? (
                                            <Link
                                                href={mockData.links.tracking}
                                                className={buttons.donorHistory.tracking}
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    location_on
                                                </span>
                                                ติดตามสถานะ
                                            </Link>
                                        ) : (
                                            <button className={buttons.donorHistory.detail}>
                                                ดูรายละเอียด
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-8">
                    <button className={buttons.donorHistory.more}>
                        ดูประวัติทั้งหมด
                    </button>
                </div>
            </main>
        </div>
    );
}