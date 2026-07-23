export default function AdminInventoryFilters({
    activeTab,
    searchText,
    statusFilter,
    onTabChange,
    onSearchChange,
    onStatusChange,
}) {
    return (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() =>
                        onTabChange(
                            "inventory"
                        )
                    }
                    className={
                        activeTab ===
                        "inventory"
                            ? "rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white"
                            : "rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
                    }
                >
                    คลังสินค้า
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onTabChange(
                            "transactions"
                        )
                    }
                    className={
                        activeTab ===
                        "transactions"
                            ? "rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white"
                            : "rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
                    }
                >
                    ประวัติ Transaction
                </button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-96">
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
                        placeholder={
                            activeTab ===
                            "inventory"
                                ? "ค้นหาชื่อสิ่งของ, รหัส, หมวดหมู่..."
                                : "ค้นหา Transaction, Reference..."
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-teal-500/50"
                    />
                </div>

                {activeTab ===
                    "inventory" && (
                    <select
                        value={
                            statusFilter
                        }
                        onChange={(event) =>
                            onStatusChange(
                                event.target.value
                            )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 outline-none"
                    >
                        <option value="all">
                            ทุกสถานะ
                        </option>
                        <option value="Normal">
                            ปกติ
                        </option>
                        <option value="LowStock">
                            ใกล้หมด
                        </option>
                        <option value="OutOfStock">
                            หมดสต็อก
                        </option>
                    </select>
                )}
            </div>
        </section>
    );
}
