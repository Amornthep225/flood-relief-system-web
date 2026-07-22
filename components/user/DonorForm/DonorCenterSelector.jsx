"use client";

import { useEffect, useState } from "react";
import { getCenters } from "@/services/center/center";

export default function DonorCenterSelector({ selectedCenter, onSelect }) {
    const [centers, setCenters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCenters() {
            try {
                setIsLoading(true);
                const data = await getCenters();
                setCenters(data || []);
            } catch (error) {
                alert(
                    error.message || "ไม่สามารถโหลดข้อมูลศูนย์รับบริจาคได้"
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadCenters();
    }, []);

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                    จุดรับบริจาคส่วนกลาง
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    เลือกศูนย์ที่ต้องการนำสิ่งของไปบริจาค
                </p>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    /* Loading State Skeleton */
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-28 w-full animate-pulse rounded-2xl bg-slate-100"
                            />
                        ))}
                    </div>
                ) : centers.length > 0 ? (
                    /* Center List */
                    centers.map((center) => {
                        const isSelected = selectedCenter === center.id;

                        return (
                            <button
                                key={center.id}
                                type="button"
                                onClick={() => onSelect(center.id)}
                                className={`w-full rounded-2xl border p-4 text-left transition-all ${isSelected
                                        ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm"
                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-slate-800">
                                            {center.centerName}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-snug">
                                            {center.address}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            📞 โทร {center.phoneNumber}
                                        </p>
                                    </div>

                                    <span
                                        className={`material-symbols-outlined text-2xl transition-colors ${isSelected ? "text-blue-600" : "text-slate-300"
                                            }`}
                                    >
                                        {isSelected ? "check_circle" : "location_on"}
                                    </span>
                                </div>

                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${center.latitude},${center.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-xl border border-slate-200 bg-white py-2 text-center text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 active:scale-[0.99] transition-all shadow-xs"
                                >
                                    <span className="material-symbols-outlined text-base">
                                        map
                                    </span>
                                    เปิดแผนที่นำทาง
                                </a>
                            </button>
                        );
                    })
                ) : (
                    /* Empty State */
                    <div className="py-8 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                        ไม่พบข้อมูลจุดรับบริจาค
                    </div>
                )}
            </div>
        </div>
    );
}