"use client";

export default function DonationQrCard({ donation }) {
    if (!donation) return null;

    return (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
            <div className="bg-gradient-to-b from-sky-50/80 to-sky-50/30 p-8 text-center">
                <h1 className="text-xl font-bold text-slate-800">
                    รหัสอ้างอิงการบริจาค
                </h1>

                {/* QR Code Container */}
                <div className="mt-5 inline-block rounded-2xl bg-white p-4 shadow-sm border border-slate-100/80">
                    {donation.qrCode ? (
                        <img
                            src={donation.qrCode}
                            alt={`QR Code for ${donation.id}`}
                            className="h-44 w-44 object-contain"
                        />
                    ) : (
                        <div className="flex h-44 w-44 items-center justify-center text-sm text-slate-400">
                            ไม่พบ QR Code
                        </div>
                    )}
                </div>

                {/* Donation ID */}
                <div className="mt-4">
                    <p className="text-xs text-slate-400 font-medium mb-1">
                        DONATION ID
                    </p>
                    <h2 className="text-2xl font-mono font-black tracking-wider text-sky-600">
                        {donation.id}
                    </h2>
                </div>
            </div>
        </div>
    );
}