"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import InventoryHeader from "./InventoryHeader";
import InventorySummary from "./InventorySummary";
import InventoryFilter from "./InventoryFilter";
import InventoryList from "./InventoryList";
import InventorySkeleton from "./InventorySkeleton";
import InventoryEmptyState from "./InventoryEmptyState";
import InventoryHistoryModal from "./InventoryHistoryModal";

import { getCenterInventory } from "@/services/staff/inventory";

const TAB_ALL = "ทั้งหมด";

function normalizeResponse(response) {
    const source = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.items)
                ? response.items
                : Array.isArray(response?.inventories)
                    ? response.inventories
                    : [];

    return source.map((item) => ({
        id:
            item.id ??
            item.inventoryId ??
            item.centerInventoryId ??
            "",
        centerId:
            item.centerId ??
            item.center?.id ??
            "",
        centerName:
            item.centerName ??
            item.center?.centerName ??
            "ไม่ระบุศูนย์",
        reliefItemId:
            item.reliefItemId ??
            item.itemId ??
            item.reliefItem?.id ??
            "",
        name:
            item.reliefItemName ??
            item.itemName ??
            item.name ??
            item.reliefItem?.name ??
            "ไม่ระบุชื่อสิ่งของ",
        category:
            item.categoryName ??
            item.reliefCategoryName ??
            item.category ??
            item.reliefItem?.category?.name ??
            "อื่น ๆ",
        quantity: Number(item.quantity ?? 0),
        minimumQuantity: Number(
            item.minimumQuantity ??
            item.minQuantity ??
            0
        ),
        unit:
            item.unit ??
            item.reliefItem?.unit ??
            "ชิ้น",
        updatedAt:
            item.updatedAt ??
            item.createdAt ??
            null,
    }));
}

function getStockLevel(item) {
    const quantity = Number(item.quantity || 0);
    const minimum = Number(item.minimumQuantity || 0);

    if (minimum <= 0) {
        return "sufficient";
    }

    if (quantity <= minimum) {
        return "critical";
    }

    if (quantity <= minimum * 1.5) {
        return "low";
    }

    return "sufficient";
}

export default function StaffInventory() {
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState(TAB_ALL);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);

    const loadInventory = useCallback(async (signal, showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const staffStorage =
                localStorage.getItem("staff");

            if (!staffStorage) {
                throw new Error(
                    "ไม่พบข้อมูลเจ้าหน้าที่ กรุณาเข้าสู่ระบบใหม่"
                );
            }

            const staff = JSON.parse(staffStorage);

            const centerId =
                staff.centerId ||
                staff.CenterId;

            if (!centerId) {
                throw new Error(
                    "ไม่พบรหัสศูนย์ของเจ้าหน้าที่"
                );
            }

            const response =
                await getCenterInventory(
                    centerId,
                    signal
                );
            setItems(normalizeResponse(response));
        } catch (error) {
            if (error?.name === "AbortError") {
                return;
            }

            console.error("โหลดคลังสินค้าไม่สำเร็จ:", error);

            await Swal.fire({
                icon: "error",
                title: "โหลดข้อมูลไม่สำเร็จ",
                text:
                    error?.message ||
                    "ไม่สามารถโหลดข้อมูลคลังสินค้าได้",
                confirmButtonText: "ตกลง",
            });
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        loadInventory(controller.signal);

        return () => {
            controller.abort();
        };
    }, [loadInventory]);

    const tabs = useMemo(() => {
        const categories = [
            ...new Set(
                items
                    .map((item) => item.category)
                    .filter(Boolean)
            ),
        ];

        return [TAB_ALL, ...categories];
    }, [items]);

    const filteredItems = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        return items.filter((item) => {
            const matchSearch =
                !keyword ||
                item.name.toLowerCase().includes(keyword) ||
                item.category.toLowerCase().includes(keyword) ||
                item.reliefItemId.toLowerCase().includes(keyword);

            const matchTab =
                activeTab === TAB_ALL ||
                item.category === activeTab;

            return matchSearch && matchTab;
        });
    }, [items, activeTab, searchText]);

    const summary = useMemo(() => {
        const totalQuantity = items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const urgentCount = items.filter(
            (item) => getStockLevel(item) === "critical"
        ).length;

        return {
            totalQuantity,
            urgentCount,
        };
    }, [items]);

    const centerName =
        items.find((item) => item.centerName)?.centerName ||
        "คลังสินค้าของศูนย์";

    const handleRefresh = async () => {
        const controller = new AbortController();
        await loadInventory(controller.signal, false);
    };

    if (loading) {
        return <InventorySkeleton />;
    }

    return (
        <section className="w-full">
            <InventoryHeader
                centerName={centerName}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                onOpenHistory={() => setHistoryOpen(true)}
            />

            <InventorySummary
                totalQuantity={summary.totalQuantity}
                urgentCount={summary.urgentCount}
            />

            <InventoryFilter
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchText={searchText}
                onSearchChange={setSearchText}
            />

            {filteredItems.length === 0 ? (
                <InventoryEmptyState
                    hasItems={items.length > 0}
                />
            ) : (
                <InventoryList
                    items={filteredItems}
                    getStockLevel={getStockLevel}
                />
            )}

            <InventoryHistoryModal
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                inventories={items}
                centerName={centerName}
            />
        </section>
    );
}
