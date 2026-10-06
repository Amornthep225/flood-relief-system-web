"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import StaffMission from "@/components/staff/StaffMissionPage/StaffMission";

export default function MissionActivePage() {
    return (
        <StaffLayout
            backHref="/staff/staff-home"
            logoutHref="/staff/staff-login"
            showHome={false}
            showBack
        >
            <StaffMission />
        </StaffLayout>
    );
}
