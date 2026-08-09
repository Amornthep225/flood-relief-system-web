import Link from "next/link";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

const menu = [
    {
        title: "รับของเข้าบริจาค",
        description:
            "กรอกรหัส Tracking ID เพื่อตรวจสอบรายการของบริจาค",
        icon: "fact_check",
        iconStyle: "bg-blue-50 text-blue-600",
        href: "/staff/staff-verify",
        action: "เริ่มทำรายการ",
    },
    {
        title: "แผนที่จุดวิกฤต",
        description:
            "แสดงพิกัดผู้ประสบภัยและสถานการณ์น้ำแบบ Live Map",
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
];

export default function StaffHomeMenu() {
    return (
        <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {menu.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${cards.staffHome.menu} group cursor-pointer`}
                >
                    <div>
                        <div
                            className={`${cards.staffHome.menuIcon} ${item.iconStyle} transition-transform group-hover:scale-105`}
                        >
                            <span className="material-symbols-outlined text-4xl">
                                {item.icon}
                            </span>
                        </div>

                        <h3 className="mb-3 text-2xl font-bold text-slate-900">
                            {item.title}
                        </h3>

                        <p className="leading-relaxed text-slate-500">
                            {item.description}
                        </p>
                    </div>

                    <div
                        className={`mt-auto pt-8 ${buttons.staffHome.menuLink}`}
                    >
                        {item.action}
                        <span className="material-symbols-outlined text-lg">
                            arrow_forward
                        </span>
                    </div>
                </Link>
            ))}
        </section>
    );
}