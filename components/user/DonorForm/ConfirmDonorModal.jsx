export default function ConfirmDonorModal({
    selectedCount,
    isSubmitting,
    onClose,
    onConfirm
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">

                {/* Heart/Volunteering Icon */}
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <span className="material-symbols-outlined text-4xl">
                        volunteer_activism
                    </span>
                </div>

                {/* Modal Titles */}
                <h2 className="text-2xl font-bold text-slate-800">
                    ยืนยันการบริจาค
                </h2>
                <p className="my-4 text-slate-600 font-medium text-sm">
                    คุณกำลังจะส่งรายการบริจาคจำนวน{" "}
                    <span className="text-red-500 font-bold">{selectedCount}</span> รายการ
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-slate-200 py-3 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        ย้อนกลับ
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="rounded-xl bg-red-500 hover:bg-red-600 active:scale-[0.98] py-3 font-bold text-white shadow-md shadow-red-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                กำลังส่ง...
                            </>
                        ) : (
                            "ยืนยัน"
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}