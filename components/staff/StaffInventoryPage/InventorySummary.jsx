function formatNumber(value) {
    return new Intl.NumberFormat("th-TH").format(
        Number(value || 0)
    );
}

export default function InventorySummary({
    totalQuantity,
    urgentCount,
}) {
    return (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase text-slate-400">
                    สิ่งของทั้งหมดในคลัง
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                    {formatNumber(totalQuantity)}
                    <span className="ml-2 text-sm font-normal text-slate-400">
                        หน่วย
                    </span>
                </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase text-red-400">
                    ต้องเติมด่วน
                </p>

                <p className="mt-2 text-3xl font-black text-red-600">
                    {formatNumber(urgentCount)}
                    <span className="ml-2 text-sm font-normal text-red-400">
                        รายการ
                    </span>
                </p>
            </div>
        </div>
    );
}
