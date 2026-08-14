"use client";

export default function DonationItemList({ items = [] }) {
    if (!items || items.length === 0) {
        return (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-slate-800">
                    รายการสิ่งของ
                </h2>
                <div className="rounded-2xl bg-slate-50/70 p-6 text-center text-sm text-slate-400">
                    ไม่มีข้อมูลรายการสิ่งของ
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        รายการสิ่งของที่บริจาค
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                        ติดตามตั้งแต่เข้าศูนย์จนส่งถึงผู้ประสบภัย
                    </p>
                </div>
                <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600">
                    รวม {items.length} รายการ
                </span>
            </div>

            <div className="space-y-3">
                {items.map((item, index) => {
                    const total = Number(item.quantity || 0);
                    const delivered = Math.max(
                        Number(item.forwardedQuantity || 0),
                        0
                    );
                    const inTransit = Math.max(
                        Number(item.inTransitQuantity || 0),
                        0
                    );
                    const remaining = Math.max(
                        Number(
                            item.remainingQuantity ??
                                total - delivered - inTransit
                        ),
                        0
                    );
                    const deliveredPercent =
                        total > 0
                            ? Math.min((delivered / total) * 100, 100)
                            : 0;
                    const transitPercent =
                        total > 0
                            ? Math.min((inTransit / total) * 100, 100 - deliveredPercent)
                            : 0;

                    return (
                        <div
                            key={item.id || index}
                            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white text-xs font-bold text-slate-400 shadow-sm">
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-slate-700">
                                            {item.reliefItemName}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            บริจาคทั้งหมด {total.toLocaleString()} {item.unit}
                                        </p>
                                    </div>
                                </div>

                                {delivered >= total && total > 0 ? (
                                    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                        ส่งถึงครบแล้ว
                                    </span>
                                ) : inTransit > 0 ? (
                                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                                        กำลังนำส่ง
                                    </span>
                                ) : (
                                    <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-700">
                                        อยู่ในระบบ
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white">
                                <div
                                    className="h-full bg-emerald-400 transition-all"
                                    style={{ width: `${deliveredPercent}%` }}
                                />
                                <div
                                    className="h-full bg-amber-400 transition-all"
                                    style={{ width: `${transitPercent}%` }}
                                />
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                <div className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700">
                                    <p className="text-[10px] font-bold tracking-wide text-emerald-500">
                                        ส่งถึงแล้ว
                                    </p>
                                    <p className="mt-0.5 font-black">
                                        {delivered.toLocaleString()} {item.unit}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-amber-50 px-3 py-2 text-amber-700">
                                    <p className="text-[10px] font-bold tracking-wide text-amber-500">
                                        กำลังส่ง
                                    </p>
                                    <p className="mt-0.5 font-black">
                                        {inTransit.toLocaleString()} {item.unit}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-white px-3 py-2 text-slate-600">
                                    <p className="text-[10px] font-bold tracking-wide text-slate-400">
                                        คงเหลือ
                                    </p>
                                    <p className="mt-0.5 font-black">
                                        {remaining.toLocaleString()} {item.unit}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
