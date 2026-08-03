"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import ReliefManageTabs from "./ReliefManageTabs";
import ReliefManageToolbar from "./ReliefManageToolbar";
import ReliefCategoryTable from "./ReliefCategoryTable";
import ReliefItemTable from "./ReliefItemTable";
import ReliefCategoryModal from "./ReliefCategoryModal";
import ReliefItemModal from "./ReliefItemModal";
import {
    getReliefCategories,
    createReliefCategory,
    updateReliefCategory,
    updateReliefCategoryStatus,
} from "@/services/admin/reliefCategories";
import {
    getReliefItems,
    createReliefItem,
    updateReliefItem,
    updateReliefItemStatus,
} from "@/services/admin/reliefItems";

const asArray = (value) =>
    Array.isArray(value)
        ? value
        : Array.isArray(value?.data)
          ? value.data
          : Array.isArray(value?.items)
            ? value.items
            : Array.isArray(value?.categories)
              ? value.categories
              : [];

const normalizeCategory = (item) => ({
    id: item.id ?? item.categoryId ?? "",
    name: item.name ?? item.categoryName ?? "",
    isActive: item.isActive !== false,
});

const normalizeItem = (item) => ({
    id: item.id ?? item.reliefItemId ?? "",
    name: item.name ?? item.reliefItemName ?? "",
    unit: item.unit ?? "",
    categoryId: item.categoryId ?? item.reliefCategoryId ?? "",
    categoryName:
        item.categoryName ??
        item.category?.name ??
        item.reliefCategoryName ??
        "",
    isActive: item.isActive !== false,
});

