"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LocationPicker({
    location,
    onLocationChange,
}) {
    const { t } = useLanguage();
    const [findingLocation, setFindingLocation] =
        useState(false);

    const hasLocation =
        location.latitude !== null &&
        location.longitude !== null;

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            Swal.fire({
                icon: "error",
                title: t("sos.location.unsupportedTitle"),
                text: t("sos.location.unsupportedText"),
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
                    title: t("sos.location.successTitle"),
                    text: t("sos.location.successText"),
                    timer: 1000,
                    showConfirmButton: false,
                });
            },
            (error) => {
                setFindingLocation(false);

                let message =
                    t("sos.location.failDefault");

                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {
                    message =
                        t("sos.location.permissionDenied");
                }

                if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {
                    message =
                        t("sos.location.unavailable");
                }

                if (error.code === error.TIMEOUT) {
                    message =
                        t("sos.location.timeout");
                }

                Swal.fire({
                    icon: "error",
                    title: t("sos.location.failTitle"),
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
                            {t("sos.location.prompt")}
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
                            ? t("sos.location.finding")
                            : hasLocation
                              ? t("sos.location.repin")
                              : t("sos.location.useCurrent")}
                    </button>
                </div>
            </div>

            <div>
                <label
                    htmlFor="addressDetail"
                    className="block text-sm font-bold text-slate-700 mb-2"
                >
                    {t("sos.location.addressLabel")}
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
                    placeholder={t("sos.location.addressPlaceholder")}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
            </div>
        </div>
    );
}