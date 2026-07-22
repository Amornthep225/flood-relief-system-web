"use client";

import { useEffect, useMemo, useState } from "react";

import DonationSummary from "./DonationSummary";
import DonationTabs from "./DonationTabs";
import DonationHistoryList from "./DonationHistoryList";
import DonationHistorySkeleton from "./DonationHistorySkeleton";

import { getMyDonations } from "@/services/user/donation";

const completedStatuses = [
    "completed",
    "received",
    "success",
];

function isCompleted(donation) {
    return completedStatuses.includes(
        String(donation.status || "")
            .trim()
            .toLowerCase()
    );
}

function normalizeDonations(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.donations)) return response.donations;
    if (Array.isArray(response?.data)) return response.data;

    return [];
}

export default function DonationHistory() {
    const [donations, setDonations] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadDonations() {
            try {
                const response = await getMyDonations();

                const data = normalizeDonations(response)
                    .filter((item) => item?.id)
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt || 0) -
                            new Date(a.createdAt || 0)
                    );

                setDonations(data);
            } catch (error) {
                setErrorMessage(
                    error?.message ||
                        "ไม่สามารถโหลดประวัติการบริจาคได้"
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadDonations();
    }, []);

    const counts = useMemo(() => {
        const completed = donations.filter(isCompleted).length;

        return {
            all: donations.length,
            processing: donations.length - completed,
            completed,
        };
    }, [donations]);

    const totalItems = useMemo(
        () =>
            donations.reduce(
                (total, donation) =>
                    total +
                    (donation.items || []).reduce(
                        (sum, item) =>
                            sum + Number(item.quantity || 0),
                        0
                    ),
                0
            ),
        [donations]
    );

    const filteredDonations = useMemo(() => {
        if (activeTab === "completed") {
            return donations.filter(isCompleted);
        }

        if (activeTab === "processing") {
            return donations.filter(
                (donation) => !isCompleted(donation)
            );
        }

        return donations;
    }, [activeTab, donations]);

    if (isLoading) {
        return <DonationHistorySkeleton />;
    }

    if (errorMessage) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
                {errorMessage}
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-8 pb-20">
            <h1 className="mb-6 text-2xl font-bold text-slate-800">
                ประวัติการบริจาคของคุณ
            </h1>

            <DonationSummary
                totalDonations={donations.length}
                totalItems={totalItems}
            />

            <div className="mb-8">
                <DonationTabs
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    counts={counts}
                />
            </div>

            <DonationHistoryList
                donations={filteredDonations}
            />
        </div>
    );
}