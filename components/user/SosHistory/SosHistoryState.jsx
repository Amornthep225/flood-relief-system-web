export default function SosHistoryState({
    icon,
    title,
    description,
    spinning = false,
}) {
    return (
        <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-slate-100 bg-white px-6 shadow-sm">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <span
                        className={`material-symbols-outlined text-3xl ${
                            spinning
                                ? "animate-spin"
                                : ""
                        }`}
                    >
                        {icon}
                    </span>
                </div>

                <h2 className="text-lg font-bold text-slate-700">
                    {title}
                </h2>

                <p className="mt-1 max-w-sm text-sm text-slate-400">
                    {description}
                </p>
            </div>
        </div>
    );
}