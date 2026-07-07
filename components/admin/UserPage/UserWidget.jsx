export default function UserWidget({ user, isBanned, onToggle }) {
    return (
        <>
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xl">
                    {user.fullName?.charAt(0) || "?"}
                </div>

                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                        User ID: <span className="text-slate-600">{user.id}</span>
                    </p>
                    <p className="font-bold text-slate-800">{user.fullName}</p>
                    <p className="text-xs text-slate-400">{user.email || "-"}</p>
                    <p className="text-xs text-slate-400">{user.phoneNumber || "-"}</p>
                </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="font-bold text-slate-800">สถานะการเข้าใช้งาน</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {isBanned ? (
                                <span className="text-red-500 font-bold">ระงับบัญชีชั่วคราว</span>
                            ) : (
                                <span className="text-green-600 font-bold">ใช้งานปกติ</span>
                            )}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onToggle}
                        className={
                            isBanned
                                ? "relative w-12 h-6 rounded-full bg-red-500 transition-colors"
                                : "relative w-12 h-6 rounded-full bg-green-500 transition-colors"
                        }
                    >
                        <span
                            className={
                                isBanned
                                    ? "absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                                    : "absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                            }
                        />
                    </button>
                </div>

                {isBanned && (
                    <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-600 flex gap-2">
                        <span className="material-symbols-outlined text-sm">error</span>
                        <span>
                            เมื่อระงับบัญชี ผู้ใช้จะไม่สามารถล็อกอิน แจ้งเหตุ หรือทำรายการใดๆ ในระบบได้
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}