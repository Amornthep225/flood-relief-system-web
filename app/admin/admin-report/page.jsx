"use client";

import { useState } from "react";

const reports = {
    donors: {
        title: "รายงานสรุปยอดผู้บริจาค",
        ref: "RPT-DON-001",
        theme: "indigo",
        summary: [
            { label: "ยอดรวมทั้งหมด", value: "8,124 รายการ" },
            { label: "จำนวนสิ่งของรวม", value: "15,400 ชิ้น", color: "text-indigo-600" },
        ],
        rows: [
            { date: "2026-02-02", type: "date", label: "วันที่ 02 ก.พ. 2569" },
            { date: "2026-02-02", no: "1", donor: "คุณ สมชาย ใจดี", items: "ข้าวสาร, น้ำดื่ม", place: "โรงเรียนเทศบาล 1", qty: "50" },
            { date: "2026-02-02", no: "2", donor: "บจก. ไทยรุ่งเรือง", items: "เสื้อยืด, ผ้าห่ม", place: "หอประชุมอำเภอ", qty: "100" },
            { date: "2026-02-01", type: "date", label: "วันที่ 01 ก.พ. 2569" },
            { date: "2026-02-01", no: "3", donor: "คุณ วิชัย มุ่งมั่น", items: "ยาแก้ปวด, ยาใส่แผล", place: "โรงเรียนเทศบาล 1", qty: "20" },
        ],
    },

    sos: {
        title: "รายงานสถานการณ์ผู้ประสบภัย (SOS)",
        ref: "RPT-SOS-005",
        theme: "red",
        summary: [
            { label: "เรื่องร้องเรียนทั้งหมด", value: "342 เคส" },
            { label: "รอการช่วยเหลือ (ด่วน)", value: "18 รายการ", color: "text-red-600" },
        ],
        rows: [
            { date: "2026-02-02", type: "date", label: "แจ้งเหตุวันที่ 02 ก.พ. 2569" },
            { date: "2026-02-02", id: "#8942", place: "บ้านเลขที่ 123 หมู่ 4", problem: "น้ำท่วมสูงชั้น 2, ขาดแคลนน้ำดื่ม", status: "รอรับเรื่อง", statusColor: "text-slate-500" },
            { date: "2026-02-02", id: "#8940", place: "ชุมชนริมน้ำ ซอย 5", problem: "ขาดแคลนอาหาร 10+ คน", status: "กำลังดำเนินการ", statusColor: "text-blue-600" },
            { date: "2026-02-01", type: "date", label: "แจ้งเหตุวันที่ 01 ก.พ. 2569" },
            { date: "2026-02-01", id: "#8935", place: "วัดดอยเวา", problem: "ต้องการยาสามัญจำนวนมาก", status: "เสร็จสิ้น", statusColor: "text-green-600" },
        ],
    },

    inventory: {
        title: "รายงานการเคลื่อนไหวคลังบริจาค",
        ref: "RPT-INV-009",
        theme: "orange",
        summary: [
            { label: "รายการคลังของบริจาค", value: "1,240" },
            { label: "ต้องเติมสต็อก", value: "1 รายการ", color: "text-orange-600" },
        ],
        rows: [
            { date: "2026-02-02", type: "date", label: "เคลื่อนไหววันที่ 02 ก.พ. 2569" },
            { date: "2026-02-02", id: "MK-001", name: "นมผงเด็ก สูตร 1", category: "อื่นๆ", in: "+10", out: "-5", balance: "5", status: "ต่ำเกณฑ์", statusColor: "text-red-600" },
            { date: "2026-02-02", id: "FD-023", name: "ข้าวสาร 5 กก.", category: "อาหาร", in: "+50", out: "-5", balance: "45", status: "ปานกลาง", statusColor: "text-orange-500" },
            { date: "2026-02-01", type: "date", label: "เคลื่อนไหววันที่ 01 ก.พ. 2569" },
            { date: "2026-02-01", id: "WT-105", name: "น้ำดื่ม 600ml (แพ็ค)", category: "เครื่องดื่ม", in: "+100", out: "-20", balance: "120", status: "ปกติ", statusColor: "text-green-600" },
        ],
    },
};

