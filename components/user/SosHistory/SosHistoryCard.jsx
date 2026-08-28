"use client";

import Link from "next/link";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateMasterDataText } from "@/locales/uiPhrases";

const STATUS_CONFIG = {
    pending: {
        key: "pending",
        icon: "schedule",
        sideColor: "bg-amber-400",
        iconColor: "bg-amber-50 text-amber-600",
        badgeColor: "bg-amber-100 text-amber-700",
    },
    accepted: {
        key: "accepted",
        icon: "support_agent",
        sideColor: "bg-sky-500",
        iconColor: "bg-sky-50 text-sky-600",
        badgeColor: "bg-sky-100 text-sky-700",
    },
    preparing: {
        key: "preparing",
        icon: "inventory_2",
        sideColor: "bg-violet-500",
        iconColor: "bg-violet-50 text-violet-600",
        badgeColor: "bg-violet-100 text-violet-700",
    },
    delivering: {
        key: "delivering",
        icon: "local_shipping",
        sideColor: "bg-orange-500",
        iconColor: "bg-orange-50 text-orange-600",
        badgeColor: "bg-orange-100 text-orange-700",
    },
    completed: {
        key: "completed",
        icon: "check_circle",
        sideColor: "bg-green-500",
        iconColor: "bg-green-50 text-green-600",
        badgeColor: "bg-green-100 text-green-700",
    },
    cancelled: {
        key: "cancelled",
        icon: "cancel",
        sideColor: "bg-red-500",
        iconColor: "bg-red-50 text-red-600",
        badgeColor: "bg-red-100 text-red-700",
    },
};

export default function SosHistoryCard({ request }) {
    const { t, language } = useLanguage();

    const normalizedStatus = String(request.status || "")
        .trim()
        .toLowerCase();

    const status = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.pending;
    const statusLabel = t(`sos.history.statuses.${status.key}`);

    const isCompleted = normalizedStatus === "completed";
    const isCancelled = normalizedStatus === "cancelled";

    const itemList = Array.isArray(request.items) ? request.items : [];

    const isEmergency =
        String(request.requestType || "Relief").trim().toLowerCase() ===
        "emergency";

    const title = isEmergency
        ? `SOS: ${formatEmergencyType(request.emergencyType, t)}`
        : createRequestTitle(itemList, t, language);

    return (
        <article className={cards.userSosHistory.card}>
            <div
                className={`absolute bottom-0 left-0 top-0 w-1.5 ${status.sideColor}`}
            />

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${status.iconColor}`}
                    >
                        <span className="material-symbols-outlined">
                            {status.icon}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-bold text-slate-800 md:text-lg">
                                {title}
                            </h2>

                            <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${status.badgeColor}`}
                            >
                                {statusLabel}
                            </span>
                        </div>

                        <p className="mb-2 text-sm text-slate-500">
                            {t("sos.history.idLabel")}
                            <span className="ml-1 font-mono font-bold text-slate-700">
                                #{request.id}
                            </span>

                            <span className="mx-2 text-slate-300">•</span>

                            {formatDateTime(request.createdAt, language)}
                        </p>

                        {request.addressDetail && (
                            <div className="mb-3 flex items-start gap-1.5 text-sm text-slate-500">
                                <span className="material-symbols-outlined mt-0.5 text-base text-red-400">
                                    location_on
                                </span>

                                <p
                                    data-i18n-ignore="true"
                                    className="line-clamp-2"
                                >
                                    {request.addressDetail}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {isEmergency && (
                                <>
                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                                        {t("sos.history.emergencyLabel")}
                                    </span>
                                    <span className={cards.userSosHistory.tag}>
                                        {t("sos.history.affectedPeople", {
                                            count: request.victimCount || 1,
                                        })}
                                    </span>
                                    {request.waterLevel != null && (
                                        <span
                                            className={cards.userSosHistory.tag}
                                        >
                                            {t("sos.history.waterLevel", {
                                                level: request.waterLevel,
                                            })}
                                        </span>
                                    )}
                                </>
                            )}

                            {!isEmergency &&
                                itemList.slice(0, 3).map((item) => (
                                    <span
                                        key={item.id || item.reliefItemId}
                                        className={cards.userSosHistory.tag}
                                    >
                                        {translateMasterDataText(
                                            item.reliefItemName ||
                                                t("sos.history.defaultItem"),
                                            language
                                        )}{" "}
                                        {item.quantity}{" "}
                                        {translateMasterDataText(
                                            item.unit || "",
                                            language
                                        )}
                                    </span>
                                ))}

                            {!isEmergency && itemList.length > 3 && (
                                <span className={cards.userSosHistory.tag}>
                                    {t("sos.history.moreItems", {
                                        count: itemList.length - 3,
                                    })}
                                </span>
                            )}

                            <span className={cards.userSosHistory.tag}>
                                {t("sos.history.priorityLabel", {
                                    priority: formatPriority(
                                        request.priority,
                                        t
                                    ),
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    <Link
                        href={`/user/sos-tracking?id=${request.id}`}
                        className={
                            isCompleted || isCancelled
                                ? buttons.userSosHistory.detail
                                : buttons.userSosHistory.tracking
                        }
                    >
                        <span className="material-symbols-outlined text-lg">
                            {isCompleted || isCancelled
                                ? "visibility"
                                : "location_on"}
                        </span>

                        {isCompleted || isCancelled
                            ? t("sos.history.viewDetails")
                            : t("sos.history.trackStatus")}
                    </Link>
                </div>
            </div>
        </article>
    );
}

function createRequestTitle(items, t, language) {
    if (!items.length) {
        return t("sos.history.defaultRequest");
    }

    const firstItem = items[0]?.reliefItemName;

    if (!firstItem) {
        return t("sos.history.defaultRequest");
    }

    const translatedItem = translateMasterDataText(firstItem, language);

    if (items.length === 1) {
        return t("sos.history.requestSingle", { item: translatedItem });
    }

    return t("sos.history.requestMultiple", { item: translatedItem });
}

function formatPriority(priority, t) {
    const value = String(priority || "").trim().toLowerCase();
    const allowed = ["normal", "urgent", "critical"];
    const key = allowed.includes(value) ? value : "normal";
    return t(`sos.history.priorities.${key}`);
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

function formatEmergencyType(type, t) {
    const key = `sos.success.emergencyTypes.${type || "default"}`;
    const translated = t(key);

    if (translated === key) {
        return t("sos.success.emergencyTypes.default");
    }

    return translated;
}
