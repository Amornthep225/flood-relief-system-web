import StaffWidget from "./StaffWidget";

export default function ManageStaffModal({
    staff,
    isBanned,
    isSaving,
    editForm,
    onEditChange,
    onToggle,
    onClose,
    onSave,
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-sky-500">
                                manage_accounts
                            </span>
                            จัดการบัญชี
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            ตั้งค่าการเข้าถึงระบบของเจ้าหน้าที่
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>

                <div className="p-6">
                    <StaffWidget
                        staff={staff}
                        isBanned={isBanned}
                        onToggle={onToggle}
                        editForm={editForm}
                        onEditChange={onEditChange}
                    />

                    {isBanned && (
                        <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-600 flex gap-2">
                            <span className="material-symbols-outlined text-sm">
                                error
                            </span>
                            <span>
                                เมื่อระงับบัญชี เจ้าหน้าที่จะไม่สามารถเข้าสู่ระบบหรือรับงานใหม่ได้ทันที
                            </span>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 rounded-xl border border-slate-200 transition-colors"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}