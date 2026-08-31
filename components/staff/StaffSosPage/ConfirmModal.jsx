"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

export default function ConfirmModal({
    request,
    stockCheck,
    checkingStock,
    loading,
    onClose,
    onConfirm,
}) {
    const { ui, language } = useNativeUi();

    const tx = (th, en) =>
        language === "en" ? en : th;

    const items = Array.isArray(stockCheck?.items)
        ? stockCheck.items
        : [];

    const isEmergency =
        stockCheck?.isEmergency === true;

    const enoughItems = items.filter(
        (item) => item.isEnough
    );

    const shortageItems = items.filter(
        (item) => !item.isEnough
    );

    const canConfirm =
        !checkingStock &&
        stockCheck?.isAllEnough === true;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
            <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
                <header className="border-b border-slate-200 bg-white px-6 py-5 md:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                    isEmergency
                                        ? "bg-red-50 text-red-600"
                                        : "bg-sky-50 text-sky-600"
                                }`}
                            >
                                <span className="material-symbols-outlined text-2xl">
                                    {isEmergency
                                        ? "emergency"
                                        : "inventory_2"}
                                </span>
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-black text-slate-900 md:text-xl">
                                        {isEmergency
                                            ? tx(
                                                  "ยืนยันรับเคส SOS ฉุกเฉิน",
                                                  "Accept Emergency SOS"
                                              )
                                            : tx(
                                                  "ตรวจสอบความพร้อมก่อนรับงาน",
                                                  "Pre-Acceptance Inventory Check"
                                              )}
                                    </h3>

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                            isEmergency
                                                ? "bg-red-50 text-red-700"
                                                : "bg-sky-50 text-sky-700"
                                        }`}
                                    >
                                        {isEmergency
                                            ? tx(
                                                  "SOS ฉุกเฉิน",
                                                  "Emergency SOS"
                                              )
                                            : tx(
                                                  "คำขอรับสิ่งของ",
                                                  "Relief Request"
                                              )}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    {isEmergency
                                        ? tx(
                                              "เคสฉุกเฉินสามารถรับงานได้ทันทีโดยไม่ต้องตรวจคลัง",
                                              "Emergency cases can be accepted immediately without an inventory check."
                                          )
                                        : tx(
                                              "ตรวจสอบจำนวนที่ต้องใช้เทียบกับของคงเหลือก่อนยืนยันรับงาน",
                                              "Review requested quantities against available inventory before accepting."
                                          )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-right">
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                    CASE
                                </p>
                                <p className="font-mono text-sm font-black text-slate-800">
                                    #{request?.id || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {checkingStock ? (
                    <div className="flex min-h-[380px] flex-col items-center justify-center px-6 py-14">
                        <span className="material-symbols-outlined animate-spin text-5xl text-sky-500">
                            progress_activity
                        </span>

                        <p className="mt-4 font-bold text-slate-700">
                            {tx(
                                "กำลังตรวจสอบคลังสินค้า...",
                                "Checking inventory..."
                            )}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            {tx(
                                "ระบบกำลังเปรียบเทียบรายการที่ขอกับของคงเหลือ",
                                "Comparing requested items with current stock."
                            )}
                        </p>
                    </div>
                ) : isEmergency ? (
                    <div className="p-6 md:p-8">
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-3xl text-red-600">
                                    emergency
                                </span>

                                <div>
                                    <h4 className="text-base font-black text-red-700">
                                        {tx(
                                            "พร้อมรับงานทันที",
                                            "Ready to Accept"
                                        )}
                                    </h4>

                                    <p className="mt-1 text-sm leading-relaxed text-red-600">
                                        {tx(
                                            "เนื่องจากเป็น SOS ฉุกเฉิน ระบบจะไม่ตรวจคลังสินค้า เจ้าหน้าที่สามารถรับเคสและเข้าช่วยเหลือได้ทันที",
                                            "Because this is an emergency SOS, inventory checking is skipped and staff can proceed immediately."
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <main className="space-y-5 bg-slate-50/60 p-6 md:p-8">
                        <section className="grid gap-3 sm:grid-cols-3">
                            <MetricCard
                                label={tx(
                                    "รายการทั้งหมด",
                                    "Total Items"
                                )}
                                value={items.length}
                                icon="inventory_2"
                                tone="default"
                            />

                            <MetricCard
                                label={tx(
                                    "พร้อมจ่าย",
                                    "Ready"
                                )}
                                value={enoughItems.length}
                                icon="check_circle"
                                tone="success"
                            />

                            <MetricCard
                                label={tx(
                                    "ต้องเติมของ",
                                    "Needs Restock"
                                )}
                                value={shortageItems.length}
                                icon="warning"
                                tone={
                                    shortageItems.length > 0
                                        ? "danger"
                                        : "success"
                                }
                            />
                        </section>

                        <section
                            className={`flex flex-col gap-3 rounded-xl border px-5 py-4 md:flex-row md:items-center md:justify-between ${
                                stockCheck?.isAllEnough
                                    ? "border-emerald-200 bg-emerald-50"
                                    : "border-red-200 bg-red-50"
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className={`material-symbols-outlined mt-0.5 text-2xl ${
                                        stockCheck?.isAllEnough
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {stockCheck?.isAllEnough
                                        ? "check_circle"
                                        : "warning"}
                                </span>

                                <div>
                                    <p
                                        className={`font-black ${
                                            stockCheck?.isAllEnough
                                                ? "text-emerald-700"
                                                : "text-red-700"
                                        }`}
                                    >
                                        {stockCheck?.isAllEnough
                                            ? tx(
                                                  "คลังพร้อม สามารถรับงานนี้ได้",
                                                  "Inventory ready. This case can be accepted."
                                              )
                                            : tx(
                                                  "คลังยังไม่พร้อม ยังไม่สามารถรับงานนี้ได้",
                                                  "Inventory is not ready. This case cannot be accepted yet."
                                              )}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-600">
                                        {tx(
                                            "ศูนย์",
                                            "Center"
                                        )}
                                        :{" "}
                                        {stockCheck?.centerId ||
                                            "-"}
                                    </p>
                                </div>
                            </div>

                            <div
                                className={`w-fit rounded-full px-3 py-1.5 text-xs font-black ${
                                    stockCheck?.isAllEnough
                                        ? "bg-white text-emerald-700"
                                        : "bg-white text-red-700"
                                }`}
                            >
                                {stockCheck?.isAllEnough
                                    ? tx(
                                          "พร้อมรับงาน",
                                          "READY"
                                      )
                                    : tx(
                                          "รอเติมของ",
                                          "RESTOCK REQUIRED"
                                      )}
                            </div>
                        </section>

                        {items.length === 0 ? (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
                                <span className="material-symbols-outlined text-4xl text-amber-500">
                                    inventory
                                </span>

                                <p className="mt-3 font-black text-amber-700">
                                    {tx(
                                        "ไม่พบรายการสิ่งของในคำขอนี้",
                                        "No requested items were found."
                                    )}
                                </p>
                            </div>
                        ) : (
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h4 className="font-black text-slate-900">
                                            {tx(
                                                "รายการสิ่งของ",
                                                "Requested Items"
                                            )}
                                        </h4>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {tx(
                                                "ข้อมูลนี้เป็นการตรวจสอบก่อนรับงาน ยังไม่มีการหักสินค้าออกจากคลัง",
                                                "This is a pre-acceptance check. Inventory has not been deducted yet."
                                            )}
                                        </p>
                                    </div>

                                    <span className="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                                        {items.length}{" "}
                                        {tx(
                                            "รายการ",
                                            "items"
                                        )}
                                    </span>
                                </div>

                                {/* Mobile / narrow screens */}
                                <div className="divide-y divide-slate-100 md:hidden">
                                    {items.map((item, index) => (
                                        <article
                                            key={`${item.reliefItemId}-mobile-${index}`}
                                            className={`p-4 ${
                                                index % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-slate-50/70"
                                            } ${
                                                item.isEnough
                                                    ? ""
                                                    : "ring-1 ring-inset ring-red-100"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-black text-slate-900">
                                                        {ui(
                                                            item.reliefItemName
                                                        )}
                                                    </p>
                                                </div>

                                                {item.isEnough ? (
                                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                                                        <span className="material-symbols-outlined text-sm">
                                                            check_circle
                                                        </span>
                                                        {tx(
                                                            "เพียงพอ",
                                                            "Sufficient"
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-700">
                                                        <span className="material-symbols-outlined text-sm">
                                                            error
                                                        </span>
                                                        {tx(
                                                            "ขาด",
                                                            "Short"
                                                        )}{" "}
                                                        {
                                                            item.shortageQuantity
                                                        }{" "}
                                                        {ui(
                                                            item.unit
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-4 grid grid-cols-3 gap-2">
                                                <MobileMetric
                                                    label={tx(
                                                        "ต้องการ",
                                                        "Required"
                                                    )}
                                                    value={
                                                        item.requestedQuantity
                                                    }
                                                    unit={ui(
                                                        item.unit
                                                    )}
                                                />

                                                <MobileMetric
                                                    label={tx(
                                                        "คงเหลือ",
                                                        "Available"
                                                    )}
                                                    value={
                                                        item.availableQuantity
                                                    }
                                                    unit={ui(
                                                        item.unit
                                                    )}
                                                />

                                                <MobileMetric
                                                    label={tx(
                                                        "หลังจ่าย",
                                                        "After Issue"
                                                    )}
                                                    value={
                                                        item.remainingQuantity
                                                    }
                                                    unit={ui(
                                                        item.unit
                                                    )}
                                                    danger={
                                                        !item.isEnough
                                                    }
                                                />
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* Desktop / tablet table */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full min-w-[760px] text-sm">
                                        <thead className="border-b border-slate-200 bg-sky-50/70 text-xs font-bold uppercase tracking-wider text-slate-600">
                                            <tr>
                                                <th className="px-6 py-3.5 text-left">
                                                    {tx(
                                                        "รายการสิ่งของ",
                                                        "Item"
                                                    )}
                                                </th>

                                                <th className="px-4 py-3.5 text-center">
                                                    {tx(
                                                        "ต้องการ",
                                                        "Required"
                                                    )}
                                                </th>

                                                <th className="px-4 py-3.5 text-center">
                                                    {tx(
                                                        "คงเหลือ",
                                                        "Available"
                                                    )}
                                                </th>

                                                <th className="px-4 py-3.5 text-center">
                                                    {tx(
                                                        "หลังจ่าย",
                                                        "After Issue"
                                                    )}
                                                </th>

                                                <th className="px-6 py-3.5 text-center">
                                                    {tx(
                                                        "สถานะ",
                                                        "Status"
                                                    )}
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            {items.map(
                                                (item, index) => (
                                                    <tr
                                                        key={`${item.reliefItemId}-${index}`}
                                                        className={`transition ${
                                                            index % 2 === 0
                                                                ? "bg-white"
                                                                : "bg-slate-50/60"
                                                        } ${
                                                            item.isEnough
                                                                ? "hover:bg-sky-50/40"
                                                                : "bg-red-50/40 hover:bg-red-50/70"
                                                        }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                                        item.isEnough
                                                                            ? "bg-sky-50 text-sky-600"
                                                                            : "bg-red-100 text-red-600"
                                                                    }`}
                                                                >
                                                                    <span className="material-symbols-outlined text-xl">
                                                                        inventory_2
                                                                    </span>
                                                                </div>

                                                                <p className="font-black text-slate-900">
                                                                    {ui(
                                                                        item.reliefItemName
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </td>

                                                        <ValueCell
                                                            value={
                                                                item.requestedQuantity
                                                            }
                                                            unit={ui(
                                                                item.unit
                                                            )}
                                                        />

                                                        <ValueCell
                                                            value={
                                                                item.availableQuantity
                                                            }
                                                            unit={ui(
                                                                item.unit
                                                            )}
                                                        />

                                                        <ValueCell
                                                            value={
                                                                item.remainingQuantity
                                                            }
                                                            unit={ui(
                                                                item.unit
                                                            )}
                                                            danger={
                                                                !item.isEnough
                                                            }
                                                        />

                                                        <td className="px-6 py-4 text-center">
                                                            {item.isEnough ? (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                                                                    <span className="material-symbols-outlined text-sm">
                                                                        check_circle
                                                                    </span>
                                                                    {tx(
                                                                        "เพียงพอ",
                                                                        "Sufficient"
                                                                    )}
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-700">
                                                                    <span className="material-symbols-outlined text-sm">
                                                                        error
                                                                    </span>
                                                                    {tx(
                                                                        "ขาด",
                                                                        "Short"
                                                                    )}{" "}
                                                                    {
                                                                        item.shortageQuantity
                                                                    }{" "}
                                                                    {ui(
                                                                        item.unit
                                                                    )}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>

                                        <tfoot className="border-t border-slate-200 bg-slate-50">
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-6 py-3.5"
                                                >
                                                    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                                                        <p className="font-bold text-slate-600">
                                                            {tx(
                                                                "ตรวจสอบครบแล้ว",
                                                                "Checked"
                                                            )}{" "}
                                                            {items.length}/
                                                            {items.length}{" "}
                                                            {tx(
                                                                "รายการ",
                                                                "items"
                                                            )}
                                                        </p>

                                                        <div className="flex flex-wrap gap-3 text-xs font-bold">
                                                            <span className="text-emerald-700">
                                                                {tx(
                                                                    "เพียงพอ",
                                                                    "Sufficient"
                                                                )}{" "}
                                                                {
                                                                    enoughItems.length
                                                                }
                                                            </span>

                                                            <span
                                                                className={
                                                                    shortageItems.length >
                                                                    0
                                                                        ? "text-red-700"
                                                                        : "text-slate-500"
                                                                }
                                                            >
                                                                {tx(
                                                                    "ของขาด",
                                                                    "Insufficient"
                                                                )}{" "}
                                                                {
                                                                    shortageItems.length
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm md:hidden">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-bold text-slate-600">
                                            {tx(
                                                "ตรวจสอบครบแล้ว",
                                                "Checked"
                                            )}{" "}
                                            {items.length}/{items.length}
                                        </p>

                                        <div className="flex gap-3 text-xs font-bold">
                                            <span className="text-emerald-700">
                                                {tx(
                                                    "ผ่าน",
                                                    "OK"
                                                )}{" "}
                                                {enoughItems.length}
                                            </span>

                                            <span
                                                className={
                                                    shortageItems.length >
                                                    0
                                                        ? "text-red-700"
                                                        : "text-slate-500"
                                                }
                                            >
                                                {tx(
                                                    "ขาด",
                                                    "Short"
                                                )}{" "}
                                                {shortageItems.length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {shortageItems.length > 0 && (
                            <section className="rounded-xl border border-red-200 bg-white p-5">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-2xl text-red-600">
                                        error
                                    </span>

                                    <div>
                                        <h4 className="font-black text-slate-900">
                                            {tx(
                                                "รายการที่ต้องเติมก่อนรับงาน",
                                                "Items to Restock Before Accepting"
                                            )}
                                        </h4>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {shortageItems.map(
                                                (item, index) => (
                                                    <span
                                                        key={`${item.reliefItemId}-short-${index}`}
                                                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700"
                                                    >
                                                        {ui(
                                                            item.reliefItemName
                                                        )}{" "}
                                                        •{" "}
                                                        {tx(
                                                            "ขาด",
                                                            "short"
                                                        )}{" "}
                                                        {
                                                            item.shortageQuantity
                                                        }{" "}
                                                        {ui(
                                                            item.unit
                                                        )}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </main>
                )}

                <footer className="grid grid-cols-1 gap-3 border-t border-slate-200 bg-white px-6 py-4 md:grid-cols-[180px_1fr] md:px-8">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-slate-200 bg-white py-3 font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        {canConfirm
                            ? tx(
                                  "ยกเลิก",
                                  "Cancel"
                              )
                            : tx(
                                  "ปิด",
                                  "Close"
                              )}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading || !canConfirm}
                        className="rounded-xl bg-sky-600 py-3 font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {loading
                            ? tx(
                                  "กำลังรับงาน...",
                                  "Accepting..."
                              )
                            : isEmergency
                              ? tx(
                                    "ยืนยันรับเคส SOS",
                                    "Accept SOS Case"
                                )
                              : stockCheck?.isAllEnough
                                ? tx(
                                      "ยืนยันรับงาน",
                                      "Accept Case"
                                  )
                                : tx(
                                      "ยังไม่สามารถรับงานได้",
                                      "Cannot Accept Yet"
                                  )}
                    </button>
                </footer>
            </div>
        </div>
    );
}

function MetricCard({
    label,
    value,
    icon,
    tone,
}) {
    const toneClass = {
        default:
            "border-slate-200 bg-white text-slate-800",
        success:
            "border-emerald-200 bg-white text-emerald-700",
        danger:
            "border-red-200 bg-white text-red-700",
    };

    return (
        <div
            className={`rounded-xl border p-4 ${
                toneClass[tone] ||
                toneClass.default
            }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-500">
                        {label}
                    </p>

                    <p className="mt-1 text-3xl font-black">
                        {value}
                    </p>
                </div>

                <span className="material-symbols-outlined text-2xl opacity-70">
                    {icon}
                </span>
            </div>
        </div>
    );
}


function MobileMetric({
    label,
    value,
    unit,
    danger = false,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p
                className={`mt-1 text-base font-black ${
                    danger
                        ? "text-red-600"
                        : "text-slate-900"
                }`}
            >
                {value}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">
                {unit}
            </p>
        </div>
    );
}

function ValueCell({
    value,
    unit,
    danger = false,
}) {
    return (
        <td className="px-4 py-4 text-center">
            <p
                className={`font-black ${
                    danger
                        ? "text-red-600"
                        : "text-slate-900"
                }`}
            >
                {value}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
                {unit}
            </p>
        </td>
    );
}
