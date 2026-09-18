"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import StaffSos from "@/components/staff/StaffSosPage/StaffSos";

export default function StaffReliefRequestsPage() {
    return (
        <StaffLayout
            homeHref="/staff/staff-home"
            backHref="/staff/staff-home"
            logoutHref="/staff/staff-login"
            showHome={false}
        >
            <StaffSos requestType="relief" />
        </StaffLayout>
    );
}
