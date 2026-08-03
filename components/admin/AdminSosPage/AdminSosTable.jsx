import AdminSosPriorityBadge from "./AdminSosPriorityBadge";
import AdminSosStatusBadge from "./AdminSosStatusBadge";

function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function isPending(status) {
    return (
        String(status || "")
            .trim()
            .toLowerCase() === "pending"
    );
}

export default function AdminSosTable({
    cases,
    onView,
    onAssign,
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="p-4">
                                Case ID
                            </th>
                            <th className="p-4">
                                ผู้แจ้ง
                            </th>
                            <th className="p-4">
                                พื้นที่ / ศูนย์
                            </th>
                            <th className="p-4 text-center">
                                ระดับ
                            </th>
                            <th className="p-4 text-center">
                                สถานะ
                            </th>
                            <th className="p-4">
                                ผู้รับผิดชอบ
                            </th>
                            <th className="p-4 text-right">
                                จัดการ
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                        {cases.map((item) => (
                            <tr
                                key={item.id}
                                className={
                                    String(item.priority)
                                        .toLowerCase() === "critical"
                                        ? "bg-red-50/30 hover:bg-red-50"
                                        : "hover:bg-slate-50"
                                }
                            >
                                <td className="p-4 font-mono text-slate-500">
                                    #{item.id}
                                    <p className="mt-1 text-[11px] font-sans text-slate-400">
                                        {formatDate(item.createdAt)}
                                    </p>
                                </td>

                                <td className="p-4">
                                    <p className="font-bold text-slate-800">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {item.phone}
                                    </p>
                                    {item.userRemark && (
                                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                            “{item.userRemark}”
                                        </p>
                                    )}
                                </td>

                                <td className="p-4">
                                    <p className="max-w-xs text-slate-600">
                                        {item.address}
                                    </p>
                                    <p className="mt-1 text-xs font-bold text-sky-600">
                                        {item.centerName}
                                    </p>
                                </td>

                                <td className="p-4 text-center">
                                    <AdminSosPriorityBadge
                                        priority={item.priority}
                                    />
                                </td>

                                <td className="p-4 text-center">
                                    <AdminSosStatusBadge
                                        status={item.status}
                                    />
                                </td>

                                <td className="p-4">
                                    {item.assignedStaffName ? (
                                        <div>
                                            <p className="font-bold text-slate-700">
                                                {item.assignedStaffName}
                                            </p>
                                            <p className="text-xs font-mono text-slate-400">
                                                #{item.assignedStaffId}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold text-orange-500">
                                            ยังไม่มอบหมาย
                                        </span>
                                    )}
                                </td>

                                <td className="p-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onView(item)}
                                        className="mr-2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                    >
                                        <span className="material-symbols-outlined text-[19px]">
                                            visibility
                                        </span>
                                    </button>

                                    {isPending(item.status) && (
                                        <button
                                            type="button"
                                            onClick={() => onAssign(item)}
                                            className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-700"
                                        >
                                            มอบหมาย Staff
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
