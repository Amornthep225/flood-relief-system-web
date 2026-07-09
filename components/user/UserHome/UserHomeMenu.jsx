import Link from "next/link";
import { cards } from "@/constants/cards";

const menu = [
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
];

export default function UserHomeMenu() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => (
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
    );
}