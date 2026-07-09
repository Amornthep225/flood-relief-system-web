import Link from "next/link";
import { cards } from "@/constants/cards";
import { colors } from "@/constants/colors";

const menu = [
    {
        title: "รายการของที่กำลังขาดแคลน",
        description: "สิ่งของอุปโภคบริโภคที่มีความจำเป็นเร่งด่วนในพื้นที่ประสบภัยขณะนี้",
        icon: "inventory_2",
        iconBox: "bg-orange-100 text-orange-600",
        href: "/user/donor-low-products",
        actionText: "ดูรายการทั้งหมด",
    },
    {
        title: "ดูรหัสการบริจาค",
        description: "ตรวจสอบสถานะสิ่งของที่คุณบริจาคและการส่งมอบแบบเรียลไทม์",
        icon: "package_2",
        iconBox: "bg-green-100 text-green-600",
        href: "/user/donor-tracking",
        actionText: "ดูรายละเอียด",
    },
    {
        title: "ประวัติการบริจาค",
        description: "ตรวจสอบรายการที่คุณเคยบริจาคและสถานะการส่งมอบ",
        icon: "history",
        iconBox: "bg-blue-100 text-blue-600",
        href: "/user/donor-history",
        actionText: "ดูประวัติทั้งหมด",
    },
];

export default function DonorMenu() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menu.map((item) => (
                <Link key={item.href} href={item.href} className={cards.donorHome.menu}>
                    <div className={`size-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${item.iconBox}`}>
                        <span className="material-symbols-outlined text-5xl">
                            {item.icon}
                        </span>
                    </div>

                    <h3 className={`${colors.donor.primaryText} text-2xl font-extrabold mb-3`}>
                        {item.title}
                    </h3>

                    <p className={`${colors.donor.secondaryText} text-base mb-6 leading-relaxed`}>
                        {item.description}
                    </p>

                    <div className="mt-auto flex items-center text-sky-500 font-bold text-base">
                        {item.actionText}
                        <span className="material-symbols-outlined ml-2 text-xl">
                            arrow_forward
                        </span>
                    </div>
                </Link>
            ))}
        </section>
    );
}