import DonationHistoryCard from "./DonationHistoryCard";

export default function DonationHistoryList({
    donations,
}) {
    if (!donations.length) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <span className="material-symbols-outlined mb-3 text-4xl text-slate-300">
                    inventory_2
                </span>

                <p className="font-medium text-slate-500">
                    ไม่พบรายการบริจาค
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {donations.map((donation) => (
                <DonationHistoryCard
                    key={donation.id}
                    donation={donation}
                />
            ))}
        </div>
    );
}