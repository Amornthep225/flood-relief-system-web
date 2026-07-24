const tabs = [
    {
        value: "all",
        label: "ทั้งหมด",
    },
    {
        value: "processing",
        label: "กำลังดำเนินการ",
    },
    {
        value: "completed",
        label: "เสร็จสิ้น",
    },
];

export default function DonationTabs({
    activeTab,
    onChange,
    counts,
}) {
    return (
        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white px-3 pt-2 shadow-sm">
            {tabs.map((tab) => {
                const isActive =
                    activeTab === tab.value;

                const count =
                    tab.value === "all"
                        ? counts.all
                        : tab.value === "processing"
                            ? counts.processing
                            : counts.completed;

                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() =>
                            onChange(tab.value)
                        }
                        className={`whitespace-nowrap rounded-t-lg border-b-2 px-4 py-2 text-sm font-bold transition ${isActive
                                ? "border-sky-600 bg-sky-50 text-sky-700"
                                : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            }`}
                    >
                        {tab.label} ({count})
                    </button>
                );
            })}
        </div>
    );
}