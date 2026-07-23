function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Intl.DateTimeFormat(
        "th-TH",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(new Date(value));
}

export default function InventoryTransactionTable({
    transactions,
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <th className="p-4">
                                วันที่
                            </th>
                            <th className="p-4">
                                ประเภท
                            </th>
                            <th className="p-4">
                                รายการ
                            </th>
                            <th className="p-4 text-center">
                                จำนวน
                            </th>
                            <th className="p-4 text-center">
                                ก่อน → หลัง
                            </th>
                            <th className="p-4">
                                อ้างอิง
                            </th>
                            <th className="p-4">
                                หมายเหตุ
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                        {transactions.map(
                            (item) => (
                                <tr
                                    key={
                                        item.id
                                    }
                                    className="hover:bg-slate-50"
                                >
                                    <td className="p-4 text-xs text-slate-500">
                                        {formatDate(
                                            item.createdAt
                                        )}
                                    </td>

                                    <td className="p-4 font-bold text-slate-700">
                                        {
                                            item.transactionType
                                        }
                                    </td>

                                    <td className="p-4">
                                        {
                                            item.reliefItemName
                                        }
                                    </td>

                                    <td className="p-4 text-center font-bold">
                                        {
                                            item.quantity
                                        }
                                    </td>

                                    <td className="p-4 text-center text-slate-500">
                                        {item.quantityBefore ??
                                            "-"}{" "}
                                        →{" "}
                                        {item.quantityAfter ??
                                            "-"}
                                    </td>

                                    <td className="p-4 text-xs">
                                        {
                                            item.referenceType
                                        }{" "}
                                        /{" "}
                                        {
                                            item.referenceId
                                        }
                                    </td>

                                    <td className="p-4 text-slate-500">
                                        {item.note ||
                                            "-"}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
