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
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-1">
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
                        className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-bold transition ${isActive
                                ? "border-sky-600 text-sky-600"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        {tab.label} ({count})
                    </button>
                );
            })}
        </div>
    );
}