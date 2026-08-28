"use client";

import SosTimeline from "./SosTimeline";
import AssignedStaffCard from "./AssignedStaffCard";
import TrackingMapSection from "./TrackingMapSection";
import TrackingActions from "./TrackingActions";
import SosRequestItems from "./SosRequestItems";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SosTrackingCard({ request }) {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen w-full py-8 px-4 sm:px-6 bg-sosTrickingPage">
            <div className="w-full max-w-5xl mx-auto rounded-3xl shadow-xl borde overflow-hidden bg-sky-200">
                <TrackingHeader requestId={request.id} t={t} />

                <div className="p-6 md:p-8 space-y-8">
                    {String(request.requestType || "Relief").toLowerCase() ===
                    "emergency" ? (
                        <EmergencySummary request={request} t={t} />
                    ) : (
                        <SosRequestItems items={request.items} />
                    )}

                    <SosTimeline request={request} />

                    <AssignedStaffCard
                        staffName={request.assignedStaffName}
                        phoneNumber={request.assignedStaffPhoneNumber}
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

function TrackingHeader({ requestId, t }) {
    return (
        <div className="p-7 md:p-8 text-center border-b border-blue-500 bg-sky-200">
            <h1 className="text-2xl font-bold text-slate-800">
                {t("sos.tracking.headerTitle")}
            </h1>

            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm mt-3">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                    {t("sos.tracking.caseId")}
                </span>
                <span className="text-sm font-mono font-bold text-sky-600">
                    #{requestId}
                </span>
            </div>
        </div>
    );
}

function EmergencySummary({ request, t }) {
    const typeKey = request.emergencyType || "Other";
    const emergencyKey = `sos.success.emergencyTypes.${typeKey}`;
    const translatedType = t(emergencyKey);
    const typeLabel =
        translatedType === emergencyKey
            ? t("sos.tracking.emergencyDefault")
            : translatedType;

    return (
        <section className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <span className="material-symbols-outlined">sos</span>
                </div>
                <div>
                    <p className="text-xs font-bold text-red-500">
                        {t("sos.tracking.emergencyLabel")}
                    </p>
                    <h2 className="font-black text-slate-800">{typeLabel}</h2>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <EmergencyStat
                    label={t("sos.tracking.affectedPeople")}
                    value={`${request.victimCount || 1} ${t(
                        "sos.tracking.personUnit"
                    )}`}
                />
                <EmergencyStat
                    label={t("sos.tracking.children")}
                    value={`${request.childCount || 0} ${t(
                        "sos.tracking.personUnit"
                    )}`}
                />
                <EmergencyStat
                    label={t("sos.tracking.elderly")}
                    value={`${request.elderlyCount || 0} ${t(
                        "sos.tracking.personUnit"
                    )}`}
                />
                <EmergencyStat
                    label={t("sos.tracking.patientDisabled")}
                    value={`${(request.patientCount || 0) +
                        (request.disabledCount || 0)} ${t(
                        "sos.tracking.personUnit"
                    )}`}
                />
            </div>

            {request.waterLevel != null && (
                <p className="mt-4 text-sm font-bold text-slate-600">
                    {t("sos.tracking.waterLevel", {
                        level: request.waterLevel,
                    })}
                </p>
            )}

            {request.emergencyDetail && (
                <div
                    data-i18n-ignore="true"
                    className="mt-4 rounded-xl bg-red-50 p-4 text-sm leading-relaxed text-slate-700"
                >
                    {request.emergencyDetail}
                </div>
            )}
        </section>
    );
}

function EmergencyStat({ label, value }) {
    return (
        <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-400">{label}</p>
            <p className="mt-1 font-black text-slate-800">{value}</p>
        </div>
    );
}
