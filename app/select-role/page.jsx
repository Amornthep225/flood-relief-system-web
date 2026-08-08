import Link from "next/link";
import UserNavbar from "@/components/user/user-navbar";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";
const theme = colors.role;
const mockData = {

    user: {
        name: "คุณ อมรเทพ ถายะ",
        image: "https://ui-avatars.com/api/?name=PA&background=0284c7&color=fff",
    },
    hotline: "1784",
    menu: [
        {
            title: "ต้องการความช่วยเหลือด่วน?",
            description:
                "สำหรับผู้ประสบอุทกภัยที่ต้องการความช่วยเหลือ ยา รักษาโรค อาหาร หรือการอพยพ",
            icon: "fire_extinguisher",
            buttonIcon: "error",
            buttonText: "แจ้งเหตุ SOS",
            href: "/user/sos-home",
            type: "emergency",
            note: "เจ้าหน้าที่พร้อมสแตนด์บายตลอด 24 ชม.",
        },
        {
            title: "ต้องการร่วมบริจาค?",
            description:
                "สำหรับผู้ที่ประสงค์จะบริจาคสิ่งของ เงินทุน หรือ สนับสนุนเครื่องมือช่วยเหลือต่างๆ",
            icon: "volunteer_activism",
            buttonIcon: "favorite",
            buttonText: "เริ่มการบริจาค",
            href: "/user/donor-home",
            type: "donation",
            note: "ร่วมเป็นส่วนหนึ่งของการส่งต่อกำลังใจ",
        },
    ],
};

export default function SelectRolePage() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-[#121417] font-sans selection:bg-sky-200">
            <UserNavbar
                user={mockData.user}
                theme={theme}
                hotline={mockData.hotline}
                notificationCount={3}
                options={{
                    home: false,
                    logout: true,
                    notification: true,
                    profile: true,
                    hotlineButton: true,
                }}
            />

            <main className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="max-w-6xl w-full">
                    <div className="text-center mb-14">
                        <h1 className={`${theme.primaryText} text-4xl md:text-5xl font-black mb-4 tracking-tight`}>
                            กรุณาเลือกประเภทการใช้งาน
                        </h1>

                        <p className={`${theme.secondaryText} text-lg font-medium`}>
                            เพื่อเราจะได้ดูแลคุณได้อย่างรวดเร็วและตรงความต้องการที่สุด
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
                        {mockData.menu.map((item) => {
                            const isEmergency = item.type === "emergency";

                            const cardStyle = isEmergency ? cards.selectRole.emergency : cards.selectRole.donation;
                            const iconBg = isEmergency ? theme.emergencyBg : theme.donationBg;
                            const iconColor = isEmergency
                                ? theme.emergencyText
                                : theme.donationText;
                            const buttonStyle = isEmergency
                                ? buttons.selectRole.emergency
                                : buttons.selectRole.donation;

                            return (
                                <div
                                    key={item.href}
                                    className={`${cards.selectRole.roleBase} ${cardStyle}`}
                                >
                                    <div className={`${cards.selectRole.icon} ${iconBg}`}>
                                        <span
                                            className={`material-symbols-outlined text-7xl ${iconColor}`}
                                        >
                                            {item.icon}
                                        </span>
                                    </div>

                                    <h2 className={`${theme.primaryText} text-2xl md:text-3xl font-black mb-4`}>
                                        {item.title}
                                    </h2>

                                    <p className={`${theme.secondaryText} text-base md:text-lg mb-12 max-w-sm leading-relaxed font-medium`}>
                                        {item.description}
                                    </p>

                                    <Link
                                        href={item.href}
                                        className={`w-full max-w-70 h-14 rounded-xl ${buttonStyle} text-lg font-bold flex items-center justify-center gap-2 transition-colors`}
                                    >
                                        <span className="material-symbols-outlined text-[22px]">
                                            {item.buttonIcon}
                                        </span>
                                        {item.buttonText}
                                    </Link>

                                    <div className={`mt-8 font-bold text-sm flex items-center gap-2 ${theme.emergencyText}`}>
                                        {isEmergency && (
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#d64550]" />
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d64550]" />
                                            </span>
                                        )}
                                        {item.note}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            <footer className="w-full py-6 mt-auto">
                <div className="max-w-350 mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
                    <div className={`${theme.secondaryText} flex items-center gap-2 text-sm font-bold`}>
                        <span className="material-symbols-outlined text-[18px]">
                            update
                        </span>
                        อัปเดตระบบ: กันยายน 2567
                    </div>

                    <div className={`${theme.primaryText} flex items-center gap-8 text-sm font-bold`}>
                        <a href="#" className="hover:text-[#2a93d5] transition-colors">
                            นโยบายความเป็นส่วนตัว
                        </a>
                        <a href="#" className="hover:text-[#2a93d5] transition-colors">
                            ติดต่อเรา
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}