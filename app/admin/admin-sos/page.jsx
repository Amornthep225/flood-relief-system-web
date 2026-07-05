"use client";

import { useState } from "react";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
const mockData = {
    stats: [
        {
            title: "เคสทั้งหมด",
            number: "342",
            icon: "list",
            box: "bg-white border-slate-200",
            text: "text-slate-500",
            numberColor: "text-slate-800",
            iconBox: "bg-slate-100 text-slate-500",
        },
        {
            title: "รอการช่วยเหลือ",
            number: "18",
            icon: "warning",
            box: "bg-red-50 border-red-100",
            text: "text-red-500 font-bold",
            numberColor: "text-red-600",
            iconBox: "bg-white text-red-500 animate-pulse",
        },
        {
            title: "กำลังดำเนินการ",
            number: "45",
            icon: "engineering",
            box: "bg-blue-50 border-blue-100",
            text: "text-blue-600 font-bold",
            numberColor: "text-blue-600",
            iconBox: "bg-white text-blue-500",
        },
        {
            title: "ช่วยเหลือสำเร็จ",
            number: "279",
            icon: "check_circle",
            box: "bg-green-50 border-green-100",
            text: "text-green-600 font-bold",
            numberColor: "text-green-600",
            iconBox: "bg-white text-green-500",
        },
    ],

    cases: [
        {
            id: "#8942",
            name: "สมพงษ์ มีสุข",
            phone: "081-XXX-XXXX",
            time: "5 นาทีที่แล้ว",
            problem: "ผู้ป่วยติดเตียง ต้องการเรือ",
            location: "บ้านเลขที่ 123 หมู่ 4 ต.แม่สาย",
            status: "waiting",
            staff: "",
        },
        {
            id: "#8940",
            name: "Anon P.",
            phone: "092-XXX-XXXX",
            time: "20 นาทีที่แล้ว",
            problem: "ขาดแคลนอาหาร/น้ำดื่ม กลุ่มใหญ่",
            location: "ชุมชนริมน้ำ ซอย 5",
            status: "progress",
            staff: "นาย สมชาย",
        },
        {
            id: "#8935",
            name: "กานดา มีใจ",
            phone: "089-XXX-XXXX",
            time: "1 ชม. ที่แล้ว",
            problem: "ต้องการยาแก้แพ้",
            location: "ศาลาประชาคม หมู่ 3",
            status: "completed",
            staff: "นายสมชาย ใจดี",
        },
    ],
};

export default function AdminSosPage() {
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");
    const [assignCase, setAssignCase] = useState(null);
    const [detailCase, setDetailCase] = useState(null);

    const filteredCases = mockData.cases.filter((item) => {
        const matchSearch =
            item.id.toLowerCase().includes(searchText.toLowerCase()) ||
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.phone.toLowerCase().includes(searchText.toLowerCase());

        if (filter === "all") return matchSearch;

        return matchSearch && item.status === filter;
    });

    return (
        <RoleGuard
            role="Admin"
            storageKey="admin"
            loginPath="/admin-login"
        >
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="flex items-center justify-between bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    จัดการเคสขอความช่วยเหลือ
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-md font-bold">
                        Live Incoming
                    </span>
                </h2>
            </header>

            <main className="p-8 max-w-[1400px] mx-auto w-full">
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {mockData.stats.map((item) => (
                        <div
                            key={item.title}
                            className={`${item.box} p-4 rounded-xl border shadow-sm flex items-center justify-between`}
                        >
                            <div>
                                <p className={`text-xs mb-1 ${item.text}`}>
                                    {item.title}
                                </p>
                                <h3 className={`text-2xl font-bold ${item.numberColor}`}>
                                    {item.number}
                                </h3>
                            </div>

                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${item.iconBox}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {item.icon}
                                </span>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">
                                search
                            </span>

                            <input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                type="text"
                                placeholder="ค้นหาชื่อ, เบอร์โทร, รหัสเคส..."
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
                        <FilterButton active={filter === "waiting"} onClick={() => setFilter("waiting")}>
                            รอการช่วยเหลือ
                        </FilterButton>
                        <FilterButton active={filter === "progress"} onClick={() => setFilter("progress")}>
                            กำลังดำเนินการ
                        </FilterButton>
                        <FilterButton active={filter === "completed"} onClick={() => setFilter("completed")}>
                            ช่วยเหลือสำเร็จ
                        </FilterButton>
                    </div>
                </section>

                <section className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                    <th className="p-4 font-bold w-24">Case ID</th>
                                    <th className="p-4 font-bold">ผู้แจ้ง / รายละเอียด</th>
                                    <th className="p-4 font-bold">พื้นที่ / พิกัด</th>
                                    <th className="p-4 font-bold text-center">สถานะ</th>
                                    <th className="p-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm divide-y divide-slate-100">
                                {filteredCases.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={
                                            item.status === "waiting"
                                                ? "hover:bg-red-50/30 transition-colors"
                                                : "hover:bg-slate-50 transition-colors"
                                        }
                                    >
                                        <td className="p-4 font-mono text-slate-500">
                                            {item.id}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                                    {item.name.charAt(0)}
                                                </div>

                                                <div>
                                                    <p className="font-bold text-slate-800">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {item.phone} • {item.time}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        “{item.problem}”
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-slate-400 text-sm">
                                                    location_on
                                                </span>
                                                <span>{item.location}</span>
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <StatusBadge status={item.status} />
                                        </td>

                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setDetailCase(item)}
                                                className="text-slate-400 hover:text-slate-600 p-1 mr-2"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    visibility
                                                </span>
                                            </button>

                                            {item.status === "waiting" && (
                                                <button
                                                    onClick={() => setAssignCase(item)}
                                                    className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                                                >
                                                    รับงาน
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                        <span className="text-xs text-slate-500">
                            แสดง 1-{filteredCases.length} จาก 342 รายการ
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

            {assignCase && (
                <AssignModal item={assignCase} onClose={() => setAssignCase(null)} />
            )}

            {detailCase && (
                <DetailModal item={detailCase} onClose={() => setDetailCase(null)} />
            )}
        </div>
        </RoleGuard>
    );
}

function FilterButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={
                active
                    ? "px-4 py-1.5 bg-slate-800 text-white rounded-full text-xs font-bold shadow-sm whitespace-nowrap"
                    : "px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-500 rounded-full text-xs font-bold transition-colors whitespace-nowrap"
            }
        >
            {children}
        </button>
    );
}

function StatusBadge({ status }) {
    if (status === "waiting") {
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                รอรับเรื่อง
            </span>
        );
    }

    if (status === "progress") {
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                กำลังดำเนินการ
            </span>
        );
    }

    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600 border border-green-200">
            เสร็จสิ้น
        </span>
    );
}

