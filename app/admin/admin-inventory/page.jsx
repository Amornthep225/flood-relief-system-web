"use client";

import { useState } from "react";

const mockData = {
    summary: [
        {
            title: "รายการสินค้าทั้งหมด",
            number: "1,240",
            icon: "deployed_code",
            boxStyle: "bg-white border-slate-200",
            textStyle: "text-slate-500",
            numberStyle: "text-slate-800",
            iconStyle: "bg-slate-100 text-slate-500",
        },
        {
            title: "สินค้าใกล้หมด (Low Stock)",
            number: "3",
            icon: "warning",
            boxStyle: "bg-red-50 border-red-100",
            textStyle: "text-red-600 font-bold",
            numberStyle: "text-red-600",
            iconStyle: "bg-white text-red-500 animate-pulse",
        },
        {
            title: "รับเข้าวันนี้",
            number: "+150",
            icon: "forklift",
            boxStyle: "bg-emerald-50 border-emerald-100",
            textStyle: "text-emerald-600 font-bold",
            numberStyle: "text-emerald-600",
            iconStyle: "bg-white text-emerald-500",
        },
        {
            title: "เบิกจ่ายวันนี้",
            number: "-85",
            icon: "local_shipping",
            boxStyle: "bg-blue-50 border-blue-100",
            textStyle: "text-blue-600 font-bold",
            numberStyle: "text-blue-600",
            iconStyle: "bg-white text-blue-500",
        },
    ],

    items: [
        {
            id: "MK-001",
            name: "นมผงเด็ก สูตร 1",
            detail: "กระป๋อง 400g",
            category: "แม่และเด็ก",
            icon: "child_care",
            amount: 5,
            unit: "ชิ้น",
            target: 50,
            percent: 10,
            status: "low",
        },
        {
            id: "FD-023",
            name: "ข้าวสาร 5 กก.",
            detail: "ถุง",
            category: "อาหารแห้ง",
            icon: "rice_bowl",
            amount: 45,
            unit: "ถุง",
            target: 200,
            percent: 25,
            status: "medium",
        },
        {
            id: "WT-001",
            name: "น้ำดื่ม 600ml",
            detail: "แพ็ค (12 ขวด)",
            category: "น้ำดื่ม",
            icon: "water_drop",
            amount: 850,
            unit: "แพ็ค",
            target: 1000,
            percent: 85,
            status: "normal",
        },
    ],
};

export default function AdminInventoryPage() {
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredItems = mockData.items.filter((item) => {
        const keyword = searchText.toLowerCase();

        const matchSearch =
            item.name.toLowerCase().includes(keyword) ||
            item.id.toLowerCase().includes(keyword) ||
            item.category.toLowerCase().includes(keyword);

        if (filter === "all") return matchSearch;
        if (filter === "food") {
            return (
                matchSearch &&
                (item.category.includes("อาหาร") || item.category.includes("น้ำ"))
            );
        }
        if (filter === "medical") {
            return matchSearch && item.category.includes("เวชภัณฑ์");
        }
        if (filter === "clothes") {
            return matchSearch && item.category.includes("เครื่องนุ่งห่ม");
        }

        return matchSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="flex items-center justify-between bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        บริหารจัดการคลังสินค้า
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-md font-bold">
                            Main Warehouse
                        </span>
                    </h2>
                </div>

                <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <span className="material-symbols-outlined text-sm">print</span>
                    พิมพ์รายงาน
                </button>
            </header>

            <main className="p-8 max-w-[1400px] mx-auto w-full">
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {mockData.summary.map((item) => (
                        <SummaryCard key={item.title} item={item} />
                    ))}
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
                                placeholder="ค้นหาชื่อสินค้า, รหัส SKU..."
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

                        <FilterButton active={filter === "food"} onClick={() => setFilter("food")}>
                            อาหาร/น้ำ
                        </FilterButton>

                        <FilterButton active={filter === "medical"} onClick={() => setFilter("medical")}>
                            เวชภัณฑ์
                        </FilterButton>

                        <FilterButton active={filter === "clothes"} onClick={() => setFilter("clothes")}>
                            เครื่องนุ่งห่ม
                        </FilterButton>
                    </div>
                </section>

                <section className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                    <th className="p-4 font-bold w-16">IMG</th>
                                    <th className="p-4 font-bold">ชื่อสินค้า / รายละเอียด</th>
                                    <th className="p-4 font-bold">หมวดหมู่</th>
                                    <th className="p-4 font-bold w-1/4">ปริมาณคงเหลือ</th>
                                    <th className="p-4 font-bold text-center">สถานะ</th>
                                    <th className="p-4 font-bold text-right">จัดการ</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm divide-y divide-slate-100">
                                {filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-xl">
                                                    {item.icon}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <p className="font-bold text-slate-800">{item.name}</p>
                                            <p className="text-xs text-slate-400">
                                                SKU: {item.id} • {item.detail}
                                            </p>
                                        </td>

                                        <td className="p-4 text-slate-600">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                                                {item.category}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className={`font-bold ${getAmountColor(item.status)}`}>
                                                    {item.amount} {item.unit}
                                                </span>
                                                <span className="text-slate-400">
                                                    เป้าหมาย: {item.target}
                                                </span>
                                            </div>

                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getProgressColor(item.status)}`}
                                                    style={{ width: `${item.percent}%` }}
                                                />
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <InventoryStatusBadge status={item.status} />
                                        </td>

                                        <td className="p-4 text-right">
                                            <button className="text-slate-400 hover:text-sky-500 p-2 transition-colors">
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
                            แสดง 1-{filteredItems.length} จาก 1,240 รายการ
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
                                ...
                            </button>
                            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500 hover:bg-slate-100">
                                Next
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
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
                    : "px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-500 rounded-full text-xs font-bold transition-colors whitespace-nowrap"
            }
        >
            {children}
        </button>
    );
}

function InventoryStatusBadge({ status }) {
    if (status === "low") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                ใกล้หมด
            </span>
        );
    }

    if (status === "medium") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600">
                ปานกลาง
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-600">
            ปกติ
        </span>
    );
}

function getAmountColor(status) {
    if (status === "low") return "text-red-600";
    if (status === "medium") return "text-orange-500";
    return "text-green-600";
}

function getProgressColor(status) {
    if (status === "low") return "bg-red-500";
    if (status === "medium") return "bg-orange-400";
    return "bg-green-500";
}