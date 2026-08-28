"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { translateMasterDataText } from "@/locales/uiPhrases";

export default function LowProductsFilters({
    centers,
    selectedCenter,
    selectedStatus,
    onCenterChange,
    onStatusChange,
}) {
    const { language, t } = useLanguage();

    const statusFilters = [
        {
            value: "all",
            key: "all",
        },
        {
            value: "OutOfStock",
            key: "outOfStock",
        },
        {
            value: "LowStock",
            key: "lowStock",
        },
    ];

    return (
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-sm">
                <label
                    htmlFor="center-filter"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    {t("donation.lowStock.centerLabel")}
                </label>

                <div className="relative">
                    <select
                        id="center-filter"
                        value={selectedCenter}
                        onChange={(event) =>
                            onCenterChange(
                                event.target.value
                            )
                        }
                        className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    >
                        <option value="all">
                            {t(
                                "donation.lowStock.allCenters"
                            )}
                        </option>

                        {centers.map((center) => (
                            <option
                                key={center.id}
                                value={center.id}
                            >
                                {translateMasterDataText(
                                    center.centerName || "",
                                    language
                                )}
                            </option>
                        ))}
                    </select>

                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        expand_more
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => {
                    const active =
                        selectedStatus === filter.value;

                    return (
                        <button
                            key={filter.value}
                            type="button"
                            onClick={() =>
                                onStatusChange(
                                    filter.value
                                )
                            }
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                active
                                    ? "bg-sky-600 text-white shadow-sm"
                                    : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                            }`}
                        >
                            {t(
                                `donation.lowStock.filters.${filter.key}`
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
