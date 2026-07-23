const cards = [
    {
        key: "totalItems",
        title: "รายการสินค้า",
        icon: "category",
        boxStyle:
            "border-slate-200 bg-white",
        numberStyle:
            "text-slate-800",
    },
    {
        key: "totalQuantity",
        title: "จำนวนคงเหลือรวม",
        icon: "inventory",
        boxStyle:
            "border-sky-100 bg-sky-50",
        numberStyle:
            "text-sky-700",
    },
    {
        key: "lowStock",
        title: "ใกล้หมด",
        icon: "warning",
        boxStyle:
            "border-orange-100 bg-orange-50",
        numberStyle:
            "text-orange-700",
    },
    {
        key: "outOfStock",
        title: "หมดสต็อก",
        icon: "remove_shopping_cart",
        boxStyle:
            "border-red-100 bg-red-50",
        numberStyle:
            "text-red-700",
    },
];

export default function AdminInventorySummary({
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

                    <span className="material-symbols-outlined text-2xl text-slate-400">
                        {item.icon}
                    </span>
                </div>
            ))}
        </section>
    );
}
