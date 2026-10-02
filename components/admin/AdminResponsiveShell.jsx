"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminResponsiveShell({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [menuOpen]);

    return (
        <div className="min-h-[100dvh] bg-slate-50 lg:flex lg:h-[100dvh] lg:overflow-hidden">
            <div className="hidden h-full shrink-0 lg:block">
                <AdminSidebar />
            </div>

            <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur lg:hidden">
                <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
                    aria-label="เปิดเมนูผู้ดูแลระบบ"
                    aria-expanded={menuOpen}
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <div className="min-w-0 px-3 text-center">
                    <p className="truncate text-sm font-black text-slate-800">FLOOD RELIEF</p>
                    <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Admin Command Center
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white">
                    <span className="material-symbols-outlined">water_drop</span>
                </div>
            </div>

            {menuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true">
                    <button
                        type="button"
                        aria-label="ปิดเมนู"
                        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 z-10 max-w-[86vw] shadow-2xl">
                        <div className="absolute right-3 top-3 z-20">
                            <button
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
                                aria-label="ปิดเมนูผู้ดูแลระบบ"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <AdminSidebar mobile onNavigate={() => setMenuOpen(false)} />
                    </div>
                </div>
            )}

            <main className="min-w-0 flex-1 overflow-x-hidden lg:h-full lg:overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
