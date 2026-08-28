"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function SosHistoryFilter({ filters, onSearch, onReset }) {
    const { t } = useLanguage();

    const getTodayString = () => new Date().toISOString().substring(0, 10);

    const updateFilter = (key, value) => {
        onSearch({
            ...filters,
            [key]: value,
        });
    };

    const handleSelectToday = () => {
        const todayStr = getTodayString();
        onSearch({
            startDate: todayStr,
            endDate: todayStr,
            status: "",
        });
    };

    const handleSelectLast7Days = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);

        onSearch({
            startDate: start.toISOString().substring(0, 10),
            endDate: end.toISOString().substring(0, 10),
            status: "",
        });
    };

    const handleSelectThisMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);

        onSearch({
            startDate: start.toISOString().substring(0, 10),
            endDate: now.toISOString().substring(0, 10),
            status: "",
        });
    };

    return (
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-500">
                    search
                </span>
                <h2 className="text-lg font-bold text-slate-800">
                    {t("sos.history.filter.title")}
                </h2>
            </div>

            <div className="mb-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleSelectToday}
                    className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-600 hover:bg-sky-100 transition-colors"
                >
                    {t("sos.history.filter.today")}
                </button>

                <button
                    type="button"
                    onClick={handleSelectLast7Days}
                    className="rounded-xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    {t("sos.history.filter.last7Days")}
                </button>

                <button
                    type="button"
                    onClick={handleSelectThisMonth}
                    className="rounded-xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    {t("sos.history.filter.thisMonth")}
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label className="text-sm font-semibold text-slate-600">
                        {t("sos.history.filter.startDate")}
                    </label>
                    <input
                        type="date"
                        value={filters?.startDate || ""}
                        onChange={(e) =>
                            updateFilter("startDate", e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 text-sm transition-colors"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-600">
                        {t("sos.history.filter.endDate")}
                    </label>
                    <input
                        type="date"
                        value={filters?.endDate || ""}
                        onChange={(e) =>
                            updateFilter("endDate", e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 text-sm transition-colors"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-600">
                        {t("sos.history.filter.status")}
                    </label>
                    <select
                        value={filters?.status || ""}
                        onChange={(e) =>
                            updateFilter("status", e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 text-sm bg-white transition-colors"
                    >
                        <option value="">
                            {t("sos.history.filter.all")}
                        </option>
                        <option value="Pending">
                            {t("sos.history.filter.pending")}
                        </option>
                        <option value="Accepted">
                            {t("sos.history.filter.accepted")}
                        </option>
                        <option value="Preparing">
                            {t("sos.history.filter.preparing")}
                        </option>
                        <option value="Delivering">
                            {t("sos.history.filter.delivering")}
                        </option>
                        <option value="Completed">
                            {t("sos.history.filter.completed")}
                        </option>
                        <option value="Cancelled">
                            {t("sos.history.filter.cancelled")}
                        </option>
                    </select>
                </div>
            </div>

            <div className="mt-5 flex justify-end">
                <button
                    type="button"
                    onClick={onReset}
                    className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    {t("sos.history.filter.reset")}
                </button>
            </div>
        </div>
    );
}
