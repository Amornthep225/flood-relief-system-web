import UserWidget from "./UserWidget";

export default function ManageUserModal({
    user,
    isBanned,
    isSaving,
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
                            จัดการบัญชีผู้ใช้
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                            ตั้งค่าและควบคุมการเข้าใช้งานของผู้ใช้
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
                    <UserWidget user={user} isBanned={isBanned} onToggle={onToggle} />

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 rounded-xl border border-slate-200 transition-colors"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75"
                        >
                            {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}