export default function InventoryFilter({
    tabs,
    activeTab,
    onTabChange,
    searchText,
    onSearchChange,
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onTabChange(tab)}
                        className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${
                            activeTab === tab
                                ? "bg-sky-600 text-white shadow-sm"
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                    search
                </span>

                <input
                    type="text"
                    placeholder="ค้นหาชื่อ หมวดหมู่ หรือรหัสสิ่งของ..."
                    value={searchText}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
            </div>
        </div>
    );
}