export default function AdminReliefManage() {
    const [activeTab, setActiveTab] = useState("items");
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categoryModal, setCategoryModal] = useState({ open: false, item: null });
    const [itemModal, setItemModal] = useState({ open: false, item: null });

    const loadData = useCallback(async (signal, showLoading = true) => {
        try {
            showLoading ? setLoading(true) : setRefreshing(true);
            const [categoryResponse, itemResponse] = await Promise.all([
                getReliefCategories(signal),
                getReliefItems(signal),
            ]);
            setCategories(asArray(categoryResponse).map(normalizeCategory));
            setItems(asArray(itemResponse).map(normalizeItem));
        } catch (error) {
            if (error?.name !== "AbortError") {
                await Swal.fire("โหลดข้อมูลไม่สำเร็จ", error.message, "error");
            }
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        loadData(controller.signal);
        return () => controller.abort();
    }, [loadData]);

    useEffect(() => {
        setSearchText("");
        setStatusFilter("all");
        setCategoryFilter("all");
    }, [activeTab]);

    const filteredCategories = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();
        return categories.filter((item) => {
            const matchSearch =
                !keyword || `${item.id} ${item.name}`.toLowerCase().includes(keyword);
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && item.isActive) ||
                (statusFilter === "inactive" && !item.isActive);
            return matchSearch && matchStatus;
        });
    }, [categories, searchText, statusFilter]);

    const filteredItems = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();
        return items.filter((item) => {
            const matchSearch =
                !keyword ||
                `${item.id} ${item.name} ${item.unit} ${item.categoryName}`
                    .toLowerCase()
                    .includes(keyword);
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && item.isActive) ||
                (statusFilter === "inactive" && !item.isActive);
            const matchCategory =
                categoryFilter === "all" || item.categoryId === categoryFilter;
            return matchSearch && matchStatus && matchCategory;
        });
    }, [items, searchText, statusFilter, categoryFilter]);

    const refreshData = async () => {
        const controller = new AbortController();
        await loadData(controller.signal, false);
    };

    const saveCategory = async (form) => {
        try {
            setSaving(true);
            categoryModal.item
                ? await updateReliefCategory(categoryModal.item.id, form)
                : await createReliefCategory(form);
            setCategoryModal({ open: false, item: null });
            await refreshData();
            await Swal.fire({ icon: "success", title: "บันทึกหมวดหมู่สำเร็จ", timer: 900, showConfirmButton: false });
        } catch (error) {
            await Swal.fire("บันทึกไม่สำเร็จ", error.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const saveItem = async (form) => {
        try {
            setSaving(true);
            itemModal.item
                ? await updateReliefItem(itemModal.item.id, form)
                : await createReliefItem(form);
            setItemModal({ open: false, item: null });
            await refreshData();
            await Swal.fire({ icon: "success", title: "บันทึกสินค้าสำเร็จ", timer: 900, showConfirmButton: false });
        } catch (error) {
            await Swal.fire("บันทึกไม่สำเร็จ", error.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (type, item) => {
        const nextStatus = !item.isActive;
        const result = await Swal.fire({
            icon: "question",
            title: nextStatus ? "เปิดใช้งานข้อมูลนี้?" : "ปิดใช้งานข้อมูลนี้?",
            text: item.name,
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        });
        if (!result.isConfirmed) return;

        try {
            if (type === "item") {
                await updateReliefItemStatus(item.id, nextStatus);
            } else {
                await updateReliefCategoryStatus(item.id, nextStatus);
            }
            await refreshData();
        } catch (error) {
            await Swal.fire("เปลี่ยนสถานะไม่สำเร็จ", error.message, "error");
        }
    };

    return (
        <RoleGuard role="Admin" storageKey="admin" loginPath="/admin-login">
            <div className="min-h-screen bg-[#f4f8fb]">
                <header className="border-b border-slate-200 bg-white px-5 py-5 md:px-8">
                    <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-500">
                                Resource Management
                            </p>
                            <h1 className="mt-1 text-2xl font-black text-slate-800">
                                จัดการสิ่งของและประเภท
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                จัดการข้อมูลสินค้าและหมวดหมู่สำหรับทุกศูนย์
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={refreshData}
                            disabled={refreshing}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:border-sky-300 hover:text-sky-600"
                        >
                            <span className={`material-symbols-outlined text-[19px] ${refreshing ? "animate-spin" : ""}`}>
                                refresh
                            </span>
                            อัปเดตข้อมูล
                        </button>
                    </div>
                </header>

                <main className="mx-auto max-w-[1450px] space-y-6 p-5 md:p-8">
                    <ReliefManageTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        itemCount={items.length}
                        itemActive={items.filter((item) => item.isActive).length}
                        categoryCount={categories.length}
                        categoryActive={categories.filter((item) => item.isActive).length}
                    />

                    <ReliefManageToolbar
                        activeTab={activeTab}
                        searchText={searchText}
                        onSearchChange={setSearchText}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                        categoryFilter={categoryFilter}
                        onCategoryChange={setCategoryFilter}
                        categories={categories}
                        onAdd={() =>
                            activeTab === "items"
                                ? setItemModal({ open: true, item: null })
                                : setCategoryModal({ open: true, item: null })
                        }
                    />

                    {loading ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-24 text-center shadow-sm">
                            <span className="material-symbols-outlined animate-spin text-4xl text-sky-500">
                                progress_activity
                            </span>
                            <p className="mt-3 text-sm font-bold text-slate-500">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : activeTab === "items" ? (
                        <ReliefItemTable
                            rows={filteredItems}
                            onEdit={(item) => setItemModal({ open: true, item })}
                            onToggle={(item) => toggleStatus("item", item)}
                        />
                    ) : (
                        <ReliefCategoryTable
                            rows={filteredCategories}
                            onEdit={(item) => setCategoryModal({ open: true, item })}
                            onToggle={(item) => toggleStatus("category", item)}
                        />
                    )}
                </main>

                <ReliefCategoryModal
                    open={categoryModal.open}
                    item={categoryModal.item}
                    saving={saving}
                    onClose={() => setCategoryModal({ open: false, item: null })}
                    onSubmit={saveCategory}
                />

                <ReliefItemModal
                    open={itemModal.open}
                    item={itemModal.item}
                    categories={categories.filter(
                        (category) => category.isActive || category.id === itemModal.item?.categoryId
                    )}
                    saving={saving}
                    onClose={() => setItemModal({ open: false, item: null })}
                    onSubmit={saveItem}
                />
            </div>
        </RoleGuard>
    );
}
