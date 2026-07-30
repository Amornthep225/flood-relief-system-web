export default function DonationSearchForm({
    trackingId,
    onTrackingIdChange,
    onSearch,
    onOpenScanner,
    isLoading,
}) {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onSearch();
            }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <label
                htmlFor="donationTrackingId"
                className="mb-2 block text-sm font-bold text-slate-700"
            >
                รหัสบริจาค (Tracking ID)
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <input
                        id="donationTrackingId"
                        type="text"
                        value={trackingId}
                        onChange={(event) =>
                            onTrackingIdChange(event.target.value)
                        }
                        placeholder="เช่น 0000000001 หรือวางลิงก์จาก QR Code"
                        autoComplete="off"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 font-mono text-slate-800 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    />

                    <button
                        type="button"
                        onClick={onOpenScanner}
                        aria-label="สแกน QR Code"
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                    >
                        <span className="material-symbols-outlined">
                            qr_code_scanner
                        </span>
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 font-bold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="material-symbols-outlined text-xl">
                        {isLoading ? "progress_activity" : "search"}
                    </span>
                    {isLoading ? "กำลังค้นหา..." : "ค้นหาข้อมูล"}
                </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
                รองรับทั้งรหัส 10 หลัก และลิงก์ที่ได้จากการสแกน QR Code
            </p>
        </form>
    );
}
