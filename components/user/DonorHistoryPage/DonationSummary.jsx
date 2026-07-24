import { cards } from "@/constants/cards";

export default function DonationSummary({
    totalDonations = 0,
    totalItems = 0,
}) {
    return (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className={cards.donorHistory.summaryPrimary}>
                <p className="mb-1 text-sm text-slate-500">
                    บริจาคไปแล้ว
                </p>

                <h2 className="text-3xl font-bold">
                    {totalDonations} ครั้ง
                </h2>
            </div>

            <div className={cards.donorHistory.summary}>
                <p className="mb-1 text-sm text-slate-500">
                    สิ่งของรวม
                </p>

                <h2 className="text-3xl font-bold">
                    {totalItems}

                    <span className="ml-1 text-sm font-normal text-slate-500">
                        ชิ้น
                    </span>
                </h2>
            </div>
        </div>
    );
}
