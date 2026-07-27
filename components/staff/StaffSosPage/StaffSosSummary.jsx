const cards = [
    {
        key: "total",
        title: "คำขอทั้งหมด",
        icon: "assignment",
        style: "bg-slate-800",
    },
    {
        key: "waiting",
        title: "รอรับเรื่อง",
        icon: "pending_actions",
        style: "bg-orange-500",
    },
    {
        key: "progress",
        title: "กำลังดำเนินการ",
        icon: "local_shipping",
        style: "bg-sky-600",
    },
    {
        key: "completed",
        title: "เสร็จสิ้น",
        icon: "task_alt",
        style: "bg-emerald-500",
    },
];

export default function StaffSosSummary({ summary }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.key}
                    className={`${card.style} rounded-2xl p-5 text-white shadow-lg`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/80">
                                {card.title}
                            </p>

                            <p className="mt-2 text-3xl font-black">
                                {summary[card.key] || 0}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                            <span className="material-symbols-outlined">
                                {card.icon}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}