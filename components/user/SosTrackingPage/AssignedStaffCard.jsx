export default function AssignedStaffCard({
    staffName,
    phoneNumber,
    centerName,
}) {
    if (!staffName) {
        return null;
    }

    return (
        <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-400 shadow-sm shrink-0">
                <span className="material-symbols-outlined">
                    support_agent
                </span>
            </div>

            <div className="min-w-0">
                <p className="font-bold text-sm text-slate-800 truncate">
                    {staffName}
                </p>

                <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {centerName || "เจ้าหน้าที่ช่วยเหลือ"}
                </p>

                {phoneNumber && (
                    <p className="text-xs text-slate-400 mt-0.5">
                        {phoneNumber}
                    </p>
                )}
            </div>

            {phoneNumber && (
                <a
                    href={`tel:${phoneNumber}`}
                    className="ml-auto bg-green-500 hover:bg-green-600 active:scale-95 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all shrink-0"
                    aria-label={`โทรหา ${staffName}`}
                >
                    <span className="material-symbols-outlined">
                        call
                    </span>
                </a>
            )}
        </div>
    );
}