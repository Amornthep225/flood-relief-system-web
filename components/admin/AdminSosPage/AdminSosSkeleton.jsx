export default function AdminSosSkeleton() {
    return (
        <div className="min-h-screen animate-pulse bg-slate-50 p-8">
            <div className="mx-auto max-w-[1500px] space-y-6">
                <div className="h-20 rounded-2xl bg-slate-200" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-28 rounded-xl bg-slate-200"
                        />
                    ))}
                </div>

                <div className="h-20 rounded-2xl bg-slate-200" />
                <div className="h-[520px] rounded-2xl bg-slate-200" />
            </div>
        </div>
    );
}
