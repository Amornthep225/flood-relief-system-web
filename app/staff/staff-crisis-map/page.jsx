"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import StaffCrisisMap from "@/components/staff/StaffCrisisMap/StaffCrisisMap";

export default function StaffCrisisMapPage() {
    return (
        <StaffLayout
            homeHref="/staff/staff-home"
            backHref="/staff/staff-home"
            logoutHref="/staff/staff-login"
            pageClass="bg-[#eef8ff]"
            contentClass="p-0 max-w-none w-full"
            showHome={false}
        >
            <StaffCrisisMap />
        </StaffLayout>
    );
}
