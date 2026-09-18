"use client";

import { useNativeUi } from "@/hooks/useNativeUi";

export default function AdminCentersHeader() {
    const { ui } = useNativeUi();
    return (
        <header className="border-b border-slate-200 bg-white px-4 py-5 md:px-8">
            <h1 className="text-xl font-bold text-slate-800">{ui("จัดการข้อมูลศูนย์")}</h1>
            <p className="mt-1 text-sm text-slate-500">{ui("แก้ไขข้อมูล ที่อยู่ ผู้ประสานงาน และสถานะการเปิดใช้งานศูนย์")}</p>
        </header>
    );
}
