const statusFilters = [
    {
        value: "all",
        label: "ทั้งหมด",
    },
    {
        value: "waiting",
        label: "รอการช่วยเหลือ",
    },
    {
        value: "progress",
        label: "กำลังดำเนินการ",
    },
    {
        value: "completed",
        label: "ช่วยเหลือสำเร็จ",
    },
    {
        value: "cancelled",
        label: "ยกเลิก",
    },
];

export default function AdminSosFilters({
    searchText,
    onSearchChange,
    filter,
    onFilterChange,
    priorityFilter,
    onPriorityChange,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative w-full xl:max-w-sm">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">
                        search
                    </span>

                    <input
                        type="text"
                        value={searchText}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        placeholder="ค้นหาชื่อ เบอร์โทร รหัสเคส ศูนย์..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    />
                </div>

                <div className="flex flex-col gap-3 lg:flex-row">
                    <select
                        value={priorityFilter}
                        onChange={(event) =>
                            onPriorityChange(event.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 outline-none"
                    >
                        <option value="all">
                            ทุกระดับ
                        </option>
                        <option value="critical">
                            วิกฤต
                        </option>
                        <option value="urgent">
                            เร่งด่วน
                        </option>
                        <option value="normal">
                            ปกติ
                        </option>
                    </select>

                    <div className="flex gap-2 overflow-x-auto">
                        {statusFilters.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() =>
                                    onFilterChange(item.value)
                                }
                                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                                    filter === item.value
                                        ? "bg-slate-800 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
