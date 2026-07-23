export default function CenterStatusBadge({
    status,
}) {
    const config = {
        active: {
            label: "เปิดรับของ",
            className:
                "border-teal-200 bg-teal-50 text-teal-700",
        },
        low: {
            label: "ของใกล้หมด",
            className:
                "border-orange-200 bg-orange-100 text-orange-700",
        },
        closed: {
            label: "ปิดชั่วคราว",
            className:
                "border-slate-200 bg-slate-100 text-slate-600",
        },
    };

    const current =
        config[status] ??
        config.closed;

    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${current.className}`}
        >
            {current.label}
        </span>
    );
}
