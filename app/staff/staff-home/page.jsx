import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import StaffNavbar from "@/components/staff/staff-navbar";
const theme = colors.staff;
const mockData = {
    hotline: "1784",
    user: {
        name: "คุณ อมรเทพ ถายะ",
        image: "https://ui-avatars.com/api/?name=PA&background=0284c7&color=fff",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
        role: "หน่วยประสานงานกู้ภัย",
    },

    links: {
        home: "/staff/staff-home",
        sos: "/staff/staff-sos",
        verify: "/staff/staff-verify",
        crisis: "/staff/staff-crisis-map",
        inventory: "/staff/staff-inventory",
    },

    menu: [
        {
            title: "รับของเข้าบริจาค",
            description: "กรอกรหัส Tracking ID เพื่อตรวจสอบรายการของบริจาค",
            icon: "fact_check",
            iconStyle: "bg-blue-50 text-blue-600",
            href: "/staff/staff-verify",
            action: "เริ่มทำรายการ",
        },
        {
            title: "แผนที่จุดวิกฤต",
            description: "แสดงพิกัดผู้ประสบภัยและสถานการณ์น้ำแบบ Live Map",
            icon: "map",
            iconStyle: "bg-indigo-50 text-indigo-600",
            href: "/staff/staff-crisis-map",
            action: "เปิดดูแผนที่สด",
        },
        {
            title: "ดูรายการสิ่งของในคลัง",
            description:
                "ตรวจสอบรายการสิ่งของบริจาคคงเหลือและทรัพยากรที่พร้อมใช้งาน",
            icon: "inventory_2",
            iconStyle: "bg-emerald-50 text-emerald-600",
            href: "/staff/staff-inventory",
            action: "ดูรายการทั้งหมด",
        },
    ],
};

export default function StaffHomePage() {
    return (
        <div className={`min-h-screen flex flex-col ${colors.staff.page}`}>
                        <StaffNavbar
                            user={mockData.user}
                            theme={theme}
                            hotline={mockData.hotline}
                            notificationCount={3}
                            homeHref="/staff/staff-home"
                            backHref="/"
                            logoutHref="/staff/staff-login"
                            options={{
                                back: false,
                                home: false,
                                logout: true,
                                notification: true,
                                profile: true,
                                hotlineButton: true,
                            }}
                        />

            <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
                <section className={cards.staffHome.hero}>
                    <div className="absolute -right-10 -bottom-10 opacity-10">
                        <span className="material-symbols-outlined text-[240px] text-white">
                            support_agent
                        </span>
                    </div>

                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white">
                                สวัสดีครับ, {mockData.user.name}
                            </h1>

                            <p className="text-blue-100 text-lg mt-2">
                                เจ้าหน้าที่ประจำศูนย์ประสานงานกลาง
                            </p>
                        </div>

                        <Link href={mockData.links.sos} className={buttons.staffHome.hero}>
                            <span className="material-symbols-outlined">emergency</span>
                            ดูรายการ SOS
                        </Link>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mockData.menu.map((item) => (
                        <div key={item.href} className={cards.staffHome.menu}>
                            <div>
                                <div className={`${cards.staffHome.menuIcon} ${item.iconStyle}`}>
                                    <span className="material-symbols-outlined text-4xl">
                                        {item.icon}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                    {item.title}
                                </h3>

                                <p className="text-slate-500 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            <div className="mt-auto pt-8">
                                <Link href={item.href} className={buttons.staffHome.menuLink}>
                                    {item.action}
                                    <span className="material-symbols-outlined text-lg">
                                        arrow_forward
                                    </span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            <footer className="max-w-7xl mx-auto px-6 py-8 w-full">
                <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-200 pt-8 gap-4">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            ระบบพร้อมใช้งาน
                        </span>

                        <span className="hidden sm:inline">|</span>

                        <span>อัปเดตล่าสุด: 14:32 น.</span>
                    </div>

                    <div className="flex gap-6 text-xs font-medium text-slate-400 uppercase tracking-widest">
                        <a className="hover:text-blue-600 transition-colors" href="#">
                            ความเป็นส่วนตัว
                        </a>
                        <a className="hover:text-blue-600 transition-colors" href="#">
                            เงื่อนไขการใช้งาน
                        </a>
                        <a className="hover:text-blue-600 transition-colors" href="#">
                            ติดต่อศูนย์ช่วยเหลือ
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}