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

    donation: {
        trackingId: "DON-8821",
        qrCode:
            "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DON8821",
        center: "ศูนย์บัญชาการชั่วคราว เทศบาลนครเชียงราย",
    },

    links: {
        home: "/user/donor-home",
        map: "https://maps.google.com",
        contact: "/user/chat",
    },

    items: [
        {
            icon: "water_drop",
            iconColor: "text-sky-500",
            name: "น้ำดื่ม",
            amount: "12 แพ็ค",
        },
        {
            icon: "rice_bowl",
            iconColor: "text-orange-500",
            name: "ข้าวสาร",
            amount: "2 ถุง",
        },
    ],
};

export default function DonorTrackingPage() {
    return (
        <div className={`min-h-screen flex flex-col ${colors.donorTracking.page}`}>
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
            <main className="relative z-10 flex-grow flex justify-center px-4 py-8 pb-20">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">
                            รหัสอ้างอิงการบริจาคของคุณ
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            โปรดแสดงหน้านี้ให้เจ้าหน้าที่เมื่อเดินทางมาถึงศูนย์รับบริจาค
                        </p>
                    </div>

                    <div className={cards.donorTracking.card}>
                        <div className={cards.donorTracking.header}>
                            <span className="material-symbols-outlined absolute -right-10 -bottom-10 text-9xl text-sky-100/50 -rotate-12 pointer-events-none">
                                qr_code_2
                            </span>

                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                Reference Code
                            </p>

                            <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-4 border border-slate-100 relative z-10">
                                <img
                                    src={mockData.donation.qrCode}
                                    alt="QR Code"
                                    className="w-32 h-32 opacity-90"
                                />
                            </div>

                            <div className="flex items-center justify-center gap-3 relative z-10">
                                <h2 className="text-3xl font-mono font-black text-sky-600 tracking-wider">
                                    {mockData.donation.trackingId}
                                </h2>

                                <button
                                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-sky-100 hover:text-sky-600 flex items-center justify-center transition-colors"
                                    title="คัดลอกรหัส"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        content_copy
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="p-8 relative">
                            <div className="absolute left-[3.25rem] top-10 bottom-10 w-0.5 bg-slate-100 z-0" />

                            <div className="space-y-8 relative z-10">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md shadow-green-200 shrink-0 border-2 border-white ring-2 ring-green-100">
                                        <span className="material-symbols-outlined">
                                            assignment_turned_in
                                        </span>
                                    </div>

                                    <div className="pt-1">
                                        <h3 className="font-bold text-slate-800 text-sm">
                                            ลงทะเบียนแจ้งบริจาคสำเร็จ
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            เมื่อ 14:05 น. — ระบบบันทึกข้อมูลเรียบร้อย
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="relative w-10 h-10 shrink-0">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-25 animate-ping" />
                                        <div className="relative w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-300 border-2 border-white ring-2 ring-orange-100">
                                            <span className="material-symbols-outlined">
                                                directions_walk
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-1 w-full">
                                        <h3 className="font-bold text-orange-600 text-lg">
                                            รอท่านนำสิ่งของมามอบที่ศูนย์
                                        </h3>
                                        <p className="text-xs text-slate-500 mb-3">
                                            กรุณาเดินทางไปยังศูนย์รับบริจาคที่ท่านเลือก
                                        </p>

                                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                            <p className="text-xs font-bold text-orange-800 mb-1 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">
                                                    location_on
                                                </span>
                                                จุดรับบริจาค:
                                            </p>

                                            <p className="text-sm font-medium text-slate-700 mb-3">
                                                {mockData.donation.center}
                                            </p>

                                            <a
                                                href={mockData.links.map}
                                                target="_blank"
                                                className={buttons.donorTracking.map}
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    near_me
                                                </span>
                                                เปิดแผนที่นำทาง
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 opacity-40 grayscale">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-slate-300 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined">
                                            inventory_2
                                        </span>
                                    </div>

                                    <div className="pt-1">
                                        <h3 className="font-bold text-slate-800 text-sm">
                                            เจ้าหน้าที่ตรวจสอบและรับของ
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            รอเจ้าหน้าที่สแกนรหัสเพื่อนำของเข้าคลัง
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 border-t border-slate-100">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">
                                    inventory_2
                                </span>
                                รายการสิ่งของที่คุณแจ้งบริจาค
                            </h4>

                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {mockData.items.map((item) => (
                                    <div key={item.name} className={cards.donorTracking.item}>
                                        <span
                                            className={`material-symbols-outlined ${item.iconColor}`}
                                        >
                                            {item.icon}
                                        </span>

                                        <span className="text-sm font-medium text-slate-700">
                                            {item.name}
                                            <span className="text-slate-400 text-xs ml-1">
                                                ({item.amount})
                                            </span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t border-slate-100">
                            <Link href={mockData.links.contact} className={buttons.donorTracking.contact}>
                                <span className="material-symbols-outlined text-sm">
                                    support_agent
                                </span>
                                ติดต่อสอบถามเจ้าหน้าที่
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}