const statConfigs = [
    {
        key: "waiting",
        title: "คำขอรอการช่วยเหลือ",
        detail: "รอการตอบรับจากเจ้าหน้าที่",
        icon: "warning",
        mainIcon: "cell_tower",
        iconStyle:
            "bg-red-50 text-red-600",
        badge: "รอดำเนินการ",
        badgeStyle:
            "bg-red-50 text-red-600",
    },
    {
        key: "critical",
        title: "เคสระดับวิกฤต",
        detail: "ต้องเร่งจัดเจ้าหน้าที่",
        icon: "crisis_alert",
        mainIcon: "crisis_alert",
        iconStyle:
            "bg-orange-50 text-orange-600",
        badge: "วิกฤต",
        badgeStyle:
            "bg-orange-50 text-orange-600",
    },
    {
        key: "activeStaff",
        title: "เจ้าหน้าที่เปิดใช้งาน",
        detail: "บัญชี Staff ที่พร้อมใช้งาน",
        icon: "groups",
        mainIcon: "groups",
        iconStyle:
            "bg-blue-50 text-blue-600",
        badge: "Active",
        badgeStyle:
            "bg-blue-50 text-blue-600",
    },
    {
        key: "totalInventory",
        title: "สิ่งของคงเหลือรวม",
        detail: "จำนวนรวมทุกศูนย์",
        icon: "inventory_2",
        mainIcon: "inventory_2",
        iconStyle:
            "bg-emerald-50 text-emerald-600",
        badge: "คงเหลือ",
        badgeStyle:
            "bg-emerald-50 text-emerald-600",
    },
    {
        key: "lowStock",
        title: "รายการ Low Stock",
        detail: "ต่ำกว่าจุดแจ้งเตือน",
        icon: "inventory",
        mainIcon: "inventory",
        iconStyle:
            "bg-slate-100 text-slate-600",
        badge: "ตรวจสอบ",
        badgeStyle:
            "bg-slate-100 text-slate-600",
    },
];

export default function AdminDashboardStats({
    summary,
}) {
    return (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {statConfigs.map(
                (item) => (
                    <StatCard
                        key={item.key}
                        item={{
                            ...item,
                            number:
                                summary[
                                    item.key
                                ] || 0,
                        }}
                    />
                )
            )}
        </section>
    );
}

function StatCard({
    item,
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                <span className="material-symbols-outlined text-7xl">
                    {item.mainIcon}
                </span>
            </div>

            <div className="mb-4 flex items-start justify-between">
                <div
                    className={`rounded-xl p-3 ${item.iconStyle}`}
                >
                    <span className="material-symbols-outlined">
                        {item.icon}
                    </span>
                </div>

                <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${item.badgeStyle}`}
                >
                    {item.badge}
                </span>
            </div>

            <p className="text-sm font-medium text-slate-500">
                {item.title}
            </p>

            <h2 className="mt-1 text-3xl font-black text-slate-800">
                {Number(
                    item.number || 0
                ).toLocaleString(
                    "th-TH"
                )}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
                {item.detail}
            </p>
        </div>
    );
}
