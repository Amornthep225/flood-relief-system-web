export default function CrisisCaseListItem({ caseItem, onClick }) {
    const isEmergency =
        String(caseItem?.requestType || "").toLowerCase() === "emergency";

    return (
        <button
            onClick={onClick}
            className={`w-full rounded-xl border bg-white p-3 text-left shadow-sm transition ${
                isEmergency
                    ? "border-red-300 hover:bg-red-50/40"
                    : "border-sky-300 hover:bg-sky-50/50"
            }`}
        >
            <div className="flex justify-between gap-3">
                <div>
                    <p className="font-bold">
                        {isEmergency ? "SOS" : "คำขอ"} #{caseItem.id}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {caseItem.address}
                    </p>
                </div>
                {isEmergency ? (
                    <span className="h-fit shrink-0 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
                        วิกฤต
                    </span>
                ) : (
                    <span className="h-fit shrink-0 rounded-full bg-sky-100 px-2 py-1 text-[10px] font-bold text-sky-700">
                        ขอรับของ
                    </span>
                )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
                <span>{caseItem.userName}</span>
                <span
                    className={
                        caseItem.assignedStaffId
                            ? "font-bold text-blue-600"
                            : "font-bold text-orange-500"
                    }
                >
                    {caseItem.assignedStaffId ? "รับงานแล้ว" : "รอรับงาน"}
                </span>
            </div>

            <div
                className={`mt-3 flex items-center justify-end gap-1 border-t pt-2 text-xs font-bold ${
                    isEmergency ? "text-red-600" : "text-sky-600"
                }`}
            >
                ดูรายละเอียด
                <span className="material-symbols-outlined text-base">
                    chevron_right
                </span>
            </div>
        </button>
    );
}
