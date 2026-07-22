"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import UserLayout from "@/components/layout/UserLayout";
import DonationQrCard from "@/components/user/DonorTrackingPage/DonationQrCard";
import DonationTimeline from "@/components/user/DonorTrackingPage/DonationTimeline";
import DonationCenterCard from "@/components/user/DonorTrackingPage/DonationCenterCard";
import DonationItemList from "@/components/user/DonorTrackingPage/DonationItemList";

import {
    getDonationById,
    getMyDonations,
} from "@/services/user/donation";

function DonorTrackingContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

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
                    // กรณีเข้าหน้านี้พร้อม Donation ID
                    donationData = await getDonationById(id);
                } else {
                    // กรณีเข้าจากหน้าเมนู ให้ดึงรายการของผู้ใช้
                    const response = await getMyDonations();

                    // รองรับทั้งกรณี Backend ส่ง Array ตรง ๆ
                    // และกรณีส่ง { donations: [...] }
                    const donations = Array.isArray(response)
                        ? response
                        : response?.donations || response?.data || [];

                    if (donations.length > 0) {
                        // เรียงรายการล่าสุดก่อน
                        const sortedDonations = [...donations].sort(
                            (a, b) =>
                                new Date(b.createdAt || 0) -
                                new Date(a.createdAt || 0)
                        );

                        const latestDonation = sortedDonations[0];

                        // โหลดรายละเอียดเต็มของรายการล่าสุด
                        donationData = await getDonationById(
                            latestDonation.id
                        );
                    }
                }

                if (isMounted) {
                    setDonation(donationData || null);
                }
            } catch (error) {
                console.error(
                    "Load donation tracking error:",
                    error
                );

                if (isMounted) {
                    setErrorMessage(
                        error?.message ||
                            "ไม่สามารถโหลดข้อมูลการติดตามบริจาคได้"
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
                        {errorMessage ||
                            "ไม่พบข้อมูลรายการบริจาค"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center px-4 py-8">
            <div className="w-full max-w-lg space-y-4">
                <DonationQrCard donation={donation} />

                <DonationTimeline
                    status={donation.status}
                />

                <DonationCenterCard
                    donation={donation}
                />

                <DonationItemList
                    items={donation.items || []}
                />
            </div>
        </div>
    );
}

export default function DonorTrackingPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
                    กำลังเตรียมข้อมูล...
                </div>
            }
        >
            <UserLayout
                homeHref="/user/donor-home"
                backHref="/user/donor-home"
                logoutHref="/user/users-login"
            >
                <DonorTrackingContent />
            </UserLayout>
        </Suspense>
    );
}