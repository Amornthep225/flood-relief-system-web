function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function normalizeType(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replaceAll("_", "-")
        .replaceAll(" ", "-");
}

function isStockIn(item) {
    const type = normalizeType(item?.transactionType);

    const stockInTypes = [
        "in",
        "stock-in",
        "stockin",
        "receive",
        "received",
        "donation",
        "donation-in",
        "receive-donation",
        "inbound",
    ];

    const stockOutTypes = [
        "out",
        "stock-out",
        "stockout",
        "withdraw",
        "issue",
        "dispatch",
        "outbound",
        "sos-out",
    ];

    if (stockInTypes.includes(type)) return true;
    if (stockOutTypes.includes(type)) return false;

    const note = String(item?.note || "")
        .trim()
        .toLowerCase();

    if (
        note.includes("รับของบริจาค") ||
        note.includes("รับเข้าคลัง") ||
        note.includes("ของเข้า")
    ) {
        return true;
    }

    if (
        note.includes("จ่ายสิ่งของ") ||
        note.includes("เบิกออก") ||
        note.includes("ของออก")
    ) {
        return false;
    }

    return Number(item?.quantity || 0) > 0;
}

export default function InventoryTransactionTable({ transactions }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <th className="p-4">วันที่</th>
                            <th className="p-4">ประเภท</th>
                            <th className="p-4">รายการ</th>
                            <th className="p-4 text-center">จำนวน</th>
                            <th className="p-4 text-center">ก่อน → หลัง</th>
                            <th className="p-4">อ้างอิง</th>
                            <th className="p-4">ผู้ทำรายการ</th>
                            <th className="p-4">หมายเหตุ</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                        {transactions.map((item, index) => {
                            const stockIn = isStockIn(item);

                            return (
                                <tr
                                    key={
                                        item.id ||
                                        `${item.createdAt}-${index}`
                                    }
                                    className="hover:bg-slate-50"
                                >
                                    <td className="whitespace-nowrap p-4 text-xs text-slate-500">
                                        {formatDate(item.createdAt)}
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={
                                                stockIn
                                                    ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
                                                    : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"
                                            }
                                        >
                                            {stockIn ? "ของเข้า" : "ของออก"}
                                        </span>
                                    </td>

                                    <td className="p-4 font-bold text-slate-700">
                                        {item.reliefItemName}
                                    </td>

                                    <td className="p-4 text-center font-bold">
                                        <span
                                            className={
                                                stockIn
                                                    ? "text-emerald-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {stockIn ? "+" : "-"}
                                            {Math.abs(
                                                Number(item.quantity || 0)
                                            ).toLocaleString("th-TH")}
                                        </span>{" "}
                                        <span className="text-xs font-normal text-slate-400">
                                            {item.unit}
                                        </span>
                                    </td>

                                    <td className="p-4 text-center text-slate-500">
                                        {item.quantityBefore ?? "-"} →{" "}
                                        {item.quantityAfter ?? "-"}
                                    </td>

                                    <td className="p-4 text-xs">
                                        {item.referenceType} /{" "}
                                        {item.referenceId}
                                    </td>

                                    <td className="p-4 text-slate-600">
                                        {item.createdBy || "-"}
                                    </td>

                                    <td className="p-4 text-slate-500">
                                        {item.note || "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
