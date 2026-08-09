export default function DetailsModal({
    request,
    loading,
    onClose,
}) {
    const items = Array.isArray(request?.items)
        ? request.items
        : [];
<<<<<<< Updated upstream
=======
    const isEmergency =
        String(request?.requestType || "Relief")
            .trim()
            .toLowerCase() === "emergency";
>>>>>>> Stashed changes

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/60 px-4 py-10 backdrop-blur-sm">
            <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-start justify-between bg-gradient-to-r from-sky-600 to-blue-700 p-6 text-white">
                    <div>
                        <p className="text-sm text-white/70">
                            รายละเอียดคำขอ
                        </p>

                        <h3 className="mt-1 text-2xl font-black">
                            SOS #{request?.id}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <span className="material-symbols-outlined animate-spin text-4xl text-sky-500">
                            progress_activity
                        </span>
                    </div>
                ) : (
                    <div className="space-y-6 p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <DetailBox
                                icon="person"
                                label="ผู้แจ้ง"
                                value={
                                    request?.userFullName ||
                                    "ไม่ระบุ"
                                }
                            />

                            <DetailBox
                                icon="call"
                                label="เบอร์โทร"
                                value={
                                    request?.userPhoneNumber ||
                                    "ไม่ระบุ"
                                }
                            />

<<<<<<< Updated upstream
                            <DetailBox
                                icon="flag"
                                label="ระดับความเร่งด่วน"
                                value={
                                    request?.priority ||
                                    "Normal"
                                }
                            />
=======
                            {isEmergency && (
                                <DetailBox
                                    icon="flag"
                                    label="ระดับความเร่งด่วน"
                                    value={formatPriorityLabel(request?.priority)}
                                />
                            )}
>>>>>>> Stashed changes

                            <DetailBox
                                icon="info"
                                label="สถานะ"
                                value={
                                    request?.status ||
                                    "ไม่ระบุ"
                                }
                            />
                        </div>

                        <DetailBox
                            icon="location_on"
                            label="สถานที่"
                            value={
                                request?.addressDetail ||
                                "ไม่ระบุ"
                            }
                        />

                        {request?.userRemark && (
                            <DetailBox
                                icon="notes"
                                label="หมายเหตุจากผู้แจ้ง"
                                value={request.userRemark}
                            />
                        )}

                        <div>
                            <h4 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                                <span className="material-symbols-outlined text-sky-500">
                                    inventory_2
                                </span>
                                รายการความช่วยเหลือที่ร้องขอ
                            </h4>

                            {items.length === 0 ? (
                                <div className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-400">
                                    ไม่พบรายการสิ่งของ
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div
                                            key={
                                                item.id ||
                                                `${item.reliefItemId}-${index}`
                                            }
                                            className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50 p-4"
                                        >
                                            <div>
                                                <p className="font-bold text-slate-800">
                                                    {item.reliefItemName ||
                                                        item.name ||
                                                        "ไม่ระบุรายการ"}
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    จำนวน{" "}
                                                    {item.quantity ||
                                                        0}{" "}
                                                    {item.unit || ""}
                                                </p>
                                            </div>

                                            <span className="material-symbols-outlined text-sky-500">
                                                package_2
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-xl bg-slate-800 py-3.5 font-bold text-white transition hover:bg-slate-900"
                        >
                            ปิดหน้าต่าง
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailBox({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sky-500 shadow-sm">
                <span className="material-symbols-outlined text-lg">
                    {icon}
                </span>
            </div>

            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-bold text-slate-700">
                    {value}
                </p>
            </div>
        </div>
    );
<<<<<<< Updated upstream
}
=======
}

function formatPriorityLabel(priority) {
    const value = String(priority || "")
        .trim()
        .toLowerCase();

    if (value === "critical") {
        return "วิกฤต";
    }

    if (value === "urgent") {
        return "เร่งด่วน";
    }

    return "ปกติ";
}
>>>>>>> Stashed changes
