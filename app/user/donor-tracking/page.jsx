"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import UserLayout from "@/components/layout/UserLayout";
import DonationQrCard from "@/components/user/DonorTrackingPage/DonationQrCard";
import DonationTimeline from "@/components/user/DonorTrackingPage/DonationTimeline";
import DonationCenterCard from "@/components/user/DonorTrackingPage/DonationCenterCard";
import DonationItemList from "@/components/user/DonorTrackingPage/DonationItemList";
import { getDonationById, getMyDonations } from "@/services/user/donation";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateUiText } from "@/locales/uiPhrases";

function DonorTrackingContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { language, t } = useLanguage();

    const [donation, setDonation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadDonation() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                setDonation(null);

                let donationData = null;

                if (id) {
                    donationData = await getDonationById(id);
                } else {
                    const response = await getMyDonations();
                    const donations = Array.isArray(response)
                        ? response
                        : response?.donations || response?.data || [];

                    if (donations.length > 0) {
                        const sortedDonations = [...donations].sort(
                            (a, b) =>
                                new Date(b.createdAt || 0) -
                                new Date(a.createdAt || 0)
                        );

                        donationData = await getDonationById(
                            sortedDonations[0].id
                        );
                    }
                }

                if (isMounted) {
                    setDonation(donationData || null);
                }
            } catch (error) {
                console.error("Load donation tracking error:", error);

                if (isMounted) {
                    setErrorMessage(
                        translateUiText(error?.message || "", language) ||
                        t("donation.tracking.loadError")
                    );
                    setDonation(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadDonation();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center px-4 py-8">
                <div className="w-full max-w-lg animate-pulse space-y-4">
                    <div className="h-48 rounded-3xl bg-slate-200" />
                    <div className="h-32 rounded-3xl bg-slate-200" />
                    <div className="h-48 rounded-3xl bg-slate-200" />
                </div>
            </div>
        );
    }

    if (!donation) {
        return (
            <div className="flex justify-center p-10 text-center">
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-500">
                    <p className="text-sm font-medium">
                        {errorMessage || t("donation.tracking.notFound")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center px-4 py-8">
            <div className="w-full max-w-lg space-y-4">
                <DonationQrCard donation={donation} />
                <DonationTimeline status={donation.status} />
                <DonationCenterCard donation={donation} />
                <DonationItemList items={donation.items || []} />
            </div>
        </div>
    );
}

function TrackingFallback() {
    const { t } = useLanguage();

    return (
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
            {t("donation.tracking.preparing")}
        </div>
    );
}

export default function DonorTrackingPage() {
    return (
        <Suspense fallback={<TrackingFallback />}>
            <UserLayout
                homeHref="/user/donor-home"
                backHref="/user/donor-home"
                logoutHref="/user/users-login"
                showHome={false}
            >
                <DonorTrackingContent />
            </UserLayout>
        </Suspense>
    );
}
