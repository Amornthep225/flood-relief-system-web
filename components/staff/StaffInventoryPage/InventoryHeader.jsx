export default function InventoryHeader({
    centerName,
    onRefresh,
    refreshing,
    onOpenHistory,
}) {
    return (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                    <span className="material-symbols-outlined text-sky-600">
                        warehouse
                    </span>
                    ตรวจสอบคลังสินค้า
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    {centerName}
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={onOpenHistory}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        history
                    </span>
                    ดูประวัติเข้า–ออกคลัง
                </button>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span
                        className={`material-symbols-outlined text-[20px] ${
                            refreshing ? "animate-spin" : ""
                        }`}
                    >
                        refresh
                    </span>
                    {refreshing
                        ? "กำลังอัปเดต..."
                        : "อัปเดตข้อมูล"}
                </button>
            </div>
        </div>
    );
}
