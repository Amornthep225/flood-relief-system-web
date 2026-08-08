import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import UserNavbar from "@/components/user/user-navbar";
const theme = colors.role;
const mockData = {
    user: {
        name: "คุณ อมรเทพ ถายะ",
        avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },

    donation: {
        trackingId: "DON-8821",

        qrCode:
            "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=DON8821",

        deliveryMethod: "นำส่งด้วยตนเอง",

        location: "ศูนย์พักพิงโรงเรียนเทศบาล 1",

        time: "วันนี้ (14:00 - 16:00 น.)",
    },

    items: [
        {
            icon: "water_drop",
            iconColor: "bg-sky-50 text-sky-500",
            name: "น้ำดื่ม",
            detail: "ขนาด 600ml",
            quantity: "12 แพ็ค",
        },
        {
            icon: "rice_bowl",
            iconColor: "bg-orange-50 text-orange-500",
            name: "ข้าวสาร",
            detail: "ข้าวหอมมะลิ",
            quantity: "2 กระสอบ",
        },
    ],

    links: {
        home: "/user/donor/home",
        tracking: "/user/donor/status",
    },
};

export default function DonationConfirmPage() {
    return (
        <div className={`min-h-screen flex flex-col ${colors.confirmation.page}`}>
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

            <main className="flex-grow flex justify-center px-4 py-6 pb-20">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <div
                            className={`w-16 h-16 ${colors.confirmation.successBg} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/30`}
                        >
                            <span className="material-symbols-outlined text-3xl text-white">
                                check
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-800">
                            ลงทะเบียนบริจาคสำเร็จ!
                        </h1>

                        <p className="text-slate-500 text-sm">
                            ขอบคุณสำหรับน้ำใจของท่าน
                        </p>
                    </div>

                    <div className={cards.donorSuccess.ticket}>
                        <div className={cards.donorSuccess.header}>
                            <h2 className="text-slate-300 font-medium text-sm mb-4 uppercase tracking-wider">
                                รหัสอ้างอิงการบริจาค (Tracking ID)
                            </h2>

                            <div className="bg-white p-3 rounded-2xl shadow-sm inline-block mb-4">
                                <img
                                    src={mockData.donation.qrCode}
                                    alt="QR Code"
                                    className="w-28 h-28"
                                />
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 w-full max-w-[240px] mx-auto">
                                <span className="text-3xl font-mono font-bold text-white tracking-widest block">
                                    {mockData.donation.trackingId}
                                </span>
                            </div>

                            <div className="mt-5 flex items-start justify-center gap-2 text-xs bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                                <span className="material-symbols-outlined text-orange-300 mt-0.5">
                                    info
                                </span>

                                <p className="text-left text-orange-300 leading-relaxed">
                                    กรุณาแสดง QR Code นี้ให้เจ้าหน้าที่สแกน
                                    เมื่อนำสิ่งของมาส่งที่ศูนย์รับบริจาค
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-white">
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                    รายการสิ่งของ (Donated Items)
                                </h3>

                                <div className="space-y-3">
                                    {mockData.items.map((item, index) => (
                                        <div key={index} className={cards.donorTracking.item}>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.iconColor}`}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        {item.icon}
                                                    </span>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">
                                                        {item.name}
                                                    </p>

                                                    <p className="text-[10px] text-slate-400">
                                                        {item.detail}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="font-bold text-slate-800">
                                                {item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={cards.donorSuccess.items}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-slate-400">
                                        วิธีการจัดส่ง
                                    </span>

                                    <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded">
                                        {mockData.donation.deliveryMethod}
                                    </span>
                                </div>

                                <p className="text-sm font-bold text-slate-700">
                                    {mockData.donation.location}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                    {mockData.donation.time}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <button className={buttons.donorSuccess.saveTicket}>
                            <span className="material-symbols-outlined">download</span>
                            บันทึกรูปภาพ (Save Ticket)
                        </button>

                        <Link
                            href={mockData.links.tracking}
                            className={buttons.donorSuccess.trackingLink}
                        >
                            ดูสถานะการบริจาค (Tracking)
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}