"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const FILTERS = [
    { key: "all", labelKey: "all", countKey: "total" },
    { key: "active", labelKey: "active", countKey: "active" },
    { key: "completed", labelKey: "completed", countKey: "completed" },
    { key: "cancelled", labelKey: "cancelled", countKey: "cancelled" },
];

export default function SosHistoryTabs({
    selectedFilter,
    onFilterChange,
    summary,
}) {
    const { t } = useLanguage();

    return (
        <div className="mb-6 overflow-x-auto border-b border-slate-200">
            <div className="flex min-w-max gap-1">
                {FILTERS.map((filter) => {
                    const isSelected = selectedFilter === filter.key;

                    return (
                        <button
                            key={filter.key}
                            type="button"
                            onClick={() => onFilterChange(filter.key)}
                            className={`relative px-4 py-3 text-sm font-bold transition-colors ${
                                isSelected
                                    ? "text-sky-600"
                                    : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {t(`sos.history.tabs.${filter.labelKey}`)}

                            <span
                                className={`ml-1.5 rounded-full px-2 py-0.5 text-[10px] ${
                                    isSelected
                                        ? "bg-sky-100 text-sky-700"
                                        : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {summary[filter.countKey]}
                            </span>

                            {isSelected && (
                                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-sky-500" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
