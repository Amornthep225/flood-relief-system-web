"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LowProductsFilters({
    selectedStatus,
    onStatusChange,
}) {
    const { t } = useLanguage();

    const statusFilters = [
        { value: "all", key: "all" },
        { value: "OutOfStock", key: "outOfStock" },
        { value: "LowStock", key: "lowStock" },
    ];

    return (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                {statusFilters.map((filter) => {
                    const active = selectedStatus === filter.value;

                    return (
                        <button
                            key={filter.value}
                            type="button"
                            onClick={() => onStatusChange(filter.value)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                active
                                    ? "bg-sky-600 text-white shadow-sm"
                                    : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                            }`}
                        >
                            {t(`donation.lowStock.filters.${filter.key}`)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
