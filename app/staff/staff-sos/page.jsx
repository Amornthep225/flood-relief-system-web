"use client";

import { useState } from "react";
import Link from "next/link";
import { colors } from "@/constants/colors";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import StaffNavbar from "@/components/staff/StaffNavbar/staff-navbar";
const theme = colors.staff;

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
