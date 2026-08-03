function formatRelativeTime(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    const seconds = Math.floor(
        (Date.now() - date.getTime()) /
            1000
    );

    if (seconds < 60) {
        return "เมื่อสักครู่";
    }

    const minutes = Math.floor(
        seconds / 60
    );

    if (minutes < 60) {
        return `${minutes} นาทีที่แล้ว`;
    }

    const hours = Math.floor(
        minutes / 60
    );

    if (hours < 24) {
        return `${hours} ชม. ที่แล้ว`;
    }

    const days = Math.floor(
        hours / 24
    );

    return `${days} วันที่แล้ว`;
}

export default function AdminRecentActivities({
    activities,
}) {
    return (
        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800">
                    กิจกรรมล่าสุด
                </h3>

                <p className="text-sm text-slate-500">
                    ความเคลื่อนไหวจาก SOS และ Donation
                </p>
            </div>

            {activities.length === 0 ? (
                <div className="px-6 py-16 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300">
                        history_toggle_off
                    </span>

                    <p className="mt-3 text-sm font-bold text-slate-600">
                        ยังไม่มีกิจกรรมล่าสุด
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-50">
                    {activities.map(
                        (item) => (
                            <ActivityItem
                                key={item.id}
                                item={item}
                            />
                        )
                    )}
                </div>
            )}
        </section>
    );
}

function ActivityItem({
    item,
}) {
    return (
        <div className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50">
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${item.iconStyle}`}
            >
                <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                </span>
            </div>

            <div className="min-w-0 flex-grow">
                <p className="text-sm font-bold text-slate-700">
                    {item.title}

                    {item.badge && (
                        <span className="ml-2 inline-block rounded bg-red-100 px-2 py-0.5 text-[10px] text-red-600">
                            {item.badge}
                        </span>
                    )}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                    {item.detail}
                </p>
            </div>

            <p className="shrink-0 text-xs font-medium text-slate-400">
                {formatRelativeTime(
                    item.createdAt
                )}
            </p>
        </div>
    );
}
