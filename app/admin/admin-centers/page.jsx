"use client";

import { useState } from "react";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
const mockData = {
    summary: [
        {
            title: "จุดรับบริจาคทั้งหมด",
            number: "12",
            icon: "apartment",
            boxStyle: "bg-white border-slate-200",
            textStyle: "text-slate-500",
            numberStyle: "text-slate-800",
            iconStyle: "bg-slate-100 text-slate-500",
        },
        {
            title: "เปิดรับของ (Active)",
            number: "10",
            icon: "door_open",
            boxStyle: "bg-teal-50 border-teal-100",
            textStyle: "text-teal-600 font-bold",
            numberStyle: "text-teal-700",
            iconStyle: "bg-white text-teal-500",
        },
        {
            title: "จุดที่ของใกล้หมด",
            number: "2",
            icon: "inventory_2",
            boxStyle: "bg-orange-50 border-orange-100",
            textStyle: "text-orange-600 font-bold",
            numberStyle: "text-orange-700",
            iconStyle: "bg-white text-orange-500 animate-pulse",
        },
        {
            title: "ยอดสิ่งของในคลังรวม",
            number: "15,420",
            unit: "ชิ้น",
            icon: "inventory",
            boxStyle: "bg-slate-800 border-slate-700 text-white",
            textStyle: "text-slate-300",
            numberStyle: "text-white",
            iconStyle: "bg-slate-700 text-slate-300",
        },
    ],

    centers: [
        {
            id: "C01",
            name: "จุดรับบริจาคโรงเรียนเทศบาล 1",
            location: "อ.เมือง จ.เชียงราย",
            manager: "นายสมโภช รักดี",
            phone: "089-111-2222",
            status: "active",
            icon: "school",
            iconStyle: "bg-teal-100 text-teal-600 border-teal-200",
        },
        {
            id: "C02",
            name: "ศูนย์รับบริจาควัดดอน",
            location: "อ.แม่สาย จ.เชียงราย",
            manager: "พระมหาชัย",
            phone: "081-999-8888",
            status: "low",
            icon: "temple_buddhist",
            iconStyle: "bg-orange-100 text-orange-600 border-orange-200",
        },
        {
            id: "C03",
            name: "จุดพักของบริจาค อบต.เวียง",
            location: "อ.เวียงป่าเป้า จ.เชียงราย",
            manager: "น.ส. วารุณี",
            phone: "092-333-4444",
            status: "closed",
            icon: "camping",
            iconStyle: "bg-slate-200 text-slate-500 border-slate-300",
        },
    ],
};

