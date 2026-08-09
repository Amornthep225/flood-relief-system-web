"use client";

<<<<<<< Updated upstream
import StaffLayout from "@/components/layout/StaffLayout";
=======

import { colors } from "@/constants/colors";
<<<<<<< Updated upstream
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import StaffNavbar from "@/components/staff/staff-navbar";
=======
import StaffLayout from "@/components/layout/StaffLayout";
>>>>>>> Stashed changes
const theme = colors.staff;
>>>>>>> Stashed changes

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