export default function AdminReportPage() {
    const [activeTab, setActiveTab] = useState("donors");
    const [dateFilter, setDateFilter] = useState("");

    const report = reports[activeTab];

    const resetFilter = () => setDateFilter("");

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <header className="flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 no-print">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-slate-800">
                        ระบบพิมพ์รายงาน
                    </h2>
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">
                        Report Center
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-400">วันที่ปัจจุบัน</p>
                        <p className="text-sm font-bold text-slate-800">2 ก.พ. 2569</p>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-indigo-200 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-sm">print</span>
                        สั่งพิมพ์เอกสาร
                    </button>
                </div>
            </header>

            <main className="p-8 max-w-[1100px] mx-auto w-full">
                <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 mb-8 flex gap-2 no-print">
                    <TabButton active={activeTab === "donors"} onClick={() => { setActiveTab("donors"); resetFilter(); }}>
                        รายงานผู้บริจาค
                    </TabButton>
                    <TabButton active={activeTab === "sos"} onClick={() => { setActiveTab("sos"); resetFilter(); }}>
                        รายงาน SOS
                    </TabButton>
                    <TabButton active={activeTab === "inventory"} onClick={() => { setActiveTab("inventory"); resetFilter(); }}>
                        รายงานคลังบริจาค
                    </TabButton>
                </div>

                <section className="print-area bg-white p-10 rounded-2xl shadow-xl border border-slate-100 min-h-[800px]">
                    <ReportHeader title={report.title} refCode={report.ref} />

                    <div className="bg-slate-100 p-3 rounded-lg mb-6 flex items-center gap-3 border border-slate-200 no-print">
                        <span className="material-symbols-outlined text-slate-400 text-sm">
                            filter_list
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                            กรองตามวันที่:
                        </span>

                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md block p-2 cursor-pointer"
                        />

                        <button
                            onClick={resetFilter}
                            className="text-sm text-indigo-600 font-bold hover:underline ml-2"
                        >
                            แสดงทั้งหมด
                        </button>
                    </div>

                    <div className={getSummaryClass(report.theme)}>
                        {report.summary.map((item) => (
                            <div key={item.label} className="last:text-right">
                                <p className="text-sm text-slate-500 font-bold mb-1">
                                    {item.label}
                                </p>
                                <p className={`text-2xl font-black ${item.color || "text-slate-800"}`}>
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {activeTab === "donors" && (
                        <DonorTable rows={filterRows(report.rows, dateFilter)} theme={report.theme} />
                    )}

                    {activeTab === "sos" && (
                        <SosTable rows={filterRows(report.rows, dateFilter)} theme={report.theme} />
                    )}

                    {activeTab === "inventory" && (
                        <InventoryTable rows={filterRows(report.rows, dateFilter)} theme={report.theme} />
                    )}

                    <SignatureArea />
                </section>
            </main>
        </div>
    );
}

function TabButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={
                active
                    ? "flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 bg-indigo-600 text-white shadow-md"
                    : "flex-1 py-3 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            }
        >
            {children}
        </button>
    );
}

function ReportHeader({ title, refCode }) {
    return (
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-4">
                <div className="bg-slate-800 text-white w-14 h-14 flex items-center justify-center rounded-xl">
                    <span className="material-symbols-outlined text-4xl">water_drop</span>
                </div>

                <div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-wide">
                        FLOOD RELIEF
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        ศูนย์ประสานงานช่วยเหลือผู้ประสบภัย
                    </p>
                </div>
            </div>

            <div className="text-right">
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                <p className="text-xs text-slate-400 font-mono">Ref: {refCode}</p>
            </div>
        </div>
    );
}

function DonorTable({ rows, theme }) {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                    <th className="p-4 rounded-l-lg w-16 text-center">#</th>
                    <th className="p-4 w-[25%]">ชื่อผู้บริจาค</th>
                    <th className="p-4 w-[30%]">รายการสิ่งของ</th>
                    <th className="p-4 w-[25%]">สถานที่รับบริจาค</th>
                    <th className="p-4 rounded-r-lg text-right">จำนวน</th>
                </tr>
            </thead>

            <tbody className="text-sm divide-y divide-slate-100 font-medium text-slate-700">
                {rows.map((row, index) =>
                    row.type === "date" ? (
                        <DateHeader key={index} label={row.label} theme={theme} colSpan={5} />
                    ) : (
                        <tr key={index} className="hover:bg-slate-50/50">
                            <td className="p-4 text-center text-slate-400">{row.no}</td>
                            <td className="p-4 font-bold text-slate-800">{row.donor}</td>
                            <td className="p-4 text-slate-600">{row.items}</td>
                            <td className="p-4 text-slate-500">{row.place}</td>
                            <td className="p-4 text-right font-bold">{row.qty}</td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
}

function SosTable({ rows, theme }) {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                    <th className="p-4 rounded-l-lg w-24">Case ID</th>
                    <th className="p-4 w-[25%]">สถานที่/พิกัด</th>
                    <th className="p-4 w-[35%]">รายละเอียดปัญหา</th>
                    <th className="p-4 rounded-r-lg text-center">สถานะ</th>
                </tr>
            </thead>

            <tbody className="text-sm divide-y divide-slate-100 font-medium text-slate-700">
                {rows.map((row, index) =>
                    row.type === "date" ? (
                        <DateHeader key={index} label={row.label} theme={theme} colSpan={4} />
                    ) : (
                        <tr key={index} className="hover:bg-slate-50/50">
                            <td className="p-4 font-mono text-slate-500">{row.id}</td>
                            <td className="p-4 font-bold text-slate-800">{row.place}</td>
                            <td className="p-4 text-slate-600">{row.problem}</td>
                            <td className={`p-4 text-center font-bold ${row.statusColor}`}>
                                {row.status}
                            </td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
}

function InventoryTable({ rows, theme }) {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                    <th className="p-4 rounded-l-lg w-20">id</th>
                    <th className="p-4">รายการของบริจาค</th>
                    <th className="p-4">หมวดหมู่</th>
                    <th className="p-4 text-center text-emerald-700 bg-emerald-50">รับเข้า</th>
                    <th className="p-4 text-center text-red-700 bg-red-50">จ่ายออก</th>
                    <th className="p-4 text-center">คงเหลือ</th>
                    <th className="p-4 rounded-r-lg text-center">สถานะ</th>
                </tr>
            </thead>

            <tbody className="text-sm divide-y divide-slate-100 font-medium text-slate-700">
                {rows.map((row, index) =>
                    row.type === "date" ? (
                        <DateHeader key={index} label={row.label} theme={theme} colSpan={7} />
                    ) : (
                        <tr key={index} className="hover:bg-slate-50/50">
                            <td className="p-4 font-mono text-slate-400">{row.id}</td>
                            <td className="p-4 font-bold text-slate-900">{row.name}</td>
                            <td className="p-4 text-slate-500">{row.category}</td>
                            <td className="p-4 text-center font-bold text-emerald-600">{row.in}</td>
                            <td className="p-4 text-center font-bold text-red-600">{row.out}</td>
                            <td className="p-4 text-center font-bold">{row.balance}</td>
                            <td className={`p-4 text-center font-bold ${row.statusColor}`}>
                                {row.status}
                            </td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
}

function DateHeader({ label, theme, colSpan }) {
    return (
        <tr>
            <td colSpan={colSpan} className="p-0 border-none">
                <div className={getDateHeaderClass(theme)}>
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    {label}
                </div>
            </td>
        </tr>
    );
}

function SignatureArea() {
    return (
        <div className="mt-16 flex justify-between text-center pt-8 border-t border-slate-100">
            <div className="px-10">
                <div className="border-b border-dotted border-slate-400 w-48 h-8 mb-2" />
                <p className="text-xs text-slate-500">ผู้จัดทำรายงาน</p>
            </div>

            <div className="px-10">
                <div className="border-b border-dotted border-slate-400 w-48 h-8 mb-2" />
                <p className="text-xs text-slate-500">ผู้ตรวจสอบ</p>
            </div>
        </div>
    );
}

function filterRows(rows, dateFilter) {
    if (!dateFilter) return rows;
    return rows.filter((row) => row.date === dateFilter);
}

function getSummaryClass(theme) {
    if (theme === "red") {
        return "flex justify-between items-center mb-8 bg-red-50 p-6 rounded-xl border border-red-100";
    }

    if (theme === "orange") {
        return "flex justify-between items-center mb-8 bg-orange-50 p-6 rounded-xl border border-orange-100";
    }

    return "flex justify-between items-center mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100";
}

function getDateHeaderClass(theme) {
    if (theme === "red") {
        return "p-2 px-4 font-bold flex items-center gap-2 text-sm bg-red-50 text-red-700 border-l-4 border-red-500";
    }

    if (theme === "orange") {
        return "p-2 px-4 font-bold flex items-center gap-2 text-sm bg-orange-50 text-orange-700 border-l-4 border-orange-500";
    }

    return "p-2 px-4 font-bold flex items-center gap-2 text-sm bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600";
}