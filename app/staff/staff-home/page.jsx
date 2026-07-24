"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import StaffHomeHero from "@/components/staff/StaffHome/StaffHomeHero";
import StaffHomeMenu from "@/components/staff/StaffHome/StaffHomeMenu";

const menu = [
    {
        title: "รับของเข้าบริจาค",
        description: "กรอกรหัส Tracking ID เพื่อตรวจสอบรายการของบริจาค",
        icon: "fact_check",
        iconStyle: "bg-blue-50 text-blue-600",
        href: "/staff/staff-verify",
        action: "เริ่มทำรายการ",
    },
    {
        title: "แผนที่จุดวิกฤต",
        description: "แสดงพิกัดผู้ประสบภัยและสถานการณ์น้ำแบบ Live Map",
        icon: "map",
        iconStyle: "bg-indigo-50 text-indigo-600",
        href: "/staff/staff-crisis-map",
        action: "เปิดดูแผนที่สด",
    },
    {
        title: "ดูรายการสิ่งของในคลัง",
        description:
            "ตรวจสอบรายการสิ่งของบริจาคคงเหลือและทรัพยากรที่พร้อมใช้งาน",
        icon: "inventory_2",
        iconStyle: "bg-emerald-50 text-emerald-600",
        href: "/staff/staff-inventory",
        action: "ดูรายการทั้งหมด",
    },
];

export default function StaffHomePage() {
    return (
        <StaffLayout
            homeHref="/staff/staff-home"
            backHref="/"
            logoutHref="/staff/staff-login"
        >
            <div className="space-y-8">
                <StaffHomeHero />
                <StaffHomeMenu menu={menu} />
            </div>
        </StaffLayout>
    );
}