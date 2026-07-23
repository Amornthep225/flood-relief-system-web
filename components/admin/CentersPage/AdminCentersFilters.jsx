const filters = [
    {
        value: "all",
        label: "ทั้งหมด",
    },
    {
        value: "active",
        label: "เปิดรับของ",
    },
    {
        value: "low",
        label: "ของใกล้หมด",
    },
    {
        value: "closed",
        label: "ปิดชั่วคราว",
    },
];

export default function AdminCentersFilters({
    searchText,
    filter,
    onSearchChange,
    onFilterChange,
}) {
    return (
        <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
            <div className="relative w-full md:w-auto">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-sm text-slate-400">
                    search
                </span>

                <input
                    type="search"
                    value={searchText}
                    onChange={(event) =>
                        onSearchChange(
                            event.target.value
                        )
                    }
                    placeholder="ค้นหาชื่อศูนย์, จังหวัด, ผู้ดูแล..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-teal-500/50 md:w-80"
                />
            </div>

            <div className="flex w-full gap-2 overflow-x-auto md:w-auto">
                {filters.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                            onFilterChange(
                                item.value
                            )
                        }
                        className={
                            filter ===
                            item.value
                                ? "whitespace-nowrap rounded-full bg-slate-800 px-4 py-1.5 text-xs font-bold text-white"
                                : "whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-600"
                        }
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </section>
    );
}
