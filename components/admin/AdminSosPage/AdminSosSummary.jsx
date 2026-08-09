const cards = [
    {
        key: "total",
        title: "เคสทั้งหมด",
        icon: "list",
        cardClass:
            "border-slate-200 bg-white text-slate-800",
        iconClass:
            "bg-slate-100 text-slate-500",
    },
    {
        key: "critical",
        title: "SOS วิกฤต",
        icon: "crisis_alert",
        cardClass:
            "border-red-100 bg-red-50 text-red-600",
        iconClass:
            "bg-white text-red-500",
    },
    {
        key: "waiting",
        title: "รอการช่วยเหลือ",
        icon: "warning",
        cardClass:
            "border-orange-100 bg-orange-50 text-orange-600",
        iconClass:
            "bg-white text-orange-500",
    },
    {
        key: "progress",
        title: "กำลังดำเนินการ",
        icon: "engineering",
        cardClass:
            "border-blue-100 bg-blue-50 text-blue-600",
        iconClass:
            "bg-white text-blue-500",
    },
    {
        key: "completed",
        title: "ช่วยเหลือสำเร็จ",
        icon: "check_circle",
        cardClass:
            "border-green-100 bg-green-50 text-green-600",
        iconClass:
            "bg-white text-green-500",
    },
];

export default function AdminSosSummary({
    summary,
}) {
    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
                <div
                    key={card.key}
                    className={`flex items-center justify-between rounded-xl border p-4 shadow-sm ${card.cardClass}`}
                >
                    <div>
                        <p className="mb-1 text-xs font-bold">
                            {card.title}
                        </p>

                        <p className="text-3xl font-black">
                            {summary[card.key] || 0}
                        </p>
                    </div>

                    <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full ${card.iconClass}`}
                    >
                        <span className="material-symbols-outlined">
                            {card.icon}
                        </span>
                    </div>
                </div>
            ))}
        </section>
    );
}
