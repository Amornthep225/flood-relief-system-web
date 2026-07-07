export default function StaffWidget({
    staff,
    isBanned,
    onToggle,
    editForm,
    onEditChange,
}) {
    return (
        <>
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xl">
                    {staff.fullName?.charAt(0) || "?"}
                </div>

                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                        Staff ID: <span className="text-slate-600">{staff.id}</span>
                    </p>
                    <p className="font-bold text-slate-800">{staff.fullName}</p>
                    <p className="text-xs text-slate-400">{staff.phoneNumber || "-"}</p>
                    <p className="text-xs text-slate-400">Center ID: {staff.centerId || "-"}</p>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <input
                    name="centerId"
                    value={editForm.centerId}
                    onChange={onEditChange}
                    placeholder="Center ID"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                />

                <input
                    name="fullName"
                    value={editForm.fullName}
                    onChange={onEditChange}
                    placeholder="ชื่อ-นามสกุล"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                />

                <input
                    name="username"
                    value={editForm.username}
                    onChange={onEditChange}
                    placeholder="Username"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                />

                <input
                    name="email"
                    value={editForm.email}
                    onChange={onEditChange}
                    placeholder="Email"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                />

                <input
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={onEditChange}
                    placeholder="เบอร์โทร"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                />
            </div>

            <div className="border border-slate-200 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-800">สถานะการเข้าใช้งาน</p>
                        <p className="text-xs mt-0.5">
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
                                ? "relative w-12 h-6 rounded-full bg-red-500"
                                : "relative w-12 h-6 rounded-full bg-green-500"
                        }
                    >
                        <span
                            className={
                                isBanned
                                    ? "absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white"
                                    : "absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white"
                            }
                        />
                    </button>
                </div>
            </div>
        </>
    );
}