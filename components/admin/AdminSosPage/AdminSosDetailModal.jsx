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

export default function AdminSosDetailModal({
    caseItem,
    onClose,
}) {
    if (!caseItem) {
        return null;
    }

    const mapsUrl =
        caseItem.latitude &&
        caseItem.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${caseItem.latitude},${caseItem.longitude}`
            : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50 p-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            รายละเอียด SOS
                        </h2>

                        <p className="mt-1 font-mono text-sm text-slate-500">
                            #{caseItem.id}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <AdminSosPriorityBadge
                            priority={caseItem.priority}
                        />
                        <AdminSosStatusBadge
                            status={caseItem.status}
                        />
                    </div>
                </div>

                <div className="space-y-5 p-6">
                    <Section title="ข้อมูลผู้แจ้ง">
                        <Info
                            label="ชื่อ"
                            value={caseItem.name}
                        />
                        <Info
                            label="เบอร์ติดต่อ"
                            value={caseItem.phone}
                        />
                        <Info
                            label="วันที่แจ้ง"
                            value={formatDate(
                                caseItem.createdAt
                            )}
                        />
                    </Section>

                    <Section title="สถานที่และศูนย์">
                        <Info
                            label="ที่อยู่"
                            value={caseItem.address}
                        />
                        <Info
                            label="ศูนย์"
                            value={caseItem.centerName}
                        />
                        <Info
                            label="พิกัด"
                            value={`${caseItem.latitude}, ${caseItem.longitude}`}
                        />
                    </Section>

                    {caseItem.userRemark && (
                        <TextBlock
                            title="รายละเอียดจากผู้แจ้ง"
                            value={caseItem.userRemark}
                        />
                    )}

                    <Section title="การมอบหมาย">
                        <Info
                            label="เจ้าหน้าที่"
                            value={
                                caseItem.assignedStaffName ||
                                "ยังไม่มอบหมาย"
                            }
                        />
                        <Info
                            label="Staff ID"
                            value={
                                caseItem.assignedStaffId ||
                                "-"
                            }
                        />
                    </Section>

                    {caseItem.staffRemark && (
                        <TextBlock
                            title="หมายเหตุเจ้าหน้าที่"
                            value={caseItem.staffRemark}
                        />
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row">
                        {mapsUrl && (
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-bold text-slate-600 hover:text-sky-600"
                            >
                                <span className="material-symbols-outlined">
                                    map
                                </span>
                                เปิด Google Maps
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-slate-800 py-3 font-bold text-white"
                        >
                            ปิดหน้าต่าง
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({
    title,
    children,
}) {
    return (
        <div className="rounded-xl border border-slate-100 p-4">
            <p className="mb-3 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {title}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {children}
            </div>
        </div>
    );
}

function Info({
    label,
    value,
}) {
    return (
        <div>
            <p className="text-xs text-slate-400">
                {label}
            </p>
            <p className="mt-1 font-bold text-slate-700">
                {value || "-"}
            </p>
        </div>
    );
}

function TextBlock({
    title,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {title}
            </p>
            <p className="mt-2 text-sm text-slate-700">
                {value}
            </p>
        </div>
    );
}
