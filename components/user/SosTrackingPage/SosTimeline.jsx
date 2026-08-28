"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { translateMasterDataText } from "@/locales/uiPhrases";

const RELIEF_STATUS_ORDER = {
    Pending: 0,
    Accepted: 1,
    Preparing: 2,
    Delivering: 3,
    Completed: 4,
};

const EMERGENCY_STATUS_ORDER = {
    Pending: 0,
    Accepted: 1,
    Preparing: 1,
    Delivering: 2,
    Completed: 3,
};

export default function SosTimeline({ request }) {
    const { t, language } = useLanguage();

    const status = request?.status;
    const isCancelled = status?.toLowerCase() === "cancelled";
    const isEmergency =
        String(request?.requestType || "Relief").trim().toLowerCase() ===
        "emergency";

    const statusOrder = isEmergency
        ? EMERGENCY_STATUS_ORDER
        : RELIEF_STATUS_ORDER;

    const currentStatusIndex = statusOrder[status] ?? 0;

    const steps = [
        {
            key: "Pending",
            title: t("sos.tracking.timeline.submittedTitle"),
            detail: t("sos.tracking.timeline.submittedDetail"),
            time: request?.createdAt,
            icon: "check_circle",
        },
        {
            key: "Accepted",
            title: t("sos.tracking.timeline.acceptedTitle"),
            detail: isEmergency
                ? t("sos.tracking.timeline.acceptedEmergencyDetail")
                : t("sos.tracking.timeline.acceptedReliefDetail"),
            time: request?.acceptedAt,
            icon: "support_agent",
        },
        ...(!isEmergency
            ? [
                  {
                      key: "Preparing",
                      title: t("sos.tracking.timeline.preparingTitle"),
                      detail: t("sos.tracking.timeline.preparingDetail"),
                      time: request?.preparingAt,
                      icon: "inventory_2",
                  },
              ]
            : []),
        {
            key: "Delivering",
            title: t("sos.tracking.timeline.deliveringTitle"),
            detail: isEmergency
                ? t("sos.tracking.timeline.deliveringEmergencyDetail")
                : t("sos.tracking.timeline.deliveringReliefDetail"),
            time: request?.deliveringAt,
            icon: "local_shipping",
        },
        {
            key: "Completed",
            title: t("sos.tracking.timeline.completedTitle"),
            detail: t("sos.tracking.timeline.completedDetail"),
            time: request?.completedAt,
            icon: "flag",
        },
    ];

    if (isCancelled) {
        return (
            <div className="space-y-6 w-full">
                <TimelineStep
                    title={t("sos.tracking.timeline.submittedTitle")}
                    detail={t("sos.tracking.timeline.submittedDetail")}
                    time={request?.createdAt}
                    icon="check_circle"
                    state="completed"
                    language={language}
                    waitingText={t("sos.tracking.timeline.waiting")}
                />
                <TimelineStep
                    title={t("sos.tracking.timeline.cancelledTitle")}
                    detail={
                        request?.staffRemark ||
                        t("sos.tracking.timeline.cancelledDetail")
                    }
                    time={request?.cancelledAt}
                    icon="cancel"
                    state="cancelled"
                    language={language}
                    waitingText={t("sos.tracking.timeline.waiting")}
                />
            </div>
        );
    }

    return (
        <div className="relative w-full rounded-3xl bg-sky-50 px-3 py-6 sm:px-6 md:px-8">
            <div className="absolute left-[20px] sm:left-[32px] md:left-[40px] top-12 bottom-12 w-1 -translate-x-1/2 rounded-full bg-sky-100" />

            <div className="relative space-y-7 w-full">
                {steps.map((step) => {
                    const stepIndex = statusOrder[step.key];
                    let state = "pending";

                    if (stepIndex < currentStatusIndex) {
                        state = "completed";
                    } else if (stepIndex === currentStatusIndex) {
                        state = status === "Completed" ? "completed" : "active";
                    }

                    return (
                        <TimelineStep
                            key={step.key}
                            title={step.title}
                            detail={step.detail}
                            time={step.time}
                            icon={step.icon}
                            state={state}
                            language={language}
                            waitingText={t("sos.tracking.timeline.waiting")}
                        >
                            {step.key === "Delivering" &&
                                state === "active" &&
                                request?.assignedStaffName && (
                                    <CurrentStaffInfo
                                        request={request}
                                        t={t}
                                        language={language}
                                    />
                                )}
                        </TimelineStep>
                    );
                })}
            </div>
        </div>
    );
}

function TimelineStep({
    title,
    detail,
    time,
    icon,
    state,
    children,
    language,
    waitingText,
}) {
    const styles = {
        completed: {
            circle: "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200",
            card: "bg-white border-green-200 ",
            title: "text-green-700",
        },
        active: {
            circle: "bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-300",
            card: "bg-white border-sky-300",
            title: "text-sky-700",
        },
        pending: {
            circle: "bg-white border-slate-200 text-slate-300",
            card: "bg-white border-slate-100",
            title: "text-slate-400",
        },
        cancelled: {
            circle: "bg-red-500 border-red-500 text-white",
            card: "bg-red-50 border-red-200",
            title: "text-red-600",
        },
    };

    const style = styles[state] || styles.pending;

    return (
        <div className="relative flex items-start gap-3 sm:gap-5 w-full">
            <div className="relative z-10 shrink-0">
                {state === "active" && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-sky-400 opacity-30" />
                )}

                <div
                    className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 transition-all ${style.circle}`}
                >
                    <span className="material-symbols-outlined text-2xl sm:text-3xl">
                        {icon}
                    </span>
                </div>
            </div>

            <div
                className={`flex-1 min-w-0 w-full rounded-3xl border p-5 sm:p-6 md:p-7 shadow-sm hover:shadow-md transition mb-4 ${style.card}`}
            >
                <h3 className={`text-base sm:text-lg font-bold ${style.title}`}>
                    {title}
                </h3>

                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400">
                    {time ? formatDateTime(time, language) : waitingText}
                </p>

                <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                    {detail}
                </p>

                {children}
            </div>
        </div>
    );
}

function CurrentStaffInfo({ request, t, language }) {
    const centerName = request?.centerName
        ? translateMasterDataText(request.centerName, language)
        : t("sos.tracking.assignedStaff");

    return (
        <div className="mt-5 flex items-center gap-3 sm:gap-4 rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-white text-sky-500">
                <span className="material-symbols-outlined text-xl sm:text-2xl">
                    person
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <p className="truncate font-bold text-slate-700 text-sm sm:text-base">
                    {request?.assignedStaffName}
                </p>
                <p className="truncate text-xs sm:text-sm text-slate-400">
                    {centerName}
                </p>
            </div>

            {request?.assignedStaffPhoneNumber && (
                <a
                    href={`tel:${request.assignedStaffPhoneNumber}`}
                    aria-label={t("sos.tracking.callStaffGeneric")}
                    className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg sm:text-xl">
                        call
                    </span>
                </a>
            )}
        </div>
    );
}

function formatDateTime(value, language) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString(language === "en" ? "en-US" : "th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
