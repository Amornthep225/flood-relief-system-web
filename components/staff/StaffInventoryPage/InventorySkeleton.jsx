export default function InventorySkeleton() {
    return (
        <div className="animate-pulse">
            <div className="mb-8 h-16 rounded-2xl bg-slate-200" />

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="h-28 rounded-2xl bg-slate-200" />
                <div className="h-28 rounded-2xl bg-slate-200" />
            </div>

            <div className="mb-6 h-20 rounded-2xl bg-slate-200" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-52 rounded-2xl bg-slate-200"
                    />
                ))}
            </div>
        </div>
    );
}
