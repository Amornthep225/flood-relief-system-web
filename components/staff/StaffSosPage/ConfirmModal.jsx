export default function ConfirmModal({
    request,
    stockCheck,
    checkingStock,
    loading,
    onClose,
    onConfirm,
}) {
    const items = stockCheck?.items ?? [];
    const canConfirm =
        !checkingStock &&
        stockCheck?.isAllEnough === true;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="border-b border-slate-100 px-6 py-5 text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                        <span className="material-symbols-outlined text-4xl">
                            assignment_turned_in
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800">
                        ยืนยันการรับงาน
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        {stockCheck?.isEmergency
                            ? "เคส SOS ฉุกเฉินสำหรับเข้าช่วยเหลือ ณ จุดเกิดเหตุ"
                            : "ตรวจสอบสิ่งของในคลังก่อนรับผิดชอบเคส"}
                    </p>

                    <p className="mt-1 font-mono font-bold text-sky-600">
                        #{request.id}
                    </p>
                </div>

                {checkingStock ? (
                    <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-10">
                        <span className="material-symbols-outlined animate-spin text-5xl text-sky-500">
                            progress_activity
                        </span>

                        <p className="mt-4 font-bold text-slate-600">
                            กำลังตรวจสอบสิ่งของในคลัง...
                        </p>
                    </div>
                ) : (
                    <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
                        <div
                            className={`mb-5 rounded-2xl border p-4 ${
                                stockCheck?.isAllEnough
                                    ? "border-emerald-200 bg-emerald-50"
                                    : "border-red-200 bg-red-50"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`material-symbols-outlined text-3xl ${
                                        stockCheck?.isAllEnough
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {stockCheck?.isAllEnough
                                        ? "check_circle"
                                        : "warning"}
                                </span>

                                <div>
                                    <p
                                        className={`font-black ${
                                            stockCheck?.isAllEnough
                                                ? "text-emerald-700"
                                                : "text-red-700"
                                        }`}
                                    >
                                        {stockCheck?.isEmergency
                                            ? "SOS ฉุกเฉิน พร้อมรับเคสได้ทันที"
                                            : stockCheck?.isAllEnough
                                              ? "สิ่งของในคลังเพียงพอสำหรับเคสนี้"
                                              : "สิ่งของในคลังไม่เพียงพอ"}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {stockCheck?.isEmergency
                                            ? "ไม่ตรวจคลังสินค้า เนื่องจากเป็นภารกิจช่วยเหลือฉุกเฉิน"
                                            : `ศูนย์ ${stockCheck?.centerId || "-"}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {stockCheck?.isEmergency ? (
                            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-sm font-bold text-red-700">
                                เจ้าหน้าที่สามารถรับเคสและเดินทางไปยังพิกัด SOS ได้ทันที
                            </div>
                        ) : !items.length ? (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-sm font-bold text-amber-700">
                                ไม่พบรายการสิ่งของที่ผู้ประสบภัยร้องขอ
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div
                                        key={`${item.reliefItemId}-${index}`}
                                        className={`rounded-2xl border p-4 ${
                                            item.isEnough
                                                ? "border-emerald-200 bg-emerald-50/40"
                                                : "border-red-200 bg-red-50/60"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-black text-slate-800">
                                                    {item.reliefItemName}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    #{item.reliefItemId}
                                                </p>
                                            </div>

                                            {item.isEnough ? (
                                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                                                    เพียงพอ
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                                                    ขาด {item.shortageQuantity} {item.unit}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            <StockBox
                                                title="ต้องการ"
                                                value={item.requestedQuantity}
                                                unit={item.unit}
                                            />

                                            <StockBox
                                                title="คงเหลือ"
                                                value={item.availableQuantity}
                                                unit={item.unit}
                                            />

                                            <StockBox
                                                title="หลังจ่าย"
                                                value={item.remainingQuantity}
                                                unit={item.unit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!stockCheck?.isEmergency && (
                            <p className="mt-5 text-center text-xs text-slate-400">
                                ระบบยังไม่ได้หักสินค้าในขั้นตอนนี้ เป็นเพียงการตรวจสอบก่อนรับงาน
                            </p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl bg-white py-3 font-bold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-60"
                    >
                        {canConfirm ? "ยกเลิก" : "ปิด"}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading || !canConfirm}
                        className="rounded-xl bg-sky-600 py-3 font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    >
                        {loading
                            ? "กำลังรับงาน..."
                            : "ยืนยันรับงาน"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function StockBox({ title, value, unit }) {
    return (
        <div className="rounded-xl bg-white p-3 text-center shadow-sm">
            <p className="text-[11px] font-bold text-slate-400">
                {title}
            </p>

            <p className="mt-1 text-lg font-black text-slate-800">
                {value}
            </p>

            <p className="text-[10px] text-slate-400">
                {unit}
            </p>
        </div>
    );
}
