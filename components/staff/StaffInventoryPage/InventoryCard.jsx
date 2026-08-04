const levelConfig = {
    critical: {
        label: "วิกฤต",
        cardClass: "border-2 border-red-200",
        iconClass: "bg-red-50 text-red-500",
        amountClass: "text-red-600",
        badgeClass: "bg-red-100 text-red-700",
        icon: "warning",
    },
    low: {
        label: "ใกล้หมด",
        cardClass: "border border-orange-200",
        iconClass: "bg-orange-50 text-orange-500",
        amountClass: "text-orange-500",
        badgeClass: "bg-orange-100 text-orange-700",
        icon: "inventory_2",
    },
    sufficient: {
        label: "เพียงพอ",
        cardClass: "border border-slate-100",
        iconClass: "bg-sky-50 text-sky-500",
        amountClass: "text-sky-600",
        badgeClass: "bg-green-100 text-green-700",
        icon: "inventory_2",
    },
};

function formatNumber(value) {
    return new Intl.NumberFormat("th-TH").format(
        Number(value || 0)
    );
}

export default function InventoryCard({
    item,
    level,
}) {
    const config =
        levelConfig[level] ||
        levelConfig.sufficient;

    return (
        <article
            className={`rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${config.cardClass}`}
        >
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                    <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${config.iconClass}`}
                    >
                        <span className="material-symbols-outlined text-3xl">
                            {config.icon}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-slate-800">
                            {item.name}
                        </h2>

                        <p className="text-xs text-slate-400">
                            {item.category}
                        </p>

                        <p className="mt-1 text-[11px] font-mono text-slate-400">
                            #{item.reliefItemId}
                        </p>
                    </div>
                </div>

                <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${config.badgeClass}`}
                >
                    {config.label}
                </span>
            </div>

            <div className="flex items-end gap-2">
                <span
                    className={`text-4xl font-black ${config.amountClass}`}
                >
                    {formatNumber(item.quantity)}
                </span>

                <span className="mb-1.5 text-sm font-bold text-slate-400">
                    {item.unit}
                </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="text-slate-400">
                    จุดแจ้งเตือนขั้นต่ำ
                </span>

                <span className="font-bold text-slate-600">
                    {formatNumber(item.minimumQuantity)} {item.unit}
                </span>
            </div>
        </article>
    );
}
