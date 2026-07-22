"use client";

export default function DonationItemList({ items = [] }) {
    if (!items || items.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                    รายการสิ่งของ
                </h2>
                <div className="rounded-2xl bg-slate-50/70 p-6 text-center text-slate-400 text-sm">
                    ไม่มีข้อมูลรายการสิ่งของ
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                    รายการสิ่งของที่บริจาค
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-600">
                    รวม {items.length} รายการ
                </span>
            </div>

            <div className="space-y-2.5">
                {items.map((item, index) => (
                    <div
                        key={item.id || index}
                        className="rounded-2xl bg-slate-50 p-4 flex items-center justify-between transition-colors hover:bg-slate-100/80"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 text-xs font-bold shadow-xs border border-slate-100">
                                {index + 1}
                            </div>
                            <span className="font-medium text-slate-700 text-sm">
                                {item.reliefItemName}
                            </span>
                        </div>

                        <div className="text-right">
                            <span className="font-bold text-slate-900 text-sm">
                                {item.quantity?.toLocaleString() || item.quantity}
                            </span>
                            <span className="text-xs text-slate-500 ml-1 font-normal">
                                {item.unit}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}