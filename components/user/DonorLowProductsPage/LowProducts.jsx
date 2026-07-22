"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getCenters,
    getLowStockItems,
} from "@/services/center/low-products-service";
import LowProductsFilters from "./LowProductsFilters";
import LowProductsSummary from "./LowProductsSummary";
import LowProductsList from "./LowProductsList";
import LowProductsSkeleton from "./LowProductsSkeleton";

export default function LowProducts() {
    const [centers, setCenters] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCenter, setSelectedCenter] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            try {
                setLoading(true);
                setError("");

                const [centersData, lowStockData] = await Promise.all([
                    getCenters(),
                    getLowStockItems(),
                ]);

                if (cancelled) return;

                setCenters(
                    Array.isArray(centersData)
                        ? centersData.filter((center) => center.isActive !== false)
                        : []
                );

                setProducts(
                    Array.isArray(lowStockData) ? lowStockData : []
                );
            } catch (loadError) {
                if (cancelled) return;

                setProducts([]);
                setError(
                    loadError?.message ||
                        "เกิดข้อผิดพลาดในการโหลดข้อมูล"
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((item) => {
            const matchesCenter =
                selectedCenter === "all" ||
                item.centerId === selectedCenter;

            const matchesStatus =
                selectedStatus === "all" ||
                item.stockStatus === selectedStatus;

            return matchesCenter && matchesStatus;
        });
    }, [products, selectedCenter, selectedStatus]);

    const summary = useMemo(() => {
        const totalMissing = filteredProducts.reduce(
            (sum, item) => {
                const quantity = Number(item.quantity ?? 0);
                const minimumQuantity = Number(
                    item.minimumQuantity ?? 0
                );

                return (
                    sum +
                    Math.max(minimumQuantity - quantity, 0)
                );
            },
            0
        );

        const outOfStockCount = filteredProducts.filter(
            (item) => item.stockStatus === "OutOfStock"
        ).length;

        return {
            totalItems: filteredProducts.length,
            totalMissing,
            outOfStockCount,
        };
    }, [filteredProducts]);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">
                    <span className="material-symbols-outlined text-orange-500">
                        inventory_2
                    </span>
                    สิ่งของที่ขาดแคลน
                </h1>

                <p className="mt-2 text-slate-500">
                    เลือกศูนย์รับบริจาคเพื่อดูรายการที่กำลังขาดแคลน
                </p>
            </header>

            <LowProductsSummary summary={summary} />

            <LowProductsFilters
                centers={centers}
                selectedCenter={selectedCenter}
                selectedStatus={selectedStatus}
                onCenterChange={setSelectedCenter}
                onStatusChange={setSelectedStatus}
            />

            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
                >
                    {error}
                </div>
            )}

            {loading ? (
                <LowProductsSkeleton />
            ) : (
                <LowProductsList products={filteredProducts} />
            )}
        </div>
    );
}