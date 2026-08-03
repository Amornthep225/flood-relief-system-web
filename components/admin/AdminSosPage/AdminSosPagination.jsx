export default function AdminSosPagination({
    page,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
}) {
    const start =
        totalItems === 0
            ? 0
            : (page - 1) * pageSize + 1;

    const end = Math.min(
        page * pageSize,
        totalItems
    );

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
                แสดง {start}-{end} จาก {totalItems} รายการ
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 disabled:opacity-40"
                >
                    ก่อนหน้า
                </button>

                <span className="text-sm font-bold text-slate-600">
                    {page} / {totalPages}
                </span>

                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 disabled:opacity-40"
                >
                    ถัดไป
                </button>
            </div>
        </div>
    );
}
