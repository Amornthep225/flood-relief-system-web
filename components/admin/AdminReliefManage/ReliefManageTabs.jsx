export default function ReliefManageTabs({
    activeTab,
    onChange,
    itemCount,
    itemActive,
    categoryCount,
    categoryActive,
}) {
    const cards = [
        {
            value: "items",
            title: "รายการสินค้า",
            count: itemCount,
            activeCount: itemActive,
            icon: "inventory_2",
            activeClass: "border-sky-300 bg-sky-50 ring-sky-100",
            iconClass: "bg-sky-500 shadow-sky-200",
        },
        {
            value: "categories",
            title: "หมวดหมู่สินค้า",
            count: categoryCount,
            activeCount: categoryActive,
            icon: "category",
            activeClass: "border-violet-300 bg-violet-50 ring-violet-100",
            iconClass: "bg-violet-500 shadow-violet-200",
        },
    ];

    return (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {cards.map((card) => (
                <button
                    key={card.value}
                    type="button"
                    onClick={() => onChange(card.value)}
                    className={`relative overflow-hidden rounded-3xl border p-6 text-left shadow-sm transition ${
                        activeTab === card.value
                            ? `${card.activeClass} ring-4`
                            : "border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md"
                    }`}
                >
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500">{card.title}</p>
                            <p className="mt-2 text-4xl font-black text-slate-800">{card.count}</p>
                            <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                เปิดใช้งาน {card.activeCount}
                            </span>
                        </div>
                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg ${card.iconClass}`}>
                            <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                        </div>
                    </div>
                </button>
            ))}
        </section>
    );
}
