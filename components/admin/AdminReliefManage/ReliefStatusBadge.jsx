"use client";

import { useNativeUi } from "@/hooks/useNativeUi";


export default function ReliefStatusBadge({isActive}){
    const { ui } = useNativeUi();
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${isActive?"bg-emerald-100 text-emerald-700":"bg-slate-100 text-slate-500"}`}>
    {isActive ? ui("เปิดใช้งาน") : ui("ปิดใช้งาน")}
  </span>;
}
