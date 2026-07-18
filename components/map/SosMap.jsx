"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

if (typeof window !== "undefined") {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
}

export default function SosMap({ latitude, longitude }) {
    if (!latitude || !longitude) {
        return (
            <div className="h-48 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-medium text-sm">
                ไม่พบตำแหน่งพิกัด
            </div>
        );
    }

    return (
        <div className="h-64 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative z-0">
            <MapContainer
                center={[Number(latitude), Number(longitude)]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[Number(latitude), Number(longitude)]}>
                    <Popup>
                        <div className="text-xs font-sans text-slate-700">
                            <p className="font-bold text-slate-800 mb-1">ตำแหน่งรับความช่วยเหลือ</p>
                            <p className="m-0">Lat: {Number(latitude).toFixed(6)}</p>
                            <p className="m-0">Lng: {Number(longitude).toFixed(6)}</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}