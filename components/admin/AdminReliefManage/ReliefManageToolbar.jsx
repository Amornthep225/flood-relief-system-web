"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

export default function ReliefManageToolbar({
    activeTab,
    searchText,
    onSearchChange,
    statusFilter,
    onStatusChange,
    categoryFilter,
    onCategoryChange,
    categories,
    onAdd,
}) {
    const { ui } = useNativeUi();
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
                <label className="min-w-0 flex-1 text-sm font-bold text-slate-600">
                    {ui("ค้นหา")}
                    <div className="relative mt-2">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                            search
                        </span>
                        <input
                            value={searchText}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder={
                                activeTab === "items"
                                    ? ui("ค้นหาชื่อสินค้า รหัส หน่วย หรือหมวดหมู่")
                                    : ui("ค้นหาชื่อหรือรหัสหมวดหมู่")
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 font-normal outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        />
                    </div>
                </label>

                <label className="text-sm font-bold text-slate-600 xl:w-48">
                    {ui("สถานะ")}
                    <select
                        value={statusFilter}
                        onChange={(event) => onStatusChange(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none"
                    >
                        <option value="all">{ui("ทุกสถานะ")}</option>
                        <option value="active">{ui("เปิดใช้งาน")}</option>
                        <option value="inactive">{ui("ปิดใช้งาน")}</option>
                    </select>
                </label>

                {activeTab === "items" && (
                    <label className="text-sm font-bold text-slate-600 xl:w-56">
                        {ui("หมวดหมู่")}
                        <select
                            value={categoryFilter}
                            onChange={(event) => onCategoryChange(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none"
                        >
                            <option value="all">{ui("ทุกหมวดหมู่")}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {ui(category.name)}
                                </option>
                            ))}
                        </select>
                    </label>
                )}

                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700"
                >
                    <span className="material-symbols-outlined text-[21px]">add_circle</span>
                    {activeTab === "items" ? ui("เพิ่มสินค้า") : ui("เพิ่มหมวดหมู่")}
                </button>
            </div>
        </section>
    );
}
