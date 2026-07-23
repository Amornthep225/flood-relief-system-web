import Link from "next/link";

export default function AdminInventoryHeader({
    center,
    centerId,
    onRefresh,
}) {
    return (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/admin-centers"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                    >
                        <span className="material-symbols-outlined">
                            arrow_back
                        </span>
                    </Link>

                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            คลังสินค้า
                            {center?.centerName
                                ? ` — ${center.centerName}`
                                : ""}
                        </h1>

                        <p className="text-sm text-slate-500">
                            Center ID:{" "}
                            {centerId || "-"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        refresh
                    </span>
                    รีเฟรช
                </button>
            </div>
        </header>
    );
}
