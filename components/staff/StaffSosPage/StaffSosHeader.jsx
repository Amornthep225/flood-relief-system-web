export default function StaffSosHeader({
    refreshing,
    onRefresh,
}) {
    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="flex items-center gap-3 text-2xl font-black text-slate-800">
                    <span className="material-symbols-outlined animate-pulse text-red-500">
                        cell_tower
                    </span>

                    รายการแจ้งขอความช่วยเหลือ (SOS)
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    จัดการภารกิจและติดตามสถานะการช่วยเหลือ
                </p>
            </div>

            <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <span
                    className={`material-symbols-outlined text-xl ${
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
    );
}