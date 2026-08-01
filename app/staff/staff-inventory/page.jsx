"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import StaffInventory from "@/components/staff/StaffInventoryPage/StaffInventory";

export default function StaffInventoryPage() {
    return (
        <StaffLayout
            homeHref="/staff/staff-home"
            backHref="/staff/staff-home"
            logoutHref="/staff/staff-login"
            pageClass="bg-[#eef8ff]"
            showHome={false}
        >
            <StaffInventory />
        </StaffLayout>
    );
}
