"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import CrisisMapSidebar from "./CrisisMapSidebar";
import CrisisMapLegend from "./CrisisMapLegend";
import CrisisCaseModal from "./CrisisCaseModal";
import CrisisMapSkeleton from "./CrisisMapSkeleton";
import CrisisStockCheckModal from "./CrisisStockCheckModal";
import { acceptSosRequest, getMyAssignedSosRequests, getPendingSosRequests, getStaffSosRequestById } from "@/services/staff/sos";
import { getCenterInventory } from "@/services/staff/inventory";

function normalizeList(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.requests)) return response.requests;
    return [];
}
const CrisisMapCanvas = dynamic(
    () => import("./CrisisMapCanvas"),
    {
        ssr: false,
        loading: () => (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <span className="material-symbols-outlined animate-spin text-4xl text-sky-500">
                        progress_activity
                    </span>

                    <p className="mt-3 text-sm text-slate-500">
                        กำลังโหลดแผนที่...
                    </p>
                </div>
            </div>
        ),
    }
);
function normalizeCase(item) {
    return {
        id: item.id ?? item.sosRequestId ?? item.requestId ?? "",
        userId: item.userId ?? "",
        userName: item.userFullName ?? item.userName ?? item.fullName ?? "ไม่ระบุชื่อ",
        phone: item.userPhoneNumber ?? item.userPhone ?? item.phoneNumber ?? "-",
        latitude: Number(item.latitude ?? 0),
        longitude: Number(item.longitude ?? 0),
        address: item.addressDetail ?? item.address ?? "ไม่ระบุสถานที่",
        priority: item.priority ?? "Normal",
        status: item.status ?? "Pending",
        centerId: item.centerId ?? "",
        centerName: item.centerName ?? "ยังไม่ระบุศูนย์",
        assignedStaffId: item.assignedStaffId ?? null,
        assignedStaffName: item.assignedStaffName ?? null,
        createdAt: item.createdAt ?? null,
        updatedAt: item.updatedAt ?? null,
        remark: item.userRemark ?? item.remark ?? "",
    };
}

function getPriorityRank(priority) {
    const value = String(priority || "").trim().toLowerCase();
    if (value === "critical") return 1;
    if (value === "urgent") return 2;
    return 3;
}

function deduplicateCases(cases) {
    const map = new Map();
    for (const item of cases) {
        if (!item?.id) continue;
        const existing = map.get(item.id);
        if (!existing || (item.assignedStaffId && !existing.assignedStaffId)) map.set(item.id, item);
    }
    return [...map.values()];
}

