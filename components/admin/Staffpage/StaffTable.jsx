import StaffStatusBadge from "./StaffStatusBadge";

export default function StaffTable({
    staffs,
    totalStaff,
    loading,
    onManage,
}) {
    return (
        <section className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                            <th className="p-4 font-bold w-16">ID</th>
                            <th className="p-4 font-bold">ชื่อ - สกุล</th>
                            <th className="p-4 font-bold">อีเมล</th>
                            <th className="p-4 font-bold text-center">สถานะ</th>
                            <th className="p-4 font-bold text-right">จัดการ</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm divide-y divide-slate-100">
                        {loading && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    กำลังโหลดข้อมูลเจ้าหน้าที่...
                                </td>
                            </tr>
                        )}

                        {!loading && staffs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    ไม่พบข้อมูลเจ้าหน้าที่
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            staffs.map((staff) => (
                                <tr
                                    key={staff.id}
                                    className={
                                        !staff.isActive
                                            ? "hover:bg-slate-50 transition-colors opacity-75 bg-slate-50"
                                            : "hover:bg-slate-50 transition-colors"
                                    }
                                >
                                    <td className="p-4 font-mono text-slate-400">
                                        {staff.id}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 bg-slate-800 text-white border-slate-100">
                                                {staff.fullName?.charAt(0) || "?"}
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-800">
                                                    {staff.fullName}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {staff.phoneNumber || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4 text-slate-500">
                                        {staff.email || "-"}
                                    </td>

                                    <td className="p-4 text-center">
                                        <StaffStatusBadge
                                            status={staff.isActive ? "active" : "banned"}
                                        />
                                    </td>

                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => onManage(staff)}
                                            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                edit_square
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="text-xs text-slate-500">
                    แสดง {staffs.length} จาก {totalStaff} รายการ
                </span>
            </div>
        </section>
    );
}