function AssignModal({ item, onClose }) {
    const handleConfirm = () => {
        alert(`ระบบได้มอบหมายงานเคส ${item.id} ให้เจ้าหน้าที่เรียบร้อยแล้ว`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 p-5 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sky-500">
                            person_add
                        </span>
                        มอบหมายงาน (Assign Team)
                    </h3>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-5">
                        <p className="text-sm text-slate-500 mb-1">
                            รหัสการขอความช่วยเหลือ
                        </p>
                        <p className="text-lg font-mono font-bold text-slate-800">
                            {item.id}
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            เลือกทีม / เจ้าหน้าที่ ที่ต้องการมอบหมาย
                        </label>

                        <select className="w-full bg-white border border-slate-300 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500">
                            <option>-- เลือกเจ้าหน้าที่ --</option>
                            <option>นายสมชาย ใจดี</option>
                            <option>นายวิชัย มุ่งมั่น</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={handleConfirm}
                            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow-md shadow-sky-500/20 transition-all"
                        >
                            ยืนยันมอบหมาย
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailModal({ item, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-white">
                <div className="bg-slate-50 border-b border-slate-100 p-5 flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">
                            รายละเอียดข้อมูล SOS
                        </h3>
                        <p className="text-sm font-mono text-slate-500 mt-0.5">
                            Ref:{" "}
                            <span className="font-bold text-slate-700">
                                {item.id}
                            </span>
                        </p>
                    </div>

                    <StatusBadge status={item.status} />
                </div>

                <div className="p-6 space-y-5">
                    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-50 pb-2">
                            ข้อมูลผู้แจ้ง
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <Info label="ชื่อ-สกุล" value={item.name} />
                            <Info label="เบอร์ติดต่อ" value={item.phone} />
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <InfoBox title="รายละเอียดปัญหา" value={item.problem} />
                        <div className="mt-4">
                            <InfoBox title="สถานที่ / พิกัด" value={item.location} />
                        </div>
                    </div>

                    {item.status !== "waiting" && (
                        <div
                            className={
                                item.status === "completed"
                                    ? "bg-green-50 border border-green-100 rounded-xl p-4"
                                    : "bg-blue-50 border border-blue-100 rounded-xl p-4"
                            }
                        >
                            <p
                                className={
                                    item.status === "completed"
                                        ? "text-[11px] font-bold text-green-600 uppercase tracking-wider mb-1"
                                        : "text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-1"
                                }
                            >
                                ทีม / เจ้าหน้าที่ ที่รับผิดชอบ
                            </p>

                            <div className="flex items-center gap-3 mt-2">
                                <div
                                    className={
                                        item.status === "completed"
                                            ? "w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"
                                            : "w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center"
                                    }
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        admin_panel_settings
                                    </span>
                                </div>

                                <p className="text-sm font-bold text-slate-800">
                                    {item.staff}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                    <button
                        onClick={onClose}
                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl transition-colors"
                    >
                        ปิดหน้าต่าง
                    </button>
                </div>
            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
            <p className="text-sm font-bold text-slate-800">{value}</p>
        </div>
    );
}

function InfoBox({ title, value }) {
    return (
        <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {title}
            </p>
            <p className="text-sm text-slate-700 font-medium bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                {value}
            </p>
        </div>
    );
}