export default function AdminCentersPage() {
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");
    const [modalMode, setModalMode] = useState(null);
    const [form, setForm] = useState({
        id: "",
        name: "",
        address: "",
        manager: "",
        phone: "",
        isActive: true,
    });

    const filteredCenters = mockData.centers.filter((center) => {
        const keyword = searchText.toLowerCase();

        const matchSearch =
            center.name.toLowerCase().includes(keyword) ||
            center.location.toLowerCase().includes(keyword) ||
            center.manager.toLowerCase().includes(keyword);

        if (filter === "all") return matchSearch;
        if (filter === "active") return matchSearch && center.status === "active";
        if (filter === "low") return matchSearch && center.status === "low";
        if (filter === "closed") return matchSearch && center.status === "closed";

        return matchSearch;
    });

    const openAddModal = () => {
        setModalMode("add");
        setForm({
            id: "",
            name: "",
            address: "",
            manager: "",
            phone: "",
            isActive: true,
        });
    };

    const openEditModal = (center) => {
        setModalMode("edit");
        setForm({
            id: center.id,
            name: center.name,
            address: center.location,
            manager: center.manager,
            phone: center.phone,
            isActive: center.status !== "closed",
        });
    };

    const saveCenter = () => {
        alert(
            modalMode === "edit"
                ? "อัปเดตข้อมูลจุดรับบริจาคเรียบร้อยแล้ว"
                : "เพิ่มจุดรับบริจาคใหม่เข้าสู่ระบบเรียบร้อยแล้ว"
        );

        setModalMode(null);
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
                        จัดการจุดรับบริจาค
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-md font-bold">
                            Donation Centers
                        </span>
                    </h2>
                </div>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-teal-500/30 transition-all"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    เพิ่มศูนย์ใหม่
                </button>
            </header>

            <main className="p-8 max-w-[1400px] mx-auto w-full">
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {mockData.summary.map((item) => (
                        <SummaryCard key={item.title} item={item} />
                    ))}
                </section>

                <section className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                    <div className="relative w-full md:w-auto">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">
                            search
                        </span>

                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="ค้นหาชื่อศูนย์, เขต/อำเภอ..."
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
                        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                            ทั้งหมด
                        </FilterButton>
                        <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>
                            เปิดรับของ
                        </FilterButton>
                        <FilterButton active={filter === "low"} onClick={() => setFilter("low")}>
                            ของใกล้หมด
                        </FilterButton>
                        <FilterButton active={filter === "closed"} onClick={() => setFilter("closed")}>
                            ปิดชั่วคราว
                        </FilterButton>
                    </div>
                </section>

                <section className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                    <th className="p-4 font-bold w-16">ID</th>
                                    <th className="p-4 font-bold">ข้อมูลจุดรับบริจาค</th>
                                    <th className="p-4 font-bold">ผู้ดูแล</th>
                                    <th className="p-4 font-bold text-center">สถานะ</th>
                                    <th className="p-4 font-bold text-right">จัดการ</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm divide-y divide-slate-100">
                                {filteredCenters.map((center) => (
                                    <tr
                                        key={center.id}
                                        className={
                                            center.status === "low"
                                                ? "hover:bg-slate-50 transition-colors bg-orange-50/30"
                                                : center.status === "closed"
                                                    ? "hover:bg-slate-50 transition-colors opacity-75"
                                                    : "hover:bg-slate-50 transition-colors"
                                        }
                                    >
                                        <td className="p-4 font-mono text-slate-400">
                                            {center.id}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${center.iconStyle}`}
                                                >
                                                    <span className="material-symbols-outlined text-xl">
                                                        {center.icon}
                                                    </span>
                                                </div>

                                                <div>
                                                    <p className="font-bold text-slate-800">
                                                        {center.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">
                                                            location_on
                                                        </span>
                                                        {center.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <p className="font-medium text-slate-700">
                                                {center.manager}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {center.phone}
                                            </p>
                                        </td>

                                        <td className="p-4 text-center">
                                            <CenterStatusBadge status={center.status} />
                                        </td>

                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {center.status !== "closed" && (
                                                    <a
                                                        href="/admin/inventory"
                                                        className="text-slate-400 hover:text-sky-500 p-2 rounded-full hover:bg-slate-100 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">
                                                            inventory_2
                                                        </span>
                                                    </a>
                                                )}

                                                <button
                                                    onClick={() => openEditModal(center)}
                                                    className="text-slate-400 hover:text-teal-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        edit_square
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                        <span className="text-xs text-slate-500">
                            แสดง 1-{filteredCenters.length} จาก 12 จุดรับบริจาค
                        </span>

                        <div className="flex gap-1">
                            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500 hover:bg-slate-100">
                                Previous
                            </button>
                            <button className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-bold">
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

            {modalMode && (
                <CenterModal
                    mode={modalMode}
                    form={form}
                    setForm={setForm}
                    onClose={() => setModalMode(null)}
                    onSave={saveCenter}
                />
            )}
        </div>
        </RoleGuard>
    );
}

function SummaryCard({ item }) {
    return (
        <div
            className={`${item.boxStyle} p-4 rounded-xl border shadow-sm flex items-center justify-between`}
        >
            <div>
                <p className={`text-xs mb-1 ${item.textStyle}`}>
                    {item.title}
                </p>

                <h3 className={`text-2xl font-bold ${item.numberStyle}`}>
                    {item.number}
                    {item.unit && (
                        <span className="text-sm font-normal text-slate-400 ml-1">
                            {item.unit}
                        </span>
                    )}
                </h3>
            </div>

            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${item.iconStyle}`}
            >
                <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                </span>
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
                    : "px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600 rounded-full text-xs font-bold transition-colors whitespace-nowrap"
            }
        >
            {children}
        </button>
    );
}

function CenterStatusBadge({ status }) {
    if (status === "active") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                เปิดรับของ
            </span>
        );
    }

    if (status === "low") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                <span className="material-symbols-outlined text-[12px]">
                    warning
                </span>
                ของใกล้หมด
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="material-symbols-outlined text-[12px]">
                lock
            </span>
            ปิดทำการชั่วคราว
        </span>
    );
}

function CenterModal({ mode, form, setForm, onClose, onSave }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 py-8 overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden my-auto">
                <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-teal-600">
                            {mode === "edit" ? "edit_square" : "add_business"}
                        </span>
                        {mode === "edit"
                            ? `แก้ไขข้อมูลจุดรับของ ${form.id}`
                            : "เพิ่มจุดรับบริจาคใหม่"}
                    </h3>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">
                            close
                        </span>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <InputField
                        label="ชื่อจุดรับบริจาค"
                        value={form.name}
                        onChange={(value) => setForm({ ...form, name: value })}
                        placeholder="เช่น จุดรับบริจาคโรงเรียนเทศบาล 1"
                    />

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            พิกัดสถานที่ (ที่อยู่)
                        </label>

                        <textarea
                            rows={2}
                            value={form.address}
                            onChange={(e) =>
                                setForm({ ...form, address: e.target.value })
                            }
                            placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด"
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="ชื่อผู้ดูแล / หัวหน้าจุด"
                            value={form.manager}
                            onChange={(value) => setForm({ ...form, manager: value })}
                            placeholder="ชื่อ-สกุล"
                        />

                        <InputField
                            label="เบอร์โทรศัพท์ติดต่อ"
                            value={form.phone}
                            onChange={(value) => setForm({ ...form, phone: value })}
                            placeholder="08X-XXX-XXXX"
                        />
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            สถานะเปิดรับของ
                        </label>

                        <div className="flex items-center mt-2">
                            <button
                                onClick={() =>
                                    setForm({ ...form, isActive: !form.isActive })
                                }
                                className={
                                    form.isActive
                                        ? "relative w-12 h-6 rounded-full bg-teal-500 transition-colors"
                                        : "relative w-12 h-6 rounded-full bg-slate-400 transition-colors"
                                }
                            >
                                <span
                                    className={
                                        form.isActive
                                            ? "absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                                            : "absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                                    }
                                />
                            </button>

                            <span
                                className={
                                    form.isActive
                                        ? "ml-3 text-sm font-bold text-teal-600"
                                        : "ml-3 text-sm font-bold text-slate-500"
                                }
                            >
                                {form.isActive ? "เปิดทำการ" : "ปิดชั่วคราว"}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 rounded-xl border border-slate-200 transition-colors"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={onSave}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/30 transition-all"
                        >
                            บันทึกข้อมูล
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ label, value, onChange, placeholder }) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {label}
            </label>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
        </div>
    );
}