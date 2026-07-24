"use client";

export default function SosHistoryFilter({ filters, onSearch, onReset }) {
    // Helper ฟังก์ชันแปลงวันที่ปัจจุบันเป็น YYYY-MM-DD
    const getTodayString = () => new Date().toISOString().substring(0, 10);

    // อัปเดต Filter ตัวใดตัวหนึ่ง แล้วส่งค่าไปค้นหาทันที
    const updateFilter = (key, value) => {
        onSearch({
            ...filters,
            [key]: value,
        });
    };

    // Quick Select Handlers
    const handleSelectToday = () => {
        const todayStr = getTodayString();
        onSearch({
            startDate: todayStr,
            endDate: todayStr,
            status: "",
        });
    };

    const handleSelectLast7Days = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);

        onSearch({
            startDate: start.toISOString().substring(0, 10),
            endDate: end.toISOString().substring(0, 10),
            status: "",
        });
    };

    const handleSelectThisMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);

        onSearch({
            startDate: start.toISOString().substring(0, 10),
            endDate: now.toISOString().substring(0, 10),
            status: "",
        });
    };

    return (
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            {/* Header */}
            <div className="mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-500">search</span>
                <h2 className="text-lg font-bold text-slate-800">
                    ค้นหาคำขอความช่วยเหลือ
                </h2>
            </div>

            {/* Quick Select Buttons */}
            <div className="mb-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleSelectToday}
                    className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-600 hover:bg-sky-100 transition-colors"
                >
                    วันนี้
                </button>

                <button
                    type="button"
                    onClick={handleSelectLast7Days}
                    className="rounded-xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    7 วันล่าสุด
                </button>

                <button
                    type="button"
                    onClick={handleSelectThisMonth}
                    className="rounded-xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    เดือนนี้
                </button>
            </div>

            {/* Inputs Form Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Start Date */}
                <div>
                    <label className="text-sm font-semibold text-slate-600">
                        วันที่เริ่มต้น
                    </label>
                    <input
                        type="date"
                        value={filters?.startDate || ""}
                        onChange={(e) => updateFilter("startDate", e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 text-sm transition-colors"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="text-sm font-semibold text-slate-600">
                        วันที่สิ้นสุด
                    </label>
                    <input
                        type="date"
                        value={filters?.endDate || ""}
                        onChange={(e) => updateFilter("endDate", e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 text-sm transition-colors"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="text-sm font-semibold text-slate-600">สถานะ</label>
                    <select
                        value={filters?.status || ""}
                        onChange={(e) => updateFilter("status", e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 text-sm bg-white transition-colors"
                    >
                        <option value="">ทั้งหมด</option>
                        <option value="Pending">กำลังตรวจสอบ</option>
                        <option value="Accepted">รับเรื่องแล้ว</option>
                        <option value="Preparing">กำลังจัดเตรียม</option>
                        <option value="Delivering">กำลังนำส่ง</option>
                        <option value="Completed">เสร็จสิ้น</option>
                        <option value="Cancelled">ยกเลิก</option>
                    </select>
                </div>
            </div>

            {/* Reset Action */}
            <div className="mt-5 flex justify-end">
                <button
                    type="button"
                    onClick={onReset}
                    className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    รีเซ็ต
                </button>
            </div>
        </div>
    );
}