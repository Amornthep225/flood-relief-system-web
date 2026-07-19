import SosMap from "@/components/map/SosMap";

export default function TrackingMapSection({
    latitude,
    longitude,
    addressDetail,
}) {
    return (
        <section className="mt-8">
            <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-500 text-xl">
                    map
                </span>

                ตำแหน่งและผู้กู้ภัย (Live Map)
            </h2>

            <SosMap
                latitude={latitude}
                longitude={longitude}
            />

            {addressDetail && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <span className="material-symbols-outlined text-red-500 text-xl shrink-0">
                        location_on
                    </span>

                    <div>
                        <p className="text-xs text-slate-400">
                            ตำแหน่งรับความช่วยเหลือ
                        </p>

                        <p className="text-sm font-medium text-slate-700 mt-0.5">
                            {addressDetail}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}