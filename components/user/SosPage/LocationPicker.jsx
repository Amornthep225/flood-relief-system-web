"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function LocationPicker({
    location,
    onLocationChange,
}) {
    const [loadingLocation, setLoadingLocation] = useState(false);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            Swal.fire({
                icon: "error",
                title: "อุปกรณ์ไม่รองรับตำแหน่ง",
                text: "เบราว์เซอร์นี้ไม่รองรับ Geolocation",
            });

            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onLocationChange((previous) => ({
                    ...previous,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));

                setLoadingLocation(false);
            },
            (error) => {
                setLoadingLocation(false);

                let message = "ไม่สามารถดึงตำแหน่งได้";

                if (error.code === error.PERMISSION_DENIED) {
                    message =
                        "กรุณาอนุญาตให้เว็บไซต์เข้าถึงตำแหน่งของคุณ";
                }

                if (error.code === error.POSITION_UNAVAILABLE) {
                    message = "ไม่พบข้อมูลตำแหน่งของอุปกรณ์";
                }

                if (error.code === error.TIMEOUT) {
                    message = "ใช้เวลาในการค้นหาตำแหน่งนานเกินไป";
                }

                Swal.fire({
                    icon: "error",
                    title: "ไม่สามารถปักหมุดได้",
                    text: message,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const hasLocation =
        location.latitude !== null &&
        location.longitude !== null;

    return (
        <div className="space-y-4">
            <div className="relative min-h-72 rounded-3xl overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-200">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/10">
                    <span className="material-symbols-outlined text-6xl text-sky-500 drop-shadow-lg mb-4">
                        location_on
                    </span>

                    {hasLocation && (
                        <div className="mb-4 rounded-xl bg-white/90 px-4 py-2 text-center text-xs font-medium text-slate-600 shadow">
                            <p>
                                Latitude:{" "}
                                {location.latitude.toFixed(6)}
                            </p>

                            <p>
                                Longitude:{" "}
                                {location.longitude.toFixed(6)}
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={loadingLocation}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-3.5 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-sky-500">
                            my_location
                        </span>

                        {loadingLocation
                            ? "กำลังค้นหาตำแหน่ง..."
                            : hasLocation
                              ? "ปักหมุดใหม่"
                              : "ปักหมุดตำแหน่งปัจจุบัน"}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    รายละเอียดสถานที่จัดส่ง
                </label>

                <textarea
                    rows={3}
                    value={location.addressDetail}
                    onChange={(event) =>
                        onLocationChange((previous) => ({
                            ...previous,
                            addressDetail: event.target.value,
                        }))
                    }
                    placeholder="เช่น บ้านเลขที่ 123 หมู่ 4 ใกล้วัด หรือจุดสังเกตอื่น ๆ"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
            </div>
        </div>
    );
}