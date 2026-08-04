"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function priorityColor(priority) {
    const value = String(priority || "").trim().toLowerCase();
    if (value === "critical") return "#dc2626";
    if (value === "urgent") return "#f97316";
    return "#0284c7";
}

function createCaseIcon(priority, assigned) {
    const color = assigned ? "#2563eb" : priorityColor(priority);
    return L.divIcon({
        className: "custom-sos-marker",
        html: `<div style="width:38px;height:38px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 6px 18px rgba(15,23,42,.28);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;position:relative;">!${String(priority).toLowerCase() === "critical" ? `<span style="position:absolute;inset:-8px;border-radius:9999px;border:3px solid ${color};opacity:.35;"></span>` : ""}</div>`,
        iconSize: [38,38], iconAnchor: [19,19], popupAnchor: [0,-18],
    });
}

function FitMapToCases({ cases }) {
    const map = useMap();
    useEffect(() => {
        if (!cases.length) return;
        if (cases.length === 1) { map.setView([cases[0].latitude, cases[0].longitude], 14); return; }
        map.fitBounds(L.latLngBounds(cases.map(x => [x.latitude, x.longitude])), { padding: [60,60] });
    }, [cases, map]);
    return null;
}

export default function CrisisMapCanvas({ cases, onSelectCase }) {
    const validCases = useMemo(() => cases.filter(x => Number.isFinite(x.latitude) && Number.isFinite(x.longitude) && x.latitude !== 0 && x.longitude !== 0), [cases]);
    const center = validCases.length ? [validCases[0].latitude, validCases[0].longitude] : [13.7563, 100.5018];
    return (
        <div className="absolute inset-0">
            <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full">
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitMapToCases cases={validCases} />
                {validCases.map(item => (
                    <Marker key={item.id} position={[item.latitude,item.longitude]} icon={createCaseIcon(item.priority, Boolean(item.assignedStaffId))} eventHandlers={{ click: () => onSelectCase(item) }}>
                        <Popup><div className="min-w-[220px]"><p className="font-bold">SOS #{item.id}</p><p className="mt-1 text-sm">{item.address}</p><button onClick={() => onSelectCase(item)} className="mt-3 w-full rounded-lg bg-sky-600 px-3 py-2 text-sm font-bold text-white">ดูรายละเอียด</button></div></Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
