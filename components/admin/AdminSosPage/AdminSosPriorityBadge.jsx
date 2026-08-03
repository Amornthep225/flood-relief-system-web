export default function AdminSosPriorityBadge({
    priority,
}) {
    const value = String(priority || "")
        .trim()
        .toLowerCase();

    if (value === "critical") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                <span className="material-symbols-outlined text-[15px]">
                    crisis_alert
                </span>
                วิกฤต
            </span>
        );
    }

    if (value === "urgent") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                <span className="material-symbols-outlined text-[15px]">
                    warning
                </span>
                เร่งด่วน
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            ปกติ
        </span>
    );
}
