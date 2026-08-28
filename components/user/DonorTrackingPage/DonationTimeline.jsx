"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function DonationTimeline({ status }) {
    const { t } = useLanguage();

    const steps = [
        {
            key: "REGISTERED",
            title: t("donation.tracking.steps.registered.title"),
            description: t(
                "donation.tracking.steps.registered.description"
            ),
        },
        {
            key: "WAITING_DROPOFF",
            title: t("donation.tracking.steps.waiting.title"),
            description: t(
                "donation.tracking.steps.waiting.description"
            ),
        },
        {
            key: "RECEIVED",
            title: t("donation.tracking.steps.received.title"),
            description: t(
                "donation.tracking.steps.received.description"
            ),
        },
    ];

    const normalizedStatus = String(status || "")
        .trim()
        .toUpperCase();

    let currentStepIndex = 0;

    if (
        normalizedStatus === "RECEIVED" ||
        normalizedStatus === "COMPLETED" ||
        normalizedStatus === "SUCCESS"
    ) {
        currentStepIndex = 3;
    } else if (
        normalizedStatus === "PENDING" ||
        normalizedStatus === "ACCEPTED" ||
        normalizedStatus === "PROCESSING"
    ) {
        currentStepIndex = 1;
    }

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
                {t("donation.tracking.timelineTitle")}
            </h2>

            <div className="relative pl-2">
                {steps.map((step, index) => {
                    const isCompleted =
                        index < currentStepIndex;
                    const isCurrent =
                        index === currentStepIndex;
                    const isLast =
                        index === steps.length - 1;

                    return (
                        <div
                            key={step.key}
                            className="relative flex gap-4 pb-7 last:pb-0"
                        >
                            {!isLast && (
                                <span
                                    className={`absolute left-5 top-10 -ml-px h-full w-0.5 ${
                                        index < currentStepIndex
                                            ? "bg-emerald-500"
                                            : "bg-slate-200"
                                    }`}
                                    aria-hidden="true"
                                />
                            )}

                            <div className="relative z-10 flex-shrink-0">
                                {isCompleted ? (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                                        <span className="material-symbols-outlined text-xl font-bold">
                                            check
                                        </span>
                                    </div>
                                ) : isCurrent ? (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs ring-4 ring-amber-100 animate-pulse">
                                        <span className="material-symbols-outlined text-xl">
                                            sync
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                                        <span className="text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-center pt-0.5">
                                <p
                                    className={`text-sm font-bold ${
                                        isCurrent
                                            ? "text-amber-600"
                                            : isCompleted
                                              ? "text-emerald-700"
                                              : "text-slate-400"
                                    }`}
                                >
                                    {step.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
