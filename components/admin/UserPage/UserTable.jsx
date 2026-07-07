import UserStatusBadge from "./UserStatusBadge";

export default function UserTable({ users, totalUsers, loading, onManage }) {
    return (
        <section className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                            <th className="p-4 font-bold w-16">ID</th>
                            <th className="p-4 font-bold">ชื่อผู้ใช้</th>
                            <th className="p-4 font-bold">ข้อมูลติดต่อ</th>
                            <th className="p-4 font-bold text-center">สถานะ</th>
                            <th className="p-4 font-bold text-right">จัดการ</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm divide-y divide-slate-100">
                        {loading && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    กำลังโหลดข้อมูลผู้ใช้...
                                </td>
                            </tr>
                        )}

                        {!loading && users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    ไม่พบข้อมูลผู้ใช้
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-mono text-slate-400">{user.id}</td>

                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-lg bg-blue-100 text-blue-600">
                                                {user.fullName?.charAt(0) || "?"}
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-800">
                                                    {user.fullName}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    เข้าร่วมเมื่อ: {formatDate(user.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4 text-slate-600 text-xs">
                                        <p>{user.email || "-"}</p>
                                        <p className="mt-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-slate-400 text-sm">
                                                call
                                            </span>
                                            {user.phoneNumber || "-"}
                                        </p>
                                    </td>

                                    <td className="p-4 text-center">
                                        <UserStatusBadge isActive={user.isActive} />
                                    </td>

                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => onManage(user)}
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
                    แสดง {users.length} จาก {totalUsers} รายการ
                </span>
            </div>
        </section>
    );
}

function formatDate(value) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("th-TH");
}