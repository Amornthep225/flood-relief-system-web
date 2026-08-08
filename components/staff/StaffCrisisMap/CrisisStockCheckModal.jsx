"use client";

export default function CrisisStockCheckModal({ caseItem, stockCheck, loading, accepting, onClose, onConfirm }) {
    if (!caseItem) return null;

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                            <span className="material-symbols-outlined">{stockCheck?.isEmergency ? "sos" : "inventory_2"}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">{stockCheck?.isEmergency ? "รับเคส SOS ฉุกเฉิน" : "ตรวจสอบคลังก่อนรับเคส"}</h2>
                            <p className="text-sm text-slate-500">SOS #{caseItem.id}</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} disabled={accepting} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-50">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex min-h-[320px] flex-col items-center justify-center">
                        <span className="material-symbols-outlined animate-spin text-5xl text-sky-500">progress_activity</span>
                        <p className="mt-4 font-bold text-slate-600">กำลังตรวจสอบสิ่งของในคลัง...</p>
                    </div>
                ) : (
                    <>
                        <div className="max-h-[62vh] overflow-y-auto p-6">
                            <div className={`mb-5 rounded-2xl border p-4 ${stockCheck?.isAllEnough ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined text-3xl ${stockCheck?.isAllEnough ? "text-emerald-600" : "text-red-600"}`}>
                                        {stockCheck?.isAllEnough ? "check_circle" : "error"}
                                    </span>
                                    <div>
                                        <p className={`font-black ${stockCheck?.isAllEnough ? "text-emerald-700" : "text-red-700"}`}>
                                            {stockCheck?.isEmergency
                                                ? "SOS ฉุกเฉิน พร้อมรับเคสได้ทันที"
                                                : stockCheck?.isAllEnough
                                                  ? "สิ่งของเพียงพอทุกรายการ"
                                                  : "สิ่งของในคลังไม่เพียงพอ"}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {stockCheck?.isEmergency
                                                ? "ภารกิจช่วยเหลือฉุกเฉิน ไม่ต้องตรวจคลังสินค้า"
                                                : `ศูนย์ ${stockCheck?.centerId || "-"} • ต้องตรวจผ่านก่อนจึงจะรับเคสได้`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {stockCheck?.isEmergency ? (
                                <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center font-bold text-red-700">
                                    เปิดรายละเอียดเคสเพื่อดูประเภทเหตุ จำนวนผู้ประสบภัย และพิกัดก่อนออกช่วยเหลือ
                                </div>
                            ) : !stockCheck?.items?.length ? (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center font-bold text-amber-700">
                                    ไม่พบรายการสิ่งของที่ร้องขอ จึงยังไม่สามารถยืนยันรับเคสได้
                                </div>
                            ) : (
                                <div className="overflow-hidden rounded-2xl border border-slate-200">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 text-xs font-black text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3 text-left">รายการ</th>
                                                <th className="px-4 py-3 text-center">ต้องการ</th>
                                                <th className="px-4 py-3 text-center">คงเหลือ</th>
                                                <th className="px-4 py-3 text-center">หลังจ่าย</th>
                                                <th className="px-4 py-3 text-center">ผลตรวจ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {stockCheck.items.map((item, index) => (
                                                <tr key={`${item.reliefItemId}-${index}`} className={!item.isEnough ? "bg-red-50/50" : "bg-white"}>
                                                    <td className="px-4 py-4 font-bold text-slate-700">{item.reliefItemName}</td>
                                                    <td className="px-4 py-4 text-center font-bold">{item.requestedQuantity} {item.unit}</td>
                                                    <td className="px-4 py-4 text-center font-black text-sky-600">{item.availableQuantity} {item.unit}</td>
                                                    <td className="px-4 py-4 text-center font-bold text-slate-600">{item.remainingQuantity} {item.unit}</td>
                                                    <td className="px-4 py-4 text-center">
                                                        {item.isEnough ? (
                                                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">เพียงพอ</span>
                                                        ) : (
                                                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">ขาด {item.shortageQuantity} {item.unit}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                            <button type="button" onClick={onClose} disabled={accepting} className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50">ยกเลิก</button>
                            <button type="button" onClick={onConfirm} disabled={accepting || !stockCheck?.isAllEnough} className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                                <span className={`material-symbols-outlined text-lg ${accepting ? "animate-spin" : ""}`}>{accepting ? "progress_activity" : "assignment_turned_in"}</span>
                                {accepting ? "กำลังรับเคส..." : "ยืนยันรับเคส"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
