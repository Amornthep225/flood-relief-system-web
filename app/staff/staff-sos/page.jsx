"use client";


import StaffLayout from "@/components/layout/StaffLayout";


import StaffSos from "@/components/staff/StaffSosPage/StaffSos";

export default function StaffSosPage() {
    return (
        <StaffLayout
            homeHref="/staff/staff-home"
            backHref="/staff/staff-home"
            logoutHref="/staff/staff-login"
            showHome={false}
        >
            <StaffSos />
        </StaffLayout>
    );
}
