const cards = [
    {
        key: "totalCenters",
        title: "จุดรับบริจาคทั้งหมด",
        icon: "apartment",
        boxStyle:
            "border-slate-200 bg-white",
        numberStyle: "text-slate-800",
        iconStyle:
            "bg-slate-100 text-slate-500",
    },
    {
        key: "activeCenters",
        title: "ศูนย์ที่เปิดใช้งาน",
        icon: "door_open",
        boxStyle:
            "border-teal-100 bg-teal-50",
        numberStyle: "text-teal-700",
        iconStyle:
            "bg-white text-teal-500",
    },
    {
        key: "lowStockCenters",
        title: "ศูนย์ที่มีของใกล้หมด",
        icon: "inventory_2",
        boxStyle:
            "border-orange-100 bg-orange-50",
        numberStyle: "text-orange-700",
        iconStyle:
            "bg-white text-orange-500",
    },
    {
        key: "lowStockItems",
        title: "รายการ Low Stock",
        icon: "warning",
        boxStyle:
            "border-slate-700 bg-slate-800",
        numberStyle: "text-white",
        iconStyle:
            "bg-slate-700 text-slate-300",
    },
];

export default function AdminCentersSummary({
    summary,
}) {
    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((item) => (
                <div
                    key={item.key}
                    className={`${item.boxStyle} flex items-center justify-between rounded-xl border p-4 shadow-sm`}
                >
                    <div>
                        <p className="mb-1 text-xs text-slate-500">
                            {item.title}
                        </p>

                        <h2
                            className={`text-2xl font-bold ${item.numberStyle}`}
                        >
                            {Number(
                                summary[
                                    item.key
                                ] ?? 0
                            ).toLocaleString(
                                "th-TH"
                            )}
                        </h2>
                    </div>

                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${item.iconStyle}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {item.icon}
                        </span>
                    </div>
                </div>
            ))}
        </section>
    );
}
