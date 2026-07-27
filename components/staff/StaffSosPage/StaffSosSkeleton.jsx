export default function StaffSosSkeleton() {
    return (
        <div className="w-full animate-pulse space-y-6">
            <div className="h-32 rounded-3xl bg-slate-200" />

            <div className="h-64 rounded-3xl bg-slate-200" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="h-32 rounded-2xl bg-slate-200"
                    />
                ))}
            </div>

            <div className="h-16 rounded-2xl bg-slate-200" />

            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="h-52 rounded-2xl bg-slate-200"
                />
            ))}
        </div>
    );
}