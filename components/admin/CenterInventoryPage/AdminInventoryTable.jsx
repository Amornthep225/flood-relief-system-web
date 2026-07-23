import InventoryStatusBadge from "./InventoryStatusBadge";

export default function AdminInventoryTable({
    items,
    onStockIn,
    onStockOut,
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <th className="p-4">
                                รหัส
                            </th>
                            <th className="p-4">
                                รายการสิ่งของ
                            </th>
                            <th className="p-4 text-center">
                                คงเหลือ
                            </th>
                            <th className="p-4 text-center">
                                จุดขั้นต่ำ
                            </th>
                            <th className="p-4 text-center">
                                สถานะ
                            </th>
                            <th className="p-4 text-right">
                                จัดการ
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                        {items.map((item) => (
                            <tr
                                key={
                                    item.id ||
                                    item.reliefItemId
                                }
                                className="hover:bg-slate-50"
                            >
                                <td className="p-4 font-mono text-slate-400">
                                    {
                                        item.reliefItemId
                                    }
                                </td>

                                <td className="p-4">
                                    <p className="font-bold text-slate-800">
                                        {
                                            item.reliefItemName
                                        }
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {item.categoryName ||
                                            "ไม่ระบุหมวดหมู่"}
                                    </p>
                                </td>

                                <td className="p-4 text-center">
                                    <span className="text-lg font-bold text-slate-800">
                                        {item.quantity.toLocaleString(
                                            "th-TH"
                                        )}
                                    </span>

                                    <span className="ml-1 text-xs text-slate-500">
                                        {
                                            item.unit
                                        }
                                    </span>
                                </td>

                                <td className="p-4 text-center text-slate-600">
                                    {item.minimumQuantity.toLocaleString(
                                        "th-TH"
                                    )}{" "}
                                    {item.unit}
                                </td>

                                <td className="p-4 text-center">
                                    <InventoryStatusBadge
                                        status={
                                            item.stockStatus
                                        }
                                    />
                                </td>

                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onStockIn(
                                                    item
                                                )
                                            }
                                            className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100"
                                        >
                                            Stock In
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onStockOut(
                                                    item
                                                )
                                            }
                                            disabled={
                                                item.quantity <=
                                                0
                                            }
                                            className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Stock Out
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
