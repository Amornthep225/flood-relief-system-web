"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import DonationSearchForm from "./DonationSearchForm";
import DonationDetailCard from "./DonationDetailCard";
import QrScannerModal from "./QrScannerModal";
import {
    extractDonationId,
    getDonationForStaff,
    receiveDonation,
} from "@/services/staff/donation";

export default function StaffDonationVerify() {
    const router = useRouter();
    const [trackingId, setTrackingId] = useState("");
    const [donation, setDonation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReceiving, setIsReceiving] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const searchDonation = useCallback(
        async (value = trackingId) => {
            const donationId = extractDonationId(value);

            if (!donationId) {
                await Swal.fire({
                    icon: "warning",
                    title: "กรุณาระบุรหัสบริจาค",
                    text: "กรอกรหัส Tracking ID หรือสแกน QR Code ก่อนค้นหา",
                });
                return;
            }

            try {
                setIsLoading(true);
                setDonation(null);
                setTrackingId(donationId);

                const response = await getDonationForStaff(donationId);
                setDonation(response);
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "ไม่พบข้อมูลบริจาค",
                    text: error.message || "ไม่สามารถค้นหาข้อมูลบริจาคได้",
                });
            } finally {
                setIsLoading(false);
            }
        },
        [trackingId]
    );

    const handleQrDetected = useCallback(
        async (rawValue) => {
            setShowScanner(false);
            const donationId = extractDonationId(rawValue);
            setTrackingId(donationId);
            await searchDonation(donationId);
        },
        [searchDonation]
    );

    const handleReceive = async () => {
        if (!donation?.id || isReceiving) {
            return;
        }

        const result = await Swal.fire({
            icon: "question",
            title: "ยืนยันรับของเข้าคลัง?",
            html: `ระบบจะเพิ่มสิ่งของจากรหัส <b>${donation.id}</b> เข้าคลังของศูนย์ และไม่สามารถรับซ้ำได้`,
            showCancelButton: true,
            confirmButtonText: "ยืนยันรับเข้าคลัง",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#10b981",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setIsReceiving(true);
            const response = await receiveDonation(donation.id);

            setDonation((current) => ({
                ...current,
                status: response?.data?.status || response?.status || "Received",
                canReceive: false,
            }));

            await Swal.fire({
                icon: "success",
                title: "รับของเข้าคลังสำเร็จ",
                text: response.message || "อัปเดตคลังและสถานะบริจาคเรียบร้อยแล้ว",
                timer: 1600,
                showConfirmButton: false,
            });

            const params = new URLSearchParams({
                id: donation.id,
                donor: donation.userFullName || "",
                count: String(donation.items?.length || 0),
            });

            router.push(`/staff/staff-verify-success?${params.toString()}`);
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "รับของเข้าคลังไม่สำเร็จ",
                text: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
            });
        } finally {
            setIsReceiving(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <header className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                    <span className="material-symbols-outlined text-4xl">
                        qr_code_scanner
                    </span>
                </div>
                <h1 className="text-3xl font-black text-slate-800">
                    ตรวจรับของบริจาค
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    ค้นหาด้วยรหัสบริจาค หรือสแกน QR Code จากผู้บริจาค
                </p>
            </header>

            <DonationSearchForm
                trackingId={trackingId}
                onTrackingIdChange={setTrackingId}
                onSearch={() => searchDonation()}
                onOpenScanner={() => setShowScanner(true)}
                isLoading={isLoading}
            />

            {donation && (
                <DonationDetailCard
                    donation={donation}
                    onReceive={handleReceive}
                    isReceiving={isReceiving}
                />
            )}

            {showScanner && (
                <QrScannerModal
                    onClose={() => setShowScanner(false)}
                    onDetected={handleQrDetected}
                />
            )}
        </div>
    );
}
