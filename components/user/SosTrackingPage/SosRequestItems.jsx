export default function SosRequestItems({ items }) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="rounded-3xl border border-sky-100 bg-sky-50 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined text-sky-500">
                    inventory_2
                </span>
                <h2 className="text-lg font-bold text-slate-800">
                    รายการความช่วยเหลือที่ร้องขอ
                </h2>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl bg-white border border-sky-100 px-5 py-4"
                    >
                        <div>
                            <p className="font-bold text-slate-700">
                                {item.reliefItemName}
                            </p>
                            <p className="text-sm text-slate-400">
                                จำนวน {item.quantity} {item.unit}
                            </p>
                        </div>

                        <span className="material-symbols-outlined text-sky-500">
                            package_2
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}