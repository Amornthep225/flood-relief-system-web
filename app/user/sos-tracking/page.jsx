"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

import UserLayout from "@/components/layout/UserLayout";
import SosTrackingCard from "@/components/user/SosTrackingPage/SosTrackingCard";
import { getMySosRequests, getSosRequestById } from "@/services/user/sos";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SosTrackingPage() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get("id");
    const { t } = useLanguage();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const loadRequest = async () => {
            try {
                setLoading(true);

                let requestData = null;

                if (requestId) {
                    requestData = await getSosRequestById(
                        requestId,
                        controller.signal
                    );
                } else {
                    const data = await getMySosRequests({}, controller.signal);

                    if (!Array.isArray(data) || data.length === 0) {
                        setRequest(null);
                        return;
                    }

                    const latestRequest = [...data].sort(
                        (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                    )[0];

                    requestData = await getSosRequestById(
                        latestRequest.id,
                        controller.signal
                    );
                }

                setRequest(requestData);
            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }

                console.error("Failed to load SOS request:", error);
                setRequest(null);

                await Swal.fire({
                    icon: "error",
                    title: t("sos.tracking.loadFailedTitle"),
                    text: error.message || t("sos.tracking.loadFailedText"),
                    confirmButtonText: t("sos.tracking.ok"),
                });
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadRequest();

        return () => {
            controller.abort();
        };
    }, [requestId, t]);

    return (
        <UserLayout
            homeHref="/user/sos-home"
            backHref="/user/sos-home"
            logoutHref="/user/users-login"
            pageClass="bg-mainColorUserPage"
            showHome={false}
        >
            {loading ? (
                <PageState
                    icon="progress_activity"
                    title={t("sos.tracking.loadingTitle")}
                    description={t("sos.tracking.loadingText")}
                    spinning
                />
            ) : !request ? (
                <PageState
                    icon="search_off"
                    title={t("sos.tracking.notFoundTitle")}
                    description={
                        requestId
                            ? t("sos.tracking.notFoundById")
                            : t("sos.tracking.noRequests")
                    }
                />
            ) : (
                <SosTrackingCard request={request} />
            )}
        </UserLayout>
    );
}

function PageState({ icon, title, description, spinning = false }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                    <span
                        className={`material-symbols-outlined text-3xl ${
                            spinning ? "animate-spin" : ""
                        }`}
                    >
                        {icon}
                    </span>
                </div>

                <h1 className="text-lg font-bold text-slate-700">{title}</h1>
                <p className="text-sm text-slate-400 mt-2">{description}</p>
            </div>
        </div>
    );
}
