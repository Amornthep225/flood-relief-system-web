export default function AdminSosHeader({
    onRefresh,
    refreshing,
}) {
    return (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-black text-slate-800">
                        จัดการเคสขอความช่วยเหลือ

                        <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                            Live Incoming
                        </span>
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        ดูระดับความเร่งด่วนและมอบหมายเคสให้เจ้าหน้าที่
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm hover:text-sky-600 disabled:opacity-50"
                >
                    <span
                        className={`material-symbols-outlined text-[19px] ${
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
        </header>
    );
}
