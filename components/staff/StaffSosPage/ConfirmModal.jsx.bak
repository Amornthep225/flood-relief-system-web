export default function ConfirmModal({
    request,
    loading,
    onClose,
    onConfirm,
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                        <span className="material-symbols-outlined text-4xl">
                            assignment_turned_in
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800">
                        ยืนยันการรับงาน
                    </h3>

                    <p className="mt-3 text-sm text-slate-500">
                        คุณกำลังจะรับผิดชอบเคส
                    </p>

                    <p className="mt-1 font-mono font-bold text-sky-600">
                        #{request.id}
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                        หลังยืนยัน สถานะจะเปลี่ยนเป็น
                        “รับเรื่องแล้ว”
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl bg-slate-100 py-3 font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-60"
                        >
                            ยกเลิก
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className="rounded-xl bg-sky-600 py-3 font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "กำลังรับงาน..."
                                : "ยืนยันรับงาน"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}