"use client";

import { useMemo, useState } from "react";
import AdminSosPriorityBadge from "./AdminSosPriorityBadge";

export default function AdminAssignSosModal({
    caseItem,
    staffs,
    assigning,
    onClose,
    onConfirm,
}) {
    const [staffId, setStaffId] = useState("");
    const [staffRemark, setStaffRemark] = useState("");

    const availableStaffs = useMemo(() => {
        if (!caseItem) {
            return [];
        }

        const sameCenter = staffs.filter(
            (staff) =>
                !caseItem.centerId ||
                !staff.centerId ||
                staff.centerId === caseItem.centerId
        );

        return sameCenter.length > 0
            ? sameCenter
            : staffs;
    }, [caseItem, staffs]);

    if (!caseItem) {
        return null;
    }

    const handleSubmit = () => {
        onConfirm({
            caseItem,
            staffId,
            staffRemark,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50 p-5">
                    <div>
                        <h2 className="font-bold text-slate-800">
                            มอบหมายเคสให้ Staff
                        </h2>

                        <p className="mt-1 font-mono text-sm text-slate-500">
                            SOS #{caseItem.id}
                        </p>
                    </div>

                    <AdminSosPriorityBadge
                        priority={caseItem.priority}
                    />
                </div>

                <div className="space-y-5 p-6">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="font-bold text-slate-800">
                            {caseItem.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            {caseItem.address}
                        </p>
                        <p className="mt-2 text-xs font-bold text-sky-600">
                            ศูนย์: {caseItem.centerName}
                        </p>
                    </div>

                    <label className="block text-sm font-bold text-slate-700">
                        เลือกเจ้าหน้าที่

                        <select
                            value={staffId}
                            onChange={(event) =>
                                setStaffId(event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        >
                            <option value="">
                                -- เลือก Staff --
                            </option>

                            {availableStaffs.map((staff) => (
                                <option
                                    key={staff.id}
                                    value={staff.id}
                                >
                                    {staff.fullName} — {staff.centerName}
                                </option>
                            ))}
                        </select>
                    </label>

                    {availableStaffs.length === 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                            ไม่พบ Staff ที่เปิดใช้งาน กรุณาตรวจสอบ API Staff
                        </div>
                    )}

                    <label className="block text-sm font-bold text-slate-700">
                        หมายเหตุการมอบหมาย

                        <textarea
                            rows={3}
                            value={staffRemark}
                            onChange={(event) =>
                                setStaffRemark(event.target.value)
                            }
                            placeholder="เช่น ให้รีบติดต่อผู้ประสบภัยทันที"
                            className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        />
                    </label>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={assigning}
                            className="flex-1 rounded-xl border border-slate-200 bg-white py-3 font-bold text-slate-600"
                        >
                            ยกเลิก
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={
                                assigning ||
                                !staffId
                            }
                            className="flex-1 rounded-xl bg-sky-600 py-3 font-bold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {assigning
                                ? "กำลังมอบหมาย..."
                                : "ยืนยันมอบหมาย"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
