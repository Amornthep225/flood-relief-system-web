"use client";

import { useState } from "react";

const mockData = {
    summary: {
        totalUsers: "8,124",
    },

    users: [
        {
            id: "001",
            name: "คุณ อมรเทพ ถายะ",
            phone: "089-123-4567",
            joinedAt: "25 ธ.ค. 68",
            avatar: "อ",
            avatarStyle: "bg-blue-100 text-blue-600",
            isNew: false,
            status: "active",
        },
        {
            id: "002",
            name: "Wilson Parker",
            phone: "091-999-8888",
            joinedAt: "10 ม.ค. 69",
            avatar: "W",
            avatarStyle: "bg-slate-200 text-slate-500",
            isNew: false,
            status: "active",
        },
        {
            id: "003",
            name: "มานะ พากเพียร",
            phone: "081-555-4444",
            joinedAt: "วันนี้",
            avatar: "ม",
            avatarStyle: "bg-orange-100 text-orange-600",
            isNew: true,
            status: "active",
        },
    ],
};

export default function AdminUsersPage() {
    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isBanned, setIsBanned] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const filteredUsers = mockData.users.filter((user) => {
        const keyword = searchText.toLowerCase();

        return (
            user.id.toLowerCase().includes(keyword) ||
            user.name.toLowerCase().includes(keyword) ||
            user.phone.toLowerCase().includes(keyword)
        );
    });

    const openManageModal = (user) => {
        setSelectedUser(user);
        setIsBanned(false);
    };

    const saveManage = () => {
        setIsSaving(true);

        setTimeout(() => {
            alert(`อัปเดตสถานะของบัญชีผู้ใช้ ${selectedUser.id} เรียบร้อยแล้ว`);
            setIsSaving(false);
            setSelectedUser(null);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="flex items-center justify-between bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        ฐานข้อมูลผู้ใช้
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-500 text-xs rounded-md font-bold">
                            User Database
                        </span>
                    </h2>
                </div>

                <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <span className="material-symbols-outlined text-sm">ios_share</span>
                    Export รายชื่อ
                </button>
            </header>

            <main className="p-8 max-w-[1400px] mx-auto w-full">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">ผู้ใช้ทั้งหมด</p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                {mockData.summary.totalUsers}
                            </h3>
                        </div>

                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined text-2xl">groups</span>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">
                                search
                            </span>

                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                            />
                        </div>

                        <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg border border-slate-200 w-10">
                            <span className="material-symbols-outlined text-sm">
                                filter_list
                            </span>
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
                        <button className="px-4 py-1.5 bg-slate-800 text-white rounded-full text-xs font-bold shadow-sm whitespace-nowrap">
                            ทั้งหมด
                        </button>

                        <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 rounded-full text-xs font-bold transition-colors whitespace-nowrap">
                            ล่าสุด
                        </button>
                    </div>
                </section>

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
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="p-4 font-mono text-slate-400">
                                            {user.id}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-lg ${user.avatarStyle}`}
                                                >
                                                    {user.avatar}
                                                </div>

                                                <div>
                                                    <p className="font-bold text-slate-800">
                                                        {user.name}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        เข้าร่วมเมื่อ: {user.joinedAt}
                                                    </p>

                                                    {user.isNew && (
                                                        <span className="bg-blue-100 text-blue-600 text-[9px] px-1.5 rounded font-bold">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-slate-600 text-xs">
                                            <p className="mt-1 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-slate-400 text-sm">
                                                    call
                                                </span>
                                                {user.phone}
                                            </p>
                                        </td>

                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                                                ใช้งานปกติ
                                            </span>
                                        </td>

                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => openManageModal(user)}
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
                            แสดง 1-{filteredUsers.length} จาก 8,124 รายการ
                        </span>

                        <div className="flex gap-1">
                            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500 hover:bg-slate-100">
                                Previous
                            </button>
                            <button className="px-3 py-1 bg-sky-500 text-white rounded text-xs">
                                1
                            </button>
                            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500 hover:bg-slate-100">
                                2
                            </button>
                            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500 hover:bg-slate-100">
                                Next
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {selectedUser && (
                <ManageUserModal
                    user={selectedUser}
                    isBanned={isBanned}
                    isSaving={isSaving}
                    onToggle={() => setIsBanned((prev) => !prev)}
                    onClose={() => setSelectedUser(null)}
                    onSave={saveManage}
                />
            )}
        </div>
    );
}

function ManageUserModal({
    user,
    isBanned,
    isSaving,
    onToggle,
    onClose,
    onSave,
}) {
    const avatar = user.name.replace("คุณ ", "").charAt(0);

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
                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xl">
                            {avatar}
                        </div>

                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                                User ID:{" "}
                                <span className="text-slate-600">{user.id}</span>
                            </p>
                            <p className="font-bold text-slate-800">{user.name}</p>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-5 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="font-bold text-slate-800">
                                    สถานะการเข้าใช้งาน
                                </p>

                                <p className="text-xs text-slate-500 mt-0.5">
                                    {isBanned ? (
                                        <span className="text-red-500 font-bold">
                                            ระงับบัญชีชั่วคราว
                                        </span>
                                    ) : (
                                        <span className="text-green-600 font-bold">
                                            ใช้งานปกติ
                                        </span>
                                    )}
                                </p>
                            </div>

                            <button
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
                                <span className="material-symbols-outlined text-sm">
                                    error
                                </span>
                                <span>
                                    เมื่อระงับบัญชี ผู้ใช้จะไม่สามารถล็อกอิน แจ้งเหตุ หรือทำรายการใดๆ ในระบบได้
                                </span>
                            </div>
                        )}
                    </div>

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