export default function LowProductsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
                <div
                    key={index}
                    className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <div className="mb-5 h-32 rounded-xl bg-slate-100" />
                    <div className="mb-3 h-5 w-2/3 rounded bg-slate-100" />
                    <div className="mb-5 h-3 w-1/2 rounded bg-slate-100" />
                    <div className="mb-2 h-3 w-full rounded bg-slate-100" />
                    <div className="mb-6 h-2.5 w-full rounded-full bg-slate-100" />
                    <div className="h-11 w-full rounded-xl bg-slate-100" />
                </div>
            ))}
        </div>
    );
}