"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

import {
    useEffect,
    useMemo,
    useState,
} from "react";
import AdminSosPriorityBadge from "./AdminSosPriorityBadge";
import { getInventoryByCenter } from "@/services/admin/center-inventory";

function normalizeArray(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (Array.isArray(response?.inventories)) {
        return response.inventories;
    }

    return [];
}

function getInventoryItemId(item) {
    return String(
        item?.reliefItemId ??
            item?.itemId ??
            item?.reliefItem?.id ??
            ""
    );
}

export default function AdminAssignSosModal({
    caseItem,
    staffs,
    assigning,
    onClose,
    onConfirm,
}) {
    const { ui, language } = useNativeUi();

    const tx = (th, en) =>
        language === "en" ? en : th;

    const [staffId, setStaffId] =
        useState("");
    const [staffRemark, setStaffRemark] =
        useState("");
    const [checkingStock, setCheckingStock] =
        useState(false);
    const [stockCheck, setStockCheck] =
        useState(null);
    const [stockError, setStockError] =
        useState("");

    const isEmergency =
        String(caseItem?.requestType || "Relief")
            .trim()
            .toLowerCase() === "emergency";

    const requestedItems = useMemo(
        () =>
            Array.isArray(caseItem?.items)
                ? caseItem.items
                : [],
        [caseItem]
    );

    const availableStaffs = useMemo(() => {
        if (!caseItem) {
            return [];
        }

        const activeStaffs = Array.isArray(staffs)
            ? staffs.filter(
                  (staff) =>
                      staff?.isActive !== false
              )
            : [];

        const sameCenter = activeStaffs.filter(
            (staff) =>
                !caseItem.centerId ||
                !staff.centerId ||
                staff.centerId ===
                    caseItem.centerId
        );

        return sameCenter.length > 0
            ? sameCenter
            : activeStaffs;
    }, [caseItem, staffs]);

    const selectedStaff = useMemo(
        () =>
            availableStaffs.find(
                (staff) =>
                    String(staff.id) ===
                    String(staffId)
            ) ?? null,
        [availableStaffs, staffId]
    );

    useEffect(() => {
        setStaffId("");
        setStaffRemark("");
        setStockCheck(null);
        setStockError("");
        setCheckingStock(false);
    }, [caseItem?.id]);

    useEffect(() => {
        let cancelled = false;

        async function checkSelectedCenterInventory() {
            setStockCheck(null);
            setStockError("");

            if (!caseItem || !staffId) {
                return;
            }

            if (isEmergency) {
                setStockCheck({
                    centerId:
                        selectedStaff?.centerId ??
                        "",
                    centerName:
                        selectedStaff?.centerName ??
                        "",
                    isAllEnough: true,
                    isEmergency: true,
                    items: [],
                });
                return;
            }

            if (!selectedStaff?.centerId) {
                setStockError(
                    tx(
                        "ไม่พบศูนย์ของเจ้าหน้าที่ที่เลือก",
                        "The selected staff member has no assigned center."
                    )
                );
                return;
            }

            if (requestedItems.length === 0) {
                setStockError(
                    tx(
                        "ไม่พบรายการสิ่งของในคำขอนี้ จึงยังไม่สามารถมอบหมายได้",
                        "No requested items were found, so this case cannot be assigned yet."
                    )
                );
                return;
            }

            try {
                setCheckingStock(true);

                const response =
                    await getInventoryByCenter(
                        selectedStaff.centerId
                    );

                if (cancelled) {
                    return;
                }

                const inventories =
                    normalizeArray(response);

                const items = requestedItems.map(
                    (requested) => {
                        const reliefItemId =
                            String(
                                requested?.reliefItemId ??
                                    requested?.itemId ??
                                    requested
                                        ?.reliefItem
                                        ?.id ??
                                    ""
                            );

                        const inventory =
                            inventories.find(
                                (inventoryItem) =>
                                    getInventoryItemId(
                                        inventoryItem
                                    ) ===
                                    reliefItemId
                            );

                        const requestedQuantity =
                            Number(
                                requested?.quantity ??
                                    0
                            );
                        const availableQuantity =
                            Number(
                                inventory?.quantity ??
                                    inventory
                                        ?.currentQuantity ??
                                    0
                            );

                        const shortageQuantity =
                            Math.max(
                                requestedQuantity -
                                    availableQuantity,
                                0
                            );

                        return {
                            reliefItemId,
                            reliefItemName:
                                requested
                                    ?.reliefItemName ??
                                requested?.name ??
                                requested
                                    ?.reliefItem
                                    ?.name ??
                                inventory
                                    ?.reliefItemName ??
                                inventory?.name ??
                                "-",
                            unit:
                                requested?.unit ??
                                inventory?.unit ??
                                requested
                                    ?.reliefItem
                                    ?.unit ??
                                "",
                            requestedQuantity,
                            availableQuantity,
                            remainingQuantity:
                                Math.max(
                                    availableQuantity -
                                        requestedQuantity,
                                    0
                                ),
                            shortageQuantity,
                            isEnough:
                                availableQuantity >=
                                requestedQuantity,
                        };
                    }
                );

                setStockCheck({
                    centerId:
                        selectedStaff.centerId,
                    centerName:
                        selectedStaff.centerName,
                    isEmergency: false,
                    items,
                    isAllEnough:
                        items.length > 0 &&
                        items.every(
                            (item) =>
                                item.isEnough
                        ),
                });
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setStockError(
                    ui(
                        error?.message ||
                            "ไม่สามารถโหลดข้อมูลคลังสินค้าได้"
                    )
                );
            } finally {
                if (!cancelled) {
                    setCheckingStock(false);
                }
            }
        }

        checkSelectedCenterInventory();

        return () => {
            cancelled = true;
        };
    }, [
        caseItem,
        staffId,
        selectedStaff,
        requestedItems,
        isEmergency,
        language,
        ui,
    ]);

    if (!caseItem) {
        return null;
    }

    const canConfirm =
        Boolean(staffId) &&
        !assigning &&
        !checkingStock &&
        (isEmergency ||
            stockCheck?.isAllEnough === true);

    const handleSubmit = () => {
        if (!canConfirm || !selectedStaff) {
            return;
        }

        onConfirm({
            caseItem,
            staffId,
            centerId:
                selectedStaff.centerId,
            staffRemark,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm">
            <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white p-5">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-black text-slate-800">
                                {tx(
                                    "ตรวจสอบและมอบหมายเคส",
                                    "Review & Assign Case"
                                )}
                            </h2>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-black ${
                                    isEmergency
                                        ? "bg-red-100 text-red-700"
                                        : "bg-sky-100 text-sky-700"
                                }`}
                            >
                                {isEmergency
                                    ? tx(
                                          "SOS ฉุกเฉิน",
                                          "Emergency SOS"
                                      )
                                    : tx(
                                          "ขอรับสิ่งของ",
                                          "Relief Request"
                                      )}
                            </span>
                        </div>

                        <p className="mt-1 font-mono text-sm text-slate-500">
                            CASE #{caseItem.id}
                        </p>
                    </div>

                    <AdminSosPriorityBadge
                        priority={
                            isEmergency
                                ? "Critical"
                                : caseItem.priority
                        }
                    />
                </div>

                <div className="space-y-5 p-6">
                    <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-bold text-slate-400">
                                {tx(
                                    "ผู้แจ้ง",
                                    "Requester"
                                )}
                            </p>
                            <p className="mt-1 font-bold text-slate-800">
                                {caseItem.name}
                            </p>
                            <p className="text-sm text-slate-500">
                                {caseItem.phone}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-400">
                                {tx(
                                    "สถานที่",
                                    "Location"
                                )}
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-700">
                                {caseItem.address}
                            </p>
                        </div>
                    </div>

                    {!isEmergency && (
                        <section className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="font-black text-slate-800">
                                    {tx(
                                        "รายการสิ่งของที่ผู้ประสบภัยขอ",
                                        "Requested Relief Supplies"
                                    )}
                                </h3>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-sky-700">
                                    {
                                        requestedItems.length
                                    }{" "}
                                    {tx(
                                        "รายการ",
                                        "items"
                                    )}
                                </span>
                            </div>

                            {requestedItems.length ===
                            0 ? (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-700">
                                    {tx(
                                        "ไม่พบรายการสิ่งของในคำขอนี้",
                                        "No requested items were found in this request."
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-2 md:grid-cols-2">
                                    {requestedItems.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    item.id ||
                                                    item.reliefItemId ||
                                                    index
                                                }
                                                className="flex items-center justify-between rounded-xl border border-sky-100 bg-white px-4 py-3"
                                            >
                                                <div>
                                                    <p className="font-bold text-slate-800">
                                                        {ui(
                                                            item.reliefItemName
                                                        )}
                                                    </p>
                                                    <p className="font-mono text-[11px] text-slate-400">
                                                        #
                                                        {item.reliefItemId ||
                                                            "-"}
                                                    </p>
                                                </div>
                                                <p className="font-black text-sky-600">
                                                    {
                                                        item.quantity
                                                    }{" "}
                                                    <span className="text-xs font-bold text-slate-400">
                                                        {ui(
                                                            item.unit
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </section>
                    )}

                    {isEmergency && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                            <p className="font-black text-red-700">
                                {tx(
                                    "SOS ฉุกเฉิน — ไม่ต้องตรวจคลังสินค้า",
                                    "Emergency SOS — inventory check is not required"
                                )}
                            </p>
                            <p className="mt-1 text-sm text-red-600">
                                {tx(
                                    "เลือกเจ้าหน้าที่แล้วสามารถมอบหมายเพื่อเข้าช่วยเหลือได้ทันที",
                                    "Select a staff member and assign the case immediately."
                                )}
                            </p>
                        </div>
                    )}

                    <label className="block text-sm font-bold text-slate-700">
                        {tx(
                            "เลือกเจ้าหน้าที่",
                            "Select Staff"
                        )}

                        <select
                            value={staffId}
                            onChange={(event) =>
                                setStaffId(
                                    event.target
                                        .value
                                )
                            }
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        >
                            <option value="">
                                {tx(
                                    "-- เลือก Staff --",
                                    "-- Select Staff --"
                                )}
                            </option>

                            {availableStaffs.map(
                                (staff) => (
                                    <option
                                        key={
                                            staff.id
                                        }
                                        value={
                                            staff.id
                                        }
                                    >
                                        {
                                            staff.fullName
                                        }{" "}
                                        —{" "}
                                        {ui(
                                            staff.centerName
                                        )}
                                    </option>
                                )
                            )}
                        </select>
                    </label>

                    {availableStaffs.length ===
                        0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                            {tx(
                                "ไม่พบ Staff ที่เปิดใช้งาน",
                                "No active staff members were found."
                            )}
                        </div>
                    )}

                    {!isEmergency && (
                        <section className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="mb-4">
                                <h3 className="font-black text-slate-800">
                                    {tx(
                                        "ตรวจคลังของศูนย์เจ้าหน้าที่",
                                        "Selected Staff Center Inventory Check"
                                    )}
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    {tx(
                                        "ระบบจะตรวจคลังอัตโนมัติเมื่อเลือกเจ้าหน้าที่",
                                        "Inventory is checked automatically after selecting a staff member."
                                    )}
                                </p>
                            </div>

                            {!staffId ? (
                                <div className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                                    {tx(
                                        "เลือกเจ้าหน้าที่ก่อนเพื่อเริ่มตรวจคลัง",
                                        "Select a staff member to begin the inventory check."
                                    )}
                                </div>
                            ) : checkingStock ? (
                                <div className="flex items-center justify-center gap-3 rounded-xl bg-slate-50 p-6 text-slate-500">
                                    <span className="material-symbols-outlined animate-spin">
                                        progress_activity
                                    </span>
                                    <span className="font-bold">
                                        {tx(
                                            "กำลังตรวจสอบคลังสินค้า...",
                                            "Checking inventory..."
                                        )}
                                    </span>
                                </div>
                            ) : stockError ? (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                                    {stockError}
                                </div>
                            ) : stockCheck ? (
                                <>
                                    <div
                                        className={`mb-4 rounded-xl border p-4 ${
                                            stockCheck.isAllEnough
                                                ? "border-emerald-200 bg-emerald-50"
                                                : "border-red-200 bg-red-50"
                                        }`}
                                    >
                                        <p
                                            className={`font-black ${
                                                stockCheck.isAllEnough
                                                    ? "text-emerald-700"
                                                    : "text-red-700"
                                            }`}
                                        >
                                            {stockCheck.isAllEnough
                                                ? tx(
                                                      "สิ่งของเพียงพอ สามารถมอบหมายได้",
                                                      "Inventory is sufficient. Assignment is allowed."
                                                  )
                                                : tx(
                                                      "สิ่งของไม่เพียงพอ ยังไม่สามารถมอบหมายได้",
                                                      "Inventory is insufficient. Assignment is blocked."
                                                  )}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {tx(
                                                "ศูนย์",
                                                "Center"
                                            )}
                                            :{" "}
                                            {ui(
                                                stockCheck.centerName ||
                                                    stockCheck.centerId
                                            )}
                                        </p>
                                    </div>

                                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-slate-50 text-xs text-slate-500">
                                                <tr>
                                                    <th className="px-4 py-3 text-left">
                                                        {tx(
                                                            "รายการ",
                                                            "Item"
                                                        )}
                                                    </th>
                                                    <th className="px-4 py-3 text-center">
                                                        {tx(
                                                            "ต้องการ",
                                                            "Required"
                                                        )}
                                                    </th>
                                                    <th className="px-4 py-3 text-center">
                                                        {tx(
                                                            "คงเหลือ",
                                                            "Available"
                                                        )}
                                                    </th>
                                                    <th className="px-4 py-3 text-center">
                                                        {tx(
                                                            "หลังจ่าย",
                                                            "After Issue"
                                                        )}
                                                    </th>
                                                    <th className="px-4 py-3 text-center">
                                                        {tx(
                                                            "ผลตรวจ",
                                                            "Result"
                                                        )}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {stockCheck.items.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={
                                                                item.reliefItemId ||
                                                                index
                                                            }
                                                        >
                                                            <td className="px-4 py-3 font-bold text-slate-700">
                                                                {ui(
                                                                    item.reliefItemName
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {
                                                                    item.requestedQuantity
                                                                }{" "}
                                                                {ui(
                                                                    item.unit
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {
                                                                    item.availableQuantity
                                                                }{" "}
                                                                {ui(
                                                                    item.unit
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {
                                                                    item.remainingQuantity
                                                                }{" "}
                                                                {ui(
                                                                    item.unit
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {item.isEnough ? (
                                                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                                                                        {tx(
                                                                            "เพียงพอ",
                                                                            "Enough"
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
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
                                        </table>
                                    </div>
                                </>
                            ) : null}
                        </section>
                    )}

                    <label className="block text-sm font-bold text-slate-700">
                        {tx(
                            "หมายเหตุการมอบหมาย",
                            "Assignment Note"
                        )}

                        <textarea
                            rows={3}
                            value={staffRemark}
                            onChange={(event) =>
                                setStaffRemark(
                                    event.target
                                        .value
                                )
                            }
                            placeholder={tx(
                                "เช่น ให้รีบติดต่อผู้ประสบภัยทันที",
                                "e.g. Contact the requester immediately"
                            )}
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
                            {tx(
                                "ยกเลิก",
                                "Cancel"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!canConfirm}
                            className="flex-1 rounded-xl bg-sky-600 py-3 font-bold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {assigning
                                ? tx(
                                      "กำลังมอบหมาย...",
                                      "Assigning..."
                                  )
                                : !isEmergency &&
                                    stockCheck?.isAllEnough
                                  ? tx(
                                        "ตรวจของผ่านแล้ว — ยืนยันมอบหมาย",
                                        "Stock Check Passed — Confirm Assignment"
                                    )
                                  : tx(
                                        "ยืนยันมอบหมาย",
                                        "Confirm Assignment"
                                    )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
