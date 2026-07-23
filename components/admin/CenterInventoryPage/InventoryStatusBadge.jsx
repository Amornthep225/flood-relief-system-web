export default function InventoryStatusBadge({
    status,
}) {
    const config = {
        Normal: {
            label: "ปกติ",
            className:
                "border-teal-200 bg-teal-50 text-teal-700",
        },
        LowStock: {
            label: "ใกล้หมด",
            className:
                "border-orange-200 bg-orange-100 text-orange-700",
        },
        OutOfStock: {
            label: "หมดสต็อก",
            className:
                "border-red-200 bg-red-50 text-red-700",
        },
    };

    const current =
        config[status] ??
        config.Normal;

    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${current.className}`}
        >
            {current.label}
        </span>
    );
}
