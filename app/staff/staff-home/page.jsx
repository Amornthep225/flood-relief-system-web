"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import StaffHomeHero from "@/components/staff/StaffHome/StaffHomeHero";
import StaffHomeMenu from "@/components/staff/StaffHome/StaffHomeMenu";

export default function StaffHomePage() {
    return (
        <StaffLayout
            homeHref="/staff/staff-home"
            backHref="/"
            logoutHref="/staff/staff-login"
            showHome={false}
            showBack={false}
        >
            <div className="space-y-8">
                <StaffHomeHero />
                <StaffHomeMenu />
            </div>
        </StaffLayout>
    );
}