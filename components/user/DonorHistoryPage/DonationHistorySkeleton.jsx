export default function DonationHistorySkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="h-28 rounded-2xl bg-slate-200" />
                <div className="h-28 rounded-2xl bg-slate-200" />
            </div>

            <div className="h-12 rounded-xl bg-slate-200" />

            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="h-40 rounded-2xl bg-slate-200"
                />
            ))}
        </div>
    );
}