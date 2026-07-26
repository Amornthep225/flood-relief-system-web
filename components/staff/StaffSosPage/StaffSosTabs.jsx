const tabs = [
    {
        key: "waiting",
        title: "รอช่วยเหลือ",
        countKey: "waiting",
    },
    {
        key: "progress",
        title: "กำลังดำเนินการ",
        countKey: "progress",
    },
    {
        key: "completed",
        title: "เสร็จสิ้น",
        countKey: "completed",
    },
];

export default function StaffSosTabs({
    activeTab,
    onChange,
    summary,
}) {
    return (
        <div className="overflow-x-auto border-b border-slate-200">
            <div className="flex min-w-max gap-2">
                {tabs.map((tab) => {
                    const active = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() =>
                                onChange(tab.key)
                            }
                            className={`border-b-2 px-5 py-4 text-sm font-bold transition ${
                                active
                                    ? "border-sky-500 text-sky-600"
                                    : "border-transparent text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {tab.title}

                            <span
                                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                                    active
                                        ? "bg-sky-100 text-sky-600"
                                        : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {summary[tab.countKey] || 0}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}