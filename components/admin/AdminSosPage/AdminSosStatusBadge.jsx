export default function AdminSosStatusBadge({
    status,
}) {
    const value = String(status || "")
        .trim()
        .toLowerCase();

    const configs = {
        pending: {
            label: "รอรับเรื่อง",
            className:
                "border-slate-200 bg-slate-100 text-slate-600",
        },
        accepted: {
            label: "รับงานแล้ว",
            className:
                "border-blue-200 bg-blue-50 text-blue-600",
        },
        preparing: {
            label: "กำลังเตรียมของ",
            className:
                "border-indigo-200 bg-indigo-50 text-indigo-600",
        },
        delivering: {
            label: "กำลังช่วยเหลือ",
            className:
                "border-sky-200 bg-sky-50 text-sky-600",
        },
        completed: {
            label: "เสร็จสิ้น",
            className:
                "border-green-200 bg-green-100 text-green-600",
        },
        cancelled: {
            label: "ยกเลิก",
            className:
                "border-red-200 bg-red-50 text-red-600",
        },
        canceled: {
            label: "ยกเลิก",
            className:
                "border-red-200 bg-red-50 text-red-600",
        },
    };

    const config =
        configs[value] || {
            label: status || "-",
            className:
                "border-slate-200 bg-white text-slate-500",
        };

    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${config.className}`}
        >
            {config.label}
        </span>
    );
}
