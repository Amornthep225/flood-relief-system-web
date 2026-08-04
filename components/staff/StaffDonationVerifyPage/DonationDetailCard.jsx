function normalizeStatus(status) {
    return String(status || "").trim().toLowerCase();
}

function statusLabel(status) {
    const value = normalizeStatus(status);

    const labels = {
        pending: "รอตรวจรับ",
        pendingreceipt: "รอตรวจรับ",
        pending_receipt: "รอตรวจรับ",
        received: "รับเข้าคลังแล้ว",
        completed: "เสร็จสิ้น",
        cancelled: "ยกเลิก",
    };

    return labels[value] || status || "ไม่ระบุ";
}

function getReceiveState(donation) {
    const status = normalizeStatus(donation?.status);

    const isPending = [
        "pending",
        "pendingreceipt",
        "pending_receipt",
    ].includes(status);

    const isReceived = ["received", "completed"].includes(status);
    const isCancelled = status === "cancelled";

    const canReceive =
        typeof donation?.canReceive === "boolean"
            ? donation.canReceive && isPending
            : isPending;

    return {
        status,
        canReceive,
        isReceived,
        isCancelled,
    };
}

export default function DonationDetailCard({
    donation,
    onReceive,
    isReceiving,
}) {
    const { canReceive, isReceived, isCancelled } =
        getReceiveState(donation);

    const items = Array.isArray(donation?.items)
        ? donation.items
        : [];

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 bg-emerald-500 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                        พบข้อมูลบริจาค
                    </p>
                    <h2 className="mt-1 font-mono text-2xl font-black tracking-wider">
                        #{donation.id}
                    </h2>
                </div>

                <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                    {statusLabel(donation.status)}
                </span>
            </div>

            <div className="space-y-6 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <InfoBox
                        icon="person"
                        label="ผู้บริจาค"
                        value={donation.userFullName || "ไม่ระบุ"}
                        detail={
                            donation.userPhoneNumber ||
                            "ไม่มีเบอร์โทร"
                        }
                    />
                    <InfoBox
                        icon="home_work"
                        label="ศูนย์รับบริจาค"
                        value={
                            donation.centerName ||
                            donation.centerId ||
                            "ไม่ระบุ"
                        }
                        detail={
                            donation.centerPhoneNumber || ""
                        }
                    />
                </div>

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-black text-slate-800">
                            รายการสิ่งของบริจาค
                        </h3>
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                            {items.length} รายการ
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
                        {items.map((item, index) => (
                            <div
                                key={
                                    item.id ||
                                    `${item.reliefItemId}-${index}`
                                }
                                className="flex items-center justify-between gap-4 px-4 py-4"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                        <span className="material-symbols-outlined">
                                            inventory_2
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-slate-800">
                                            {item.reliefItemName ||
                                                "ไม่ระบุรายการ"}
                                        </p>
                                        <p className="font-mono text-xs text-slate-400">
                                            {item.reliefItemId}
                                        </p>
                                    </div>
                                </div>

                                <p className="shrink-0 font-black text-sky-700">
                                    {item.quantity} {item.unit}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {isReceived && (
                    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                        <span className="material-symbols-outlined text-emerald-600">
                            check_circle
                        </span>
                        <div>
                            <p className="font-bold">
                                รับของบริจาคเข้าคลังเรียบร้อยแล้ว
                            </p>
                            <p className="mt-1 text-emerald-700">
                                ระบบอัปเดตจำนวนสินค้าและสถานะรายการบริจาคแล้ว
                            </p>
                        </div>
                    </div>
                )}

                {isCancelled && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        <span className="material-symbols-outlined text-red-600">
                            cancel
                        </span>
                        <div>
                            <p className="font-bold">
                                รายการบริจาคนี้ถูกยกเลิก
                            </p>
                            <p className="mt-1 text-red-700">
                                ไม่สามารถรับของรายการนี้เข้าคลังได้
                            </p>
                        </div>
                    </div>
                )}

                {!canReceive && !isReceived && !isCancelled && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        รายการนี้ไม่อยู่ในสถานะรอตรวจรับ จึงไม่สามารถรับเข้าคลังได้
                    </div>
                )}

                {canReceive ? (
                    <button
                        type="button"
                        onClick={onReceive}
                        disabled={isReceiving}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span
                            className={`material-symbols-outlined ${
                                isReceiving ? "animate-spin" : ""
                            }`}
                        >
                            {isReceiving
                                ? "progress_activity"
                                : "inventory"}
                        </span>
                        {isReceiving
                            ? "กำลังรับเข้าคลัง..."
                            : "ยืนยันรับของเข้าคลัง"}
                    </button>
                ) : isReceived ? (
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-100 px-6 py-4 font-black text-emerald-700">
                        <span className="material-symbols-outlined">
                            inventory_2
                        </span>
                        รับเข้าคลังแล้ว
                    </div>
                ) : null}
            </div>
        </section>
    );
}

function InfoBox({ icon, label, value, detail }) {
    return (
        <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                <span className="material-symbols-outlined">
                    {icon}
                </span>
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                    {label}
                </p>
                <p className="truncate font-bold text-slate-800">
                    {value}
                </p>
                {detail && (
                    <p className="text-xs text-slate-500">
                        {detail}
                    </p>
                )}
            </div>
        </div>
    );
}
