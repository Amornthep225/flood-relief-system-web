"use client";

import { useState } from "react";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
const mockData = {
    summary: {
        totalStaff: "48",
        activeStaff: "32",
    },

    staffs: [
        {
            id: "S001",
            name: "นายสมชาย ใจดี",
            phone: "089-123-4567",
            avatar: "สม",
            avatarStyle: "bg-slate-800 text-white border-slate-100",
            status: "active",
        },
        {
            id: "S002",
            name: "นายวิชัย มุ่งมั่น",
            phone: "081-999-8888",
            avatar: "วิ",
            avatarStyle: "bg-slate-200 text-slate-500 border-white",
            status: "active",
        },
        {
            id: "S003",
            name: "น.ส. กานดา รักดี",
            phone: "092-555-4444",
            avatar: "ก",
            avatarStyle: "bg-slate-200 text-slate-500 border-white",
            status: "banned",
        },
    ],
};

export default function AdminStaffPage() {
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isBanned, setIsBanned] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const filteredStaffs = mockData.staffs.filter((staff) => {
        const keyword = searchText.toLowerCase();

        const matchSearch =
            staff.id.toLowerCase().includes(keyword) ||
            staff.name.toLowerCase().includes(keyword) ||
            staff.phone.toLowerCase().includes(keyword);

        if (filter === "all") return matchSearch;
        if (filter === "active") return matchSearch && staff.status === "active";
        if (filter === "banned") return matchSearch && staff.status === "banned";

        return matchSearch;
    });

    const openManageModal = (staff) => {
        setSelectedStaff(staff);
        setIsBanned(staff.status === "banned");
    };

    const saveManage = () => {
        setIsSaving(true);

        setTimeout(() => {
            alert(`อัปเดตสถานะของ ${selectedStaff.id} เรียบร้อยแล้ว`);
            setIsSaving(false);
            setSelectedStaff(null);
        }, 800);
    };

    return (
                <RoleGuard
            role="Admin"
            storageKey="admin"
            loginPath="/admin-login"
        >
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="flex items-center justify-between bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        ทีมงานและเจ้าหน้าที่
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-md font-bold">
                            Staff Team
                        </span>
                    </h2>
                </div>

                <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Export รายชื่อ
                </button>
            </header>

            <main className="p-8 max-w-[1400px] mx-auto w-full">
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <SummaryCard
                        title="เจ้าหน้าที่ทั้งหมด"
                        number={mockData.summary.totalStaff}
                        icon="groups"
                        boxStyle="bg-white border-slate-200"
                        textStyle="text-slate-500"
                        numberStyle="text-slate-800"
                        iconStyle="bg-slate-100 text-slate-500"
                    />

                    <SummaryCard
                        title="ปฏิบัติงานอยู่ (Active)"
                        number={mockData.summary.activeStaff}
                        icon="check_circle"
                        boxStyle="bg-green-50 border-green-100"
                        textStyle="text-green-600 font-bold"
                        numberStyle="text-green-700"
                        iconStyle="bg-white text-green-500 animate-pulse"
                    />
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
                                placeholder="ค้นหาชื่อ, รหัส, เบอร์โทร..."
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
                        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                            ทั้งหมด
                        </FilterButton>

                        <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>
                            <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                ออนไลน์
                            </span>
                        </FilterButton>

                        <FilterButton active={filter === "banned"} onClick={() => setFilter("banned")}>
                            <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                ออฟไลน์
                            </span>
                        </FilterButton>
                    </div>
                </section>

                <section className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                    <th className="p-4 font-bold w-16">ID</th>
                                    <th className="p-4 font-bold">ชื่อ - สกุล</th>
                                    <th className="p-4 font-bold text-center">สถานะ</th>
                                    <th className="p-4 font-bold text-right">จัดการ</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm divide-y divide-slate-100">
                                {filteredStaffs.map((staff) => (
                                    <tr
                                        key={staff.id}
                                        className={
                                            staff.status === "banned"
                                                ? "hover:bg-slate-50 transition-colors opacity-75 bg-slate-50"
                                                : "hover:bg-slate-50 transition-colors"
                                        }
                                    >
                                        <td className="p-4 font-mono text-slate-400">
                                            {staff.id}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${staff.avatarStyle}`}
                                                >
                                                    {staff.avatar}
                                                </div>

                                                <div>
                                                    <p className="font-bold text-slate-800">
                                                        {staff.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {staff.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <StaffStatusBadge status={staff.status} />
                                        </td>

                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => openManageModal(staff)}
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
                            แสดง 1-{filteredStaffs.length} จาก 48 รายการ
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

            {selectedStaff && (
                <ManageStaffModal
                    staff={selectedStaff}
                    isBanned={isBanned}
                    isSaving={isSaving}
                    onToggle={() => setIsBanned((prev) => !prev)}
                    onClose={() => setSelectedStaff(null)}
                    onSave={saveManage}
                />
            )}
        </div>
        </RoleGuard>
    );
}

function SummaryCard({
    title,
    number,
    icon,
    boxStyle,
    textStyle,
    numberStyle,
    iconStyle,
}) {
    return (
        <div
            className={`${boxStyle} p-4 rounded-xl border shadow-sm flex items-center justify-between`}
        >
            <div>
                <p className={`text-xs mb-1 ${textStyle}`}>{title}</p>
                <h3 className={`text-2xl font-bold ${numberStyle}`}>{number}</h3>
            </div>

            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${iconStyle}`}
            >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </div>
        </div>
    );
}

function FilterButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={
                active
                    ? "px-4 py-1.5 bg-slate-800 text-white rounded-full text-xs font-bold shadow-sm whitespace-nowrap"
                    : "px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 rounded-full text-xs font-bold transition-colors whitespace-nowrap"
            }
        >
            {children}
        </button>
    );
}

function StaffStatusBadge({ status }) {
    if (status === "active") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                ใช้งานปกติ
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <span className="material-symbols-outlined text-[12px]">block</span>
            ถูกระงับ
        </span>
    );
}

function ManageStaffModal({
    staff,
    isBanned,
    isSaving,
    onToggle,
    onClose,
    onSave,
}) {
    const avatar = staff.name.charAt(0);

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
                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xl">
                            {avatar}
                        </div>

                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                                Staff ID:{" "}
                                <span className="text-slate-600">{staff.id}</span>
                            </p>
                            <p className="font-bold text-slate-800">{staff.name}</p>
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
                                    เมื่อระงับบัญชี เจ้าหน้าที่จะไม่สามารถเข้าสู่ระบบหรือรับงานใหม่ได้ทันที
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