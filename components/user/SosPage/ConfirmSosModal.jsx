import { buttons } from "@/constants/buttons";

export default function ConfirmSosModal({
    isSubmitting,
    onClose,
    onConfirm,
}) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 text-center shadow-2xl">
                <div className="w-20 h-20 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-5xl">
                        assignment_turned_in
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    ส่งคำขอรับความช่วยเหลือ?
                </h3>

                <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                    ข้อมูลพิกัดและรายการสิ่งของจะถูกส่งไปยังศูนย์ช่วยเหลือ
                    เพื่อให้เจ้าหน้าที่ดำเนินการโดยเร็วที่สุด
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className={buttons.userSosForm.cancel}
                    >
                        ย้อนกลับ
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className={buttons.userSosForm.confirm}
                    >
                        {isSubmitting
                            ? "กำลังส่งข้อมูล..."
                            : "ยืนยันส่ง"}
                    </button>
                </div>
            </div>
        </div>
    );
}