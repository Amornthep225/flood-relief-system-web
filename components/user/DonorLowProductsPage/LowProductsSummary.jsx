const summaryCards = [
    {
        key: "totalItems",
        label: "รายการขาดแคลน",
        icon: "inventory_2",
        valueClassName: "text-sky-600",
        iconClassName: "bg-sky-50 text-sky-600",
    },
    {
        key: "totalMissing",
        label: "จำนวนที่ขาดรวม",
        icon: "trending_down",
        valueClassName: "text-orange-600",
        iconClassName: "bg-orange-50 text-orange-600",
    },
    {
        key: "outOfStockCount",
        label: "หมดสต็อก",
        icon: "warning",
        valueClassName: "text-red-600",
        iconClassName: "bg-red-50 text-red-600",
    },
];

export default function LowProductsSummary({ summary }) {
    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {summaryCards.map((card) => (
                <div
                    key={card.key}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconClassName}`}
                    >
                        <span className="material-symbols-outlined">
                            {card.icon}
                        </span>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            {card.label}
                        </p>
                        <p
                            className={`text-3xl font-bold ${card.valueClassName}`}
                        >
                            {summary?.[card.key] ?? 0}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
}