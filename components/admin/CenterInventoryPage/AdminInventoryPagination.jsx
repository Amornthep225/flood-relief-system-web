export default function AdminInventoryPagination({
    page,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
}) {
    const start =
        totalItems === 0
            ? 0
            : (page - 1) *
                  pageSize +
              1;

    const end = Math.min(
        page * pageSize,
        totalItems
    );

    return (
        <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
                แสดง {start}-{end} จาก{" "}
                {totalItems} รายการ
            </p>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                        onPageChange(page - 1)
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40"
                >
                    ก่อนหน้า
                </button>

                {Array.from(
                    {
                        length: totalPages,
                    },
                    (_, index) =>
                        index + 1
                ).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        type="button"
                        onClick={() =>
                            onPageChange(
                                pageNumber
                            )
                        }
                        className={
                            page ===
                            pageNumber
                                ? "h-8 min-w-8 rounded-lg bg-teal-600 px-2 text-xs font-bold text-white"
                                : "h-8 min-w-8 rounded-lg border border-slate-200 px-2 text-xs font-bold"
                        }
                    >
                        {pageNumber}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={
                        page === totalPages
                    }
                    onClick={() =>
                        onPageChange(page + 1)
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40"
                >
                    ถัดไป
                </button>
            </div>
        </section>
    );
}
