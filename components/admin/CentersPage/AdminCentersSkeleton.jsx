export default function AdminCentersSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white">
            {[...Array(6)].map(
                (_, index) => (
                    <div
                        key={index}
                        className="border-b border-slate-100 p-4 last:border-b-0"
                    >
                        <div className="h-12 animate-pulse rounded bg-slate-100" />
                    </div>
                )
            )}
        </div>
    );
}
