export default function ConfirmSosModal({
    isSubmitting,
    selectedItemCount,
    reliefBagQuantity,
    onClose,
    onConfirm,
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500">
                    <span className="material-symbols-outlined text-5xl">
                        emergency
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-800">
                    ยืนยันการส่งคำขอ SOS
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    กรุณาตรวจสอบข้อมูลให้ถูกต้อง
                    เมื่อยืนยันแล้วคำขอจะถูกส่งให้เจ้าหน้าที่ดำเนินการ
                </p>

                <div className="my-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs text-slate-400">
                            รายการสิ่งของ
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-800">
                            {selectedItemCount}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs text-slate-400">
                            ถุงยังชีพ
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-800">
                            {reliefBagQuantity}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-slate-200 bg-white py-3 font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        ย้อนกลับ
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="rounded-xl bg-red-500 py-3 font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting
                            ? "กำลังส่ง..."
                            : "ยืนยันส่ง"}
                    </button>
                </div>
            </div>
        </div>
    );
}