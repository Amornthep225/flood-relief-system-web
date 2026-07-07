export default function StaffFilterBar({
    searchText,
    setSearchText,
    filter,
    setFilter,
}) {
    return (
        <section className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">
                        search
                    </span>

                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="ค้นหาชื่อ, รหัส, เบอร์โทร..."
                        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                </div>

                <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg border border-slate-200 w-10">
                    <span className="material-symbols-outlined text-sm">
                        filter_list
                    </span>
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
                <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                    ทั้งหมด
                </FilterButton>

                <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>
                    <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        ออนไลน์
                    </span>
                </FilterButton>

                <FilterButton active={filter === "banned"} onClick={() => setFilter("banned")}>
                    <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        ออฟไลน์
                    </span>
                </FilterButton>
            </div>
        </section>
    );
}

function FilterButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={
                active
                    ? "px-4 py-1.5 bg-slate-800 text-white rounded-full text-xs font-bold shadow-sm whitespace-nowrap"
                    : "px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 rounded-full text-xs font-bold transition-colors whitespace-nowrap"
            }
        >
            {children}
        </button>
    );
}