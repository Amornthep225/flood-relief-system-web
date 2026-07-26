"use client";

import { useState } from "react";

export default function StaffSosFilter({
    filters,
    onSearch,
    onReset,
}) {
    const [draft, setDraft] = useState(filters);

    const updateDraft = (key, value) => {
        setDraft((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const applyPreset = (startDate, endDate) => {
        const nextFilters = {
            ...draft,
            startDate,
            endDate,
        };

        setDraft(nextFilters);
        onSearch(nextFilters);
    };

    const handleToday = () => {
        const today = formatDateInput(new Date());
        applyPreset(today, today);
    };

    const handleLast7Days = () => {
        const end = new Date();
        const start = new Date();

        start.setDate(end.getDate() - 6);

        applyPreset(
            formatDateInput(start),
            formatDateInput(end)
        );
    };

    const handleThisMonth = () => {
        const now = new Date();

        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        applyPreset(
            formatDateInput(start),
            formatDateInput(now)
        );
    };

    const handleReset = () => {
        const reset = {
            startDate: "",
            endDate: "",
            status: "",
        };

        setDraft(reset);
        onReset();
    };

    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <span className="material-symbols-outlined text-sky-500">
                    search
                </span>

                <h2 className="text-lg font-bold text-slate-800">
                    ค้นหารายการ SOS
                </h2>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
                <PresetButton onClick={handleToday}>
                    วันนี้
                </PresetButton>

                <PresetButton onClick={handleLast7Days}>
                    7 วันล่าสุด
                </PresetButton>

                <PresetButton onClick={handleThisMonth}>
                    เดือนนี้
                </PresetButton>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <FilterField label="วันที่เริ่มต้น">
                    <input
                        type="date"
                        value={draft.startDate}
                        onChange={(event) =>
                            updateDraft(
                                "startDate",
                                event.target.value
                            )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    />
                </FilterField>

                <FilterField label="วันที่สิ้นสุด">
                    <input
                        type="date"
                        value={draft.endDate}
                        min={draft.startDate || undefined}
                        onChange={(event) =>
                            updateDraft(
                                "endDate",
                                event.target.value
                            )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    />
                </FilterField>

                <FilterField label="สถานะ">
                    <select
                        value={draft.status}
                        onChange={(event) =>
                            updateDraft(
                                "status",
                                event.target.value
                            )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    >
                        <option value="">ทั้งหมด</option>
                        <option value="Pending">
                            รอรับเรื่อง
                        </option>
                        <option value="Accepted">
                            รับเรื่องแล้ว
                        </option>
                        <option value="Preparing">
                            กำลังจัดเตรียม
                        </option>
                        <option value="Delivering">
                            กำลังนำส่ง
                        </option>
                        <option value="Completed">
                            เสร็จสิ้น
                        </option>
                    </select>
                </FilterField>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                    รีเซ็ต
                </button>

                <button
                    type="button"
                    onClick={() => onSearch(draft)}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700"
                >
                    <span className="material-symbols-outlined text-lg">
                        search
                    </span>
                    ค้นหา
                </button>
            </div>
        </div>
    );
}

function PresetButton({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-600 transition hover:bg-sky-100"
        >
            {children}
        </button>
    );
}

function FilterField({ label, children }) {
    return (
        <label>
            <span className="mb-2 block text-sm font-bold text-slate-600">
                {label}
            </span>

            {children}
        </label>
    );
}

function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
        2,
        "0"
    );
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}