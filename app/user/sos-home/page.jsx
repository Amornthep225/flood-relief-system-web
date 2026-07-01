import Link from "next/link";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";
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
        sosForm: "/user/sos-form",
        chatbot: "/user/users-chatBot",
        status: "/user/sos-tracking",
        history: "/user/sos-history",
        contact: "/info/contact",
    },

    menu: [
        {
            title: "คุยกับน้องห่วงใย",
            description:
                "ผู้ช่วย AI อัจฉริยะ พร้อมตอบคำถาม ให้คำแนะนำ และเป็นเพื่อนคุยคลายเครียด 24 ชม.",
            icon: "smart_toy",
            iconBox: "bg-sky-50 text-sky-500",
            href: "/user/users-chatBot",
            actionText: "เริ่มสนทนาเลย",
            actionIcon: "chat_bubble_outline",
        },
        {
            title: "สถานะความช่วยเหลือ",
            description:
                "ติดตามสถานะสิ่งของที่คุณร้องขอและการดำเนินการจากเจ้าหน้าที่ล่าสุด",
            icon: "history",
            iconBox: "bg-emerald-50 text-emerald-500",
            href: "/user/sos-tracking",
            actionText: "ดูสถานะทั้งหมด",
            actionIcon: "arrow_forward",
        },
        {
            title: "ประวัติการขอความช่วยเหลือ",
            description:
                "ตรวจสอบรายการย้อนหลังทั้งหมดที่คุณเคยแจ้งขอความช่วยเหลือ",
            icon: "assignment",
            iconBox: "bg-purple-50 text-purple-500",
            href: "/user/sos-history",
            actionText: "ดูประวัติทั้งหมด",
            actionIcon: "arrow_forward",
        },
    ],
};

export default function UserHomePage() {
    return (
        <div className={`min-h-screen transition-colors duration-200 ${colors.dashboardUserSos.page}`}>
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
            <main className="max-w-7xl mx-auto px-6 py-8">
                <section className={cards.userHome.hero}>``
                    <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-[300px] -translate-y-20 translate-x-20 text-white">
                            shield
                        </span>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                สวัสดีครับ, {mockData.user.name}
                            </h1>

                            <p className="text-sky-50 text-lg opacity-95 leading-relaxed font-light">
                                เราพร้อมอยู่เคียงข้างคุณเสมอ ขอให้คุณและครอบครัวปลอดภัย
                                หากต้องการความช่วยเหลือเร่งด่วน กรุณากดปุ่ม SOS
                            </p>
                        </div>

                        <Link href={mockData.links.sosForm} className={buttons.userHome.sos}>
                            <span className="material-symbols-outlined text-red-500 group-hover:rotate-12 transition-transform">
                                emergency
                            </span>
                            แจ้งขอความช่วยเหลือ (SOS)
                        </Link>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockData.menu.map((item) => (
                        <div key={item.href} className={cards.userHome.menu}>
                            <div
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${item.iconBox}`}
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    {item.icon}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-slate-800">
                                {item.title}
                            </h3>

                            <p className="text-slate-500 mb-8 leading-relaxed font-light text-sm">
                                {item.description}
                            </p>

                            <div className="mt-auto">
                                <Link
                                    className="inline-flex items-center gap-2 text-sky-500 font-bold hover:gap-3 transition-all"
                                    href={item.href}
                                >
                                    {item.actionText}
                                    <span className="material-symbols-outlined text-sm">
                                        {item.actionIcon}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            <footer className="mt-20 border-t border-slate-100 bg-white/60 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-slate-600 font-medium">
                            ระบบสถานะ: ปกติ (Active) | อัปเดต 1 นาทีที่แล้ว
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium">
                        <a className="text-slate-500 hover:text-sky-500 transition-colors" href="#">
                            ความช่วยเหลือ
                        </a>
                        <a className="text-slate-500 hover:text-sky-500 transition-colors" href="#">
                            นโยบายความเป็นส่วนตัว
                        </a>
                        <Link
                            className="text-slate-500 hover:text-sky-500 transition-colors"
                            href={mockData.links.contact}
                        >
                            ติดต่อเรา
                        </Link>
                    </div>
                </div>
            </footer>

            <div className="fixed bottom-6 right-6 flex flex-col gap-4">
                <button className={buttons.userHome.floating}>
                    <span className="material-symbols-outlined">chat</span>
                </button>
            </div>
        </div>
    );
}