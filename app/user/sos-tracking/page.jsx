"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

import UserLayout from "@/components/layout/UserLayout";
import SosTrackingCard from "@/components/user/SosTrackingPage/SosTrackingCard";

import {
    getMySosRequests,
    getSosRequestById,
} from "@/services/user/sos";

export default function SosTrackingPage() {
    const searchParams = useSearchParams();

    const requestId = searchParams.get("id");

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadRequest = async () => {
            try {
                setLoading(true);

                let requestData = null;

                /*
                 * กรณีมี id ใน URL
                 * เช่น /user/sos-tracking?id=0000000006
                 * ให้ดึงรายละเอียดคำขอนั้น
                 */
                if (requestId) {
                    requestData =
                        await getSosRequestById(
                            requestId
                        );
                } else {
                    /*
                     * กรณีไม่มี id
                     * เช่น /user/sos-tracking
                     * ให้ดึงคำขอทั้งหมดแล้วเลือกคำขอล่าสุด
                     */
                    const data =
                        await getMySosRequests();

                    if (
                        !Array.isArray(data) ||
                        data.length === 0
                    ) {
                        if (isMounted) {
                            setRequest(null);
                        }

                        return;
                    }

                    const sortedRequests = [
                        ...data,
                    ].sort(
                        (first, second) =>
                            new Date(
                                second.createdAt
                            ).getTime() -
                            new Date(
                                first.createdAt
                            ).getTime()
                    );

                    requestData =
                        sortedRequests[0];
                }

                if (isMounted) {
                    setRequest(requestData);
                }
            } catch (error) {
                console.error(
                    "โหลดข้อมูลคำขอไม่สำเร็จ:",
                    error
                );

                if (isMounted) {
                    setRequest(null);
                }

                await Swal.fire({
                    icon: "error",
                    title: "โหลดข้อมูลไม่สำเร็จ",
                    text:
                        error.message ||
                        "ไม่สามารถโหลดข้อมูลคำขอความช่วยเหลือได้",
                    confirmButtonText: "ตกลง",
                });
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadRequest();

        return () => {
            isMounted = false;
        };
    }, [requestId]);

    return (
        <UserLayout
            homeHref="/user/sos-home"
            backHref="/user/sos-home"
            logoutHref="/user/users-login"
        >
            {loading ? (
                <PageState
                    icon="progress_activity"
                    title="กำลังโหลดข้อมูล..."
                    description="กรุณารอสักครู่"
                    spinning
                />
            ) : !request ? (
                <PageState
                    icon="search_off"
                    title="ไม่พบคำขอความช่วยเหลือ"
                    description={
                        requestId
                            ? "ไม่พบคำขอที่คุณเลือก หรือคุณไม่มีสิทธิ์ดูคำขอนี้"
                            : "คุณยังไม่มีคำขอความช่วยเหลือในระบบ"
                    }
                />
            ) : (
                <SosTrackingCard
                    request={request}
                />
            )}
        </UserLayout>
    );
}

function PageState({
    icon,
    title,
    description,
    spinning = false,
}) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <span
                        className={`material-symbols-outlined text-3xl ${
                            spinning
                                ? "animate-spin"
                                : ""
                        }`}
                    >
                        {icon}
                    </span>
                </div>

                <h1 className="text-lg font-bold text-slate-700">
                    {title}
                </h1>

                <p className="text-sm text-slate-400 mt-1 max-w-sm">
                    {description}
                </p>
            </div>
        </div>
    );
}