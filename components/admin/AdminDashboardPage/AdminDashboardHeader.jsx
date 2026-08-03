function formatUpdatedAt(value) {
    if (!value) {
        return "ยังไม่ได้อัปเดต";
    }

    return new Intl.DateTimeFormat(
        "th-TH",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(value);
}

export default function AdminDashboardHeader({
    updatedAt,
    refreshing,
    onRefresh,
}) {
    let adminName = "Admin";

    if (
        typeof window !==
        "undefined"
    ) {
        try {
            const admin = JSON.parse(
                localStorage.getItem(
                    "admin"
                ) || "{}"
            );

            adminName =
                admin?.fullName ||
                admin?.name ||
                adminName;
        } catch {
            // ใช้ค่าเริ่มต้น
        }
    }

    return (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div>
                <h1 className="text-xl font-black text-slate-800">
                    Dashboard ภาพรวม
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                    อัปเดตล่าสุด:{" "}
                    {formatUpdatedAt(
                        updatedAt
                    )}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-sky-50 hover:text-sky-600 disabled:opacity-50"
                >
                    <span
                        className={`material-symbols-outlined ${
                            refreshing
                                ? "animate-spin"
                                : ""
                        }`}
                    >
                        refresh
                    </span>
                </button>

                <div className="hidden border-l border-slate-200 pl-4 text-right sm:block">
                    <p className="text-sm font-bold text-slate-700">
                        {adminName}
                    </p>

                    <p className="text-xs text-slate-500">
                        ผู้ดูแลระบบ
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-slate-500 shadow-sm">
                    <span className="material-symbols-outlined">
                        person
                    </span>
                </div>
            </div>
        </header>
    );
}
