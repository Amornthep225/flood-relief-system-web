"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function LocationPicker({
    location,
    onLocationChange,
}) {
    const [findingLocation, setFindingLocation] =
        useState(false);

    const hasLocation =
        location.latitude !== null &&
        location.longitude !== null;

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            Swal.fire({
                icon: "error",
                title: "ไม่รองรับตำแหน่ง",
                text: "เบราว์เซอร์นี้ไม่รองรับระบบ Geolocation",
            });

            return;
        }

        setFindingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onLocationChange((previous) => ({
                    ...previous,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));

                setFindingLocation(false);

                Swal.fire({
                    icon: "success",
                    title: "ปักหมุดสำเร็จ",
                    text: "บันทึกตำแหน่งปัจจุบันเรียบร้อยแล้ว",
                    timer: 1000,
                    showConfirmButton: false,
                });
            },
            (error) => {
                setFindingLocation(false);

                let message =
                    "ไม่สามารถค้นหาตำแหน่งปัจจุบันได้";

                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {
                    message =
                        "กรุณาอนุญาตให้เว็บไซต์เข้าถึงตำแหน่งของคุณ";
                }

                if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {
                    message =
                        "ไม่พบข้อมูลตำแหน่งจากอุปกรณ์";
                }

                if (error.code === error.TIMEOUT) {
                    message =
                        "ใช้เวลาในการค้นหาตำแหน่งนานเกินไป";
                }

                Swal.fire({
                    icon: "error",
                    title: "ปักหมุดไม่สำเร็จ",
                    text: message,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    return (
        <div className="space-y-4">
            <div className="relative h-72 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-blue-100">
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-white text-red-500 shadow-xl flex items-center justify-center mb-5">
                        <span className="material-symbols-outlined text-5xl">
                            location_on
                        </span>
                    </div>

                    {hasLocation ? (
                        <div className="rounded-xl bg-white/90 px-5 py-3 mb-5 shadow-sm text-sm text-slate-600">
                            <p>
                                Latitude:{" "}
                                {Number(
                                    location.latitude
                                ).toFixed(6)}
                            </p>

                            <p>
                                Longitude:{" "}
                                {Number(
                                    location.longitude
                                ).toFixed(6)}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 mb-5">
                            กรุณาปักหมุดตำแหน่งที่ต้องการรับความช่วยเหลือ
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={findingLocation}
                        className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">
                            my_location
                        </span>

                        {findingLocation
                            ? "กำลังค้นหาตำแหน่ง..."
                            : hasLocation
                              ? "ปักหมุดตำแหน่งใหม่"
                              : "ใช้ตำแหน่งปัจจุบัน"}
                    </button>
                </div>
            </div>

            <div>
                <label
                    htmlFor="addressDetail"
                    className="block text-sm font-bold text-slate-700 mb-2"
                >
                    รายละเอียดสถานที่
                </label>

                <textarea
                    id="addressDetail"
                    rows={4}
                    value={location.addressDetail}
                    onChange={(event) =>
                        onLocationChange((previous) => ({
                            ...previous,
                            addressDetail:
                                event.target.value,
                        }))
                    }
                    placeholder="เช่น บ้านเลขที่ 123 หมู่ 4 ซอย 5 ใกล้วัด หรือระบุจุดสังเกต"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
            </div>
        </div>
    );
}