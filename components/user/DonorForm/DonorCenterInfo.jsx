"use client";

import { useEffect, useState } from "react";
import { getCenters } from "@/services/center/center";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    translateMasterDataText,
    translateUiText,
} from "@/locales/uiPhrases";

export default function DonorCenterInfo() {
    const { language, t } = useLanguage();

    const [center, setCenter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCenter() {
            try {
                setIsLoading(true);

                const data = await getCenters();

                const activeCenter =
                    Array.isArray(data)
                        ? data.find(
                              (item) =>
                                  item.isActive !== false
                          )
                        : null;

                setCenter(activeCenter || null);
            } catch (error) {
                console.error(
                    "Load center error:",
                    error
                );

                alert(
                    translateUiText(
                        error?.message || "",
                        language
                    ) ||
                        "ไม่สามารถโหลดข้อมูลศูนย์ได้"
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadCenter();
    }, [language]);

    if (isLoading) {
        return (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
            </div>
        );
    }

    if (!center) {
        return (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-center text-sm text-slate-400">
                    ไม่พบข้อมูลจุดรับบริจาค
                </p>
            </div>
        );
    }

    const centerName =
        translateMasterDataText(
            center.centerName || "",
            language
        );

    const hasCoordinates =
        center.latitude !== null &&
        center.latitude !== undefined &&
        center.longitude !== null &&
        center.longitude !== undefined;

    const mapQuery = hasCoordinates
        ? `${center.latitude},${center.longitude}`
        : center.address || centerName;

    const mapUrl =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            mapQuery
        )}`;

    return (
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined">
                        location_on
                    </span>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {language === "en"
                            ? "Donation Drop-off Point"
                            : "จุดรับบริจาค"}
                    </h2>

                    <p className="text-sm text-slate-500">
                        {language === "en"
                            ? "Please bring your donation to this center."
                            : "กรุณานำสิ่งของบริจาคมาส่งที่ศูนย์นี้"}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-bold text-slate-800">
                    {centerName}
                </h3>

                {center.address && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                        <span className="material-symbols-outlined text-lg text-slate-400">
                            pin_drop
                        </span>

                        <span>
                            {center.address}
                        </span>
                    </div>
                )}

                {center.phoneNumber && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                        <span className="material-symbols-outlined text-lg text-slate-400">
                            call
                        </span>

                        <a
                            href={`tel:${center.phoneNumber}`}
                            className="hover:text-blue-600"
                        >
                            {center.phoneNumber}
                        </a>
                    </div>
                )}

                <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.99]"
                >
                    <span className="material-symbols-outlined text-lg">
                        map
                    </span>

                    {language === "en"
                        ? "View on Google Maps"
                        : "ดูตำแหน่งบนแผนที่"}
                </a>
            </div>
        </div>
    );
}