import SosTimeline from "./SosTimeline";
import AssignedStaffCard from "./AssignedStaffCard";
import TrackingMapSection from "./TrackingMapSection";
import TrackingActions from "./TrackingActions";

export default function SosTrackingCard({ request }) {
    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <TrackingHeader requestId={request.id} />

                <div className="p-6 md:p-8">
                    <SosTimeline request={request} />

                    <AssignedStaffCard
                        staffName={request.assignedStaffName}
                        phoneNumber={
                            request.assignedStaffPhoneNumber
                        }
                        centerName={request.centerName}
                    />

                    <TrackingMapSection
                        latitude={request.latitude}
                        longitude={request.longitude}
                        addressDetail={request.addressDetail}
                    />
                </div>

                <TrackingActions />
            </div>
        </div>
    );
}

function TrackingHeader({ requestId }) {
    return (
        <div className="p-7 md:p-8 text-center border-b border-slate-100 bg-slate-50/60">
            <h1 className="text-2xl font-bold text-slate-800">
                สถานะความช่วยเหลือ
            </h1>

            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm mt-3">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                    CASE ID:
                </span>

                <span className="text-sm font-mono font-bold text-sky-600">
                    #{requestId}
                </span>
            </div>
        </div>
    );
}