export default function StaffCrisisMap() {
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [activePriority, setActivePriority] = useState("all");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [acceptingId, setAcceptingId] = useState("");
    const [stockCase, setStockCase] = useState(null);
    const [stockCheck, setStockCheck] = useState(null);
    const [checkingStock, setCheckingStock] = useState(false);

    const loadCases = useCallback(async (signal, showLoading = true) => {
        try {
            showLoading ? setLoading(true) : setRefreshing(true);
            const [pendingResult, assignedResult] = await Promise.allSettled([
                getPendingSosRequests(signal),
                getMyAssignedSosRequests(signal),
            ]);
            const pendingCases = pendingResult.status === "fulfilled" ? normalizeList(pendingResult.value).map(normalizeCase) : [];
            const assignedCases = assignedResult.status === "fulfilled" ? normalizeList(assignedResult.value).map(normalizeCase) : [];
            const merged = deduplicateCases([...pendingCases, ...assignedCases]).sort((a, b) => {
                const p = getPriorityRank(a.priority) - getPriorityRank(b.priority);
                return p !== 0 ? p : new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            });
            setCases(merged);
            if (pendingResult.status === "rejected" && assignedResult.status === "rejected") {
                throw pendingResult.reason || assignedResult.reason || new Error("โหลดข้อมูลไม่สำเร็จ");
            }
        } catch (error) {
            if (error?.name === "AbortError") return;
            await Swal.fire({ icon: "error", title: "โหลดข้อมูลไม่สำเร็จ", text: error?.message || "ไม่สามารถโหลดรายการ SOS ได้" });
        } finally {
            if (!signal?.aborted) { setLoading(false); setRefreshing(false); }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        loadCases(controller.signal);
        return () => controller.abort();
    }, [loadCases]);

    const filteredCases = useMemo(() => activePriority === "all" ? cases : cases.filter(item => String(item.priority).trim().toLowerCase() === activePriority), [cases, activePriority]);
    const summary = useMemo(() => ({
        total: cases.length,
        critical: cases.filter(x => String(x.priority).toLowerCase() === "critical").length,
        urgent: cases.filter(x => String(x.priority).toLowerCase() === "urgent").length,
        assigned: cases.filter(x => x.assignedStaffId).length,
        pending: cases.filter(x => !x.assignedStaffId).length,
    }), [cases]);

    const handleAccept = async (caseItem) => {
        if (!caseItem?.id || caseItem.assignedStaffId) return;

        try {
            setStockCase(caseItem);
            setStockCheck(null);
            setCheckingStock(true);

            if (String(caseItem.requestType || "Relief").toLowerCase() === "emergency") {
                setStockCheck({
                    sosRequestId: caseItem.id,
                    centerId: null,
                    items: [],
                    isAllEnough: true,
                    isEmergency: true,
                });
                return;
            }

            const rawStaff = localStorage.getItem("staff");
            if (!rawStaff) throw new Error("ไม่พบข้อมูลเจ้าหน้าที่ กรุณาเข้าสู่ระบบใหม่");

            const staff = JSON.parse(rawStaff);
            const centerId = staff?.centerId ?? staff?.CenterId ?? "";
            if (!centerId) throw new Error("ไม่พบรหัสศูนย์ของเจ้าหน้าที่");

            const [detailResponse, inventoryResponse] = await Promise.all([
                getStaffSosRequestById(caseItem.id),
                getCenterInventory(centerId),
            ]);

            const detail = detailResponse?.data ?? detailResponse;
            const requestedItems = Array.isArray(detail?.items) ? detail.items : [];
            const inventories = normalizeList(inventoryResponse);

            const items = requestedItems.map((requested) => {
                const reliefItemId = requested.reliefItemId ?? requested.itemId ?? requested.reliefItem?.id ?? "";
                const inventory = inventories.find((x) =>
                    String(x.reliefItemId ?? x.itemId ?? x.reliefItem?.id ?? "") === String(reliefItemId)
                );

                const requestedQuantity = Number(requested.quantity ?? 0);
                const availableQuantity = Number(inventory?.quantity ?? 0);
                const shortageQuantity = Math.max(requestedQuantity - availableQuantity, 0);

                return {
                    reliefItemId,
                    reliefItemName: requested.reliefItemName ?? requested.name ?? requested.reliefItem?.name ?? inventory?.reliefItemName ?? inventory?.name ?? "ไม่ระบุรายการ",
                    unit: requested.unit ?? inventory?.unit ?? requested.reliefItem?.unit ?? "ชิ้น",
                    requestedQuantity,
                    availableQuantity,
                    remainingQuantity: Math.max(availableQuantity - requestedQuantity, 0),
                    shortageQuantity,
                    isEnough: availableQuantity >= requestedQuantity,
                };
            });

            setStockCheck({
                sosRequestId: caseItem.id,
                centerId,
                items,
                isAllEnough: items.length > 0 && items.every((x) => x.isEnough),
            });
        } catch (error) {
            setStockCase(null);
            setStockCheck(null);
            await Swal.fire({
                icon: "error",
                title: "ตรวจสอบคลังไม่สำเร็จ",
                text: error?.message || "ไม่สามารถตรวจสอบสิ่งของในคลังได้",
            });
        } finally {
            setCheckingStock(false);
        }
    };

    const handleConfirmAccept = async () => {
        if (!stockCase?.id || !stockCheck?.isAllEnough) return;

        const confirmation = await Swal.fire({
            icon: "question",
            title: "ยืนยันรับเคสนี้?",
            text: stockCheck?.isEmergency
                ? "เคส SOS ฉุกเฉินไม่ต้องตรวจคลังสินค้า"
                : "ระบบตรวจสอบแล้วว่าสิ่งของในคลังเพียงพอ",
            input: "textarea",
            inputLabel: "หมายเหตุเจ้าหน้าที่ (ไม่บังคับ)",
            showCancelButton: true,
            confirmButtonText: "ยืนยันรับงาน",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#0284c7",
        });

        if (!confirmation.isConfirmed) return;

        try {
            setAcceptingId(stockCase.id);
            const response = await acceptSosRequest(stockCase.id, {
                staffRemark: confirmation.value || "",
            });

            const patch = {
                status: response?.data?.status || response?.status || "Accepted",
                assignedStaffId: response?.data?.assignedStaffId || response?.assignedStaffId || "current-staff",
            };

            setCases((current) => current.map((item) =>
                item.id === stockCase.id ? { ...item, ...patch } : item
            ));
            setSelectedCase((current) =>
                current?.id === stockCase.id ? { ...current, ...patch } : current
            );
            setStockCase(null);
            setStockCheck(null);

            await Swal.fire({
                icon: "success",
                title: "รับเคสสำเร็จ",
                text: "ตรวจสอบคลังและมอบหมายเคสให้คุณแล้ว",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "รับเคสไม่สำเร็จ",
                text: error?.message || "ไม่สามารถรับเคสนี้ได้",
            });
        } finally {
            setAcceptingId("");
        }
    };

    if (loading) return <CrisisMapSkeleton />;

    return (
        //<section className="relative h-[calc(100vh-72px)] w-full overflow-hidden bg-slate-100">
        <section className="fixed inset-x-0 bottom-0 top-[65px] z-40 overflow-hidden bg-slate-100">
            <CrisisMapCanvas cases={filteredCases} onSelectCase={setSelectedCase} />
            <CrisisMapSidebar summary={summary} cases={filteredCases} activePriority={activePriority} onPriorityChange={setActivePriority} onSelectCase={setSelectedCase} onRefresh={() => { const c = new AbortController(); loadCases(c.signal, false); }} refreshing={refreshing} />
            <CrisisCaseModal caseItem={selectedCase} onClose={() => setSelectedCase(null)} onAccept={handleAccept} accepting={acceptingId === selectedCase?.id} />
            <CrisisStockCheckModal
                caseItem={stockCase}
                stockCheck={stockCheck}
                loading={checkingStock}
                accepting={acceptingId === stockCase?.id}
                onClose={() => {
                    if (acceptingId) return;
                    setStockCase(null);
                    setStockCheck(null);
                }}
                onConfirm={handleConfirmAccept}
            />
            <CrisisMapLegend />
        </section>
    );
}
