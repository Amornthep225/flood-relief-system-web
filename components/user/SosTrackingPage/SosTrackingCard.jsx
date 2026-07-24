import SosTimeline from "./SosTimeline";
import AssignedStaffCard from "./AssignedStaffCard";
import TrackingMapSection from "./TrackingMapSection";
import TrackingActions from "./TrackingActions";
import SosRequestItems from "./SosRequestItems";

export default function SosTrackingCard({ request }) {
    return (
        <div className="min-h-screen w-full py-8 px-4 sm:px-6 bg-sosTrickingPage">
            <div className="w-full max-w-5xl mx-auto rounded-3xl shadow-xl borde overflow-hidden bg-sky-200">
                <TrackingHeader requestId={request.id} />

                <div className="p-6 md:p-8 space-y-8">
                    {/* รายการของที่ร้องขอ */}
                    <SosRequestItems items={request.items} />

                    {/* Timeline */}
                    <SosTimeline request={request} />

                    {/* เจ้าหน้าที่ */}
                    <AssignedStaffCard
                        staffName={request.assignedStaffName}
                        phoneNumber={request.assignedStaffPhoneNumber}
                        centerName={request.centerName}
                    />

                    {/* แผนที่ */}
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
        <div className="p-7 md:p-8 text-center border-b border-blue-500 bg-sky-200">
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