"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function getCaseVisual(caseItem) {
    const isEmergency =
        String(caseItem?.requestType || "").toLowerCase() === "emergency";
    const assigned = Boolean(caseItem?.assignedStaffId);

    if (isEmergency) {
        return {
            isEmergency: true,
            color: assigned ? "#2563eb" : "#dc2626",
            symbol: "!",
        };
    }

    return {
        isEmergency: false,
        color: assigned ? "#16a34a" : "#f59e0b",
        symbol: "◆",
    };
}

function createCaseIcon(caseItem) {
    const { color, symbol } = getCaseVisual(caseItem);
    const assigned = Boolean(caseItem?.assignedStaffId);
    const pulse = assigned
        ? ""
        : `<span style="position:absolute;inset:-8px;border-radius:9999px;border:3px solid ${color};opacity:.35;"></span>`;

    return L.divIcon({
        className: "custom-sos-marker",
        html: `<div style="width:38px;height:38px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 6px 18px rgba(15,23,42,.28);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;position:relative;">${symbol}${pulse}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -18],
    });
}

function FitMapToCases({ cases }) {
    const map = useMap();

    useEffect(() => {
        if (!cases.length) return;

        if (cases.length === 1) {
            map.setView([cases[0].latitude, cases[0].longitude], 14);
            return;
        }

        map.fitBounds(
            L.latLngBounds(cases.map((item) => [item.latitude, item.longitude])),
            { padding: [60, 60] }
        );
    }, [cases, map]);

    return null;
}

export default function CrisisMapCanvas({ cases, onSelectCase }) {
    const { ui, language } = useNativeUi();
    const validCases = useMemo(
        () =>
            cases.filter(
                (item) =>
                    Number.isFinite(item.latitude) &&
                    Number.isFinite(item.longitude) &&
                    item.latitude !== 0 &&
                    item.longitude !== 0
            ),
        [cases]
    );

    const center = validCases.length
        ? [validCases[0].latitude, validCases[0].longitude]
        : [13.7563, 100.5018];

    return (
        <div className="absolute inset-0">
            <MapContainer
                center={center}
                zoom={11}
                scrollWheelZoom
                className="h-full w-full"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitMapToCases cases={validCases} />

                {validCases.map((item) => {
                    const visual = getCaseVisual(item);

                    return (
                        <Marker
                            key={item.id}
                            position={[item.latitude, item.longitude]}
                            icon={createCaseIcon(item)}
                            eventHandlers={{ click: () => onSelectCase(item) }}
                        >
                            <Popup>
                                <div className="min-w-[220px]">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-bold">
                                            {visual.isEmergency ? "SOS" : ui("คำขอ")} #{item.id}
                                        </p>
                                        {visual.isEmergency ? (
                                            <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
                                                วิกฤต
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-sky-100 px-2 py-1 text-[10px] font-bold text-sky-700">
                                                ขอรับของ
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm">{item.address}</p>
                                    <button
                                        onClick={() => onSelectCase(item)}
                                        className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-bold text-white ${
                                            visual.isEmergency ? "bg-red-600" : "bg-sky-600"
                                        }`}
                                    >
                                        ดูรายละเอียด
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
