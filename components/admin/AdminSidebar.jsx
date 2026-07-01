import Link from "next/link";
import { cards } from "@/constants/cards";

const menuGroups = [
    {
        title: "ภาพรวม",
        items: [
            {
                title: "ภาพรวมระบบ",
                icon: "dashboard",
                href: "/admin/admin-dashboard",
            },
        ],
    },
    {
        title: "จัดการข้อมูล",
        items: [
            {
                title: "ผู้ประสบภัย (SOS)",
                icon: "warning",
                href: "/admin/admin-sos",
                badge: "18",
            },
            {
                title: "ผู้ใช้ (Users)",
                icon: "groups",
                href: "/admin/admin-users",
            },
            {
                title: "เจ้าหน้าที่ (Staff)",
                icon: "admin_panel_settings",
                href: "/admin/admin-staff",
            },
            {
                title: "จัดการศูนย์ (Centers)",
                icon: "apartment",
                href: "/admin/admin-centers",
            },
        ],
    },
    {
        title: "ทรัพยากร",
        items: [
            {
                title: "คลังสินค้า",
                icon: "inventory_2",
                href: "/admin/admin-inventory",
            },
        ],
    },
    {
        title: "รายงาน",
        items: [
            {
                title: "พิมพ์รายงาน",
                icon: "description",
                href: "/admin/admin-report",
            },
        ],
    },
];

export default function AdminSidebar() {
    return (
        <aside className={cards.adminLayout.sidebar}>
            <div className="p-6 flex items-center gap-3">
                <div className="bg-sky-500 rounded-lg p-2 flex items-center justify-center shadow-lg shadow-sky-500/30">
                    <span className="material-symbols-outlined text-white text-xl">
                        water_drop
                    </span>
                </div>

                <div>
                    <h1 className="text-lg font-bold leading-none text-slate-800">
                        FLOOD RELIEF
                    </h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">
                        Command Center
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {menuGroups.map((group) => (
                    <div key={group.title}>
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 first:mt-2">
                            {group.title}
                        </p>

                        {group.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={
                                    item.active
                                        ? "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sky-500/10 text-sky-500 font-bold"
                                        : "flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-sky-500 transition-colors rounded-xl group"
                                }
                            >
                                <span className="material-symbols-outlined w-5 text-center text-[20px]">
                                    {item.icon}
                                </span>

                                <p className="text-sm font-medium">{item.title}</p>

                                {item.badge && (
                                    <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-[10px] font-bold">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <Link
                    href="/admin-login"
                    className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 transition-colors group"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        logout
                    </span>
                    <p className="text-sm font-medium">ออกจากระบบ</p>
                </Link>
            </div>
        </aside>
    );
}