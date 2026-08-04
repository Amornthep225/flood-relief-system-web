"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";
import Link from "next/link";
import {
    usePathname,
    useRouter,
} from "next/navigation";
import Swal from "sweetalert2";

import { cards } from "@/constants/cards";
import { getAllSosRequests } from "@/services/admin/sos";

const menuGroups = [
    {
        title: "ภาพรวม",
        items: [
            {
                title: "ภาพรวมระบบ",
                icon: "dashboard",
                href: "/admin/admin-dashboard",
            },
        ],
    },
    {
        title: "จัดการข้อมูล",
        items: [
            {
                title: "ผู้ประสบภัย (SOS)",
                icon: "warning",
                href: "/admin/admin-sos",
                badgeKey: "pendingSos",
            },
            {
                title: "ผู้ใช้ (Users)",
                icon: "groups",
                href: "/admin/admin-users",
            },
            {
                title: "เจ้าหน้าที่ (Staff)",
                icon:
                    "admin_panel_settings",
                href: "/admin/admin-staff",
            },
            {
                title:
                    "จัดการศูนย์ (Centers)",
                icon: "apartment",
                href: "/admin/admin-centers",
            },
        ],
    },
    {
        title: "",
        items: [
            {
                title: "จัดการชื่อสิ่งของและประเภท", 
                icon: "inventory_2",
                href: "/admin/admin-item-manage",
            },
        ],
    },
    // {
    //     title: "รายงาน",
    //     items: [
    //         {
    //             title: "พิมพ์รายงาน",
    //             icon: "description",
    //             href: "/admin/admin-report",
    //         },
    //     ],
    // },
];

function normalizeArray(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (
        Array.isArray(
            response?.requests
        )
    ) {
        return response.requests;
    }

    return [];
}

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const [
        pendingSosCount,
        setPendingSosCount,
    ] = useState(0);

    useEffect(() => {
        const controller =
            new AbortController();

        const loadSosCount =
            async () => {
                try {
                    const response =
                        await getAllSosRequests(
                            controller.signal
                        );

                    const requests =
                        normalizeArray(
                            response
                        );

                    const count =
                        requests.filter(
                            (item) =>
                                String(
                                    item.status ||
                                        ""
                                )
                                    .trim()
                                    .toLowerCase() ===
                                "pending"
                        ).length;

                    setPendingSosCount(
                        count
                    );
                } catch (error) {
                    if (
                        error?.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "โหลดจำนวน SOS ไม่สำเร็จ:",
                        error
                    );

                    setPendingSosCount(
                        0
                    );
                }
            };

        loadSosCount();

        return () => {
            controller.abort();
        };
    }, [pathname]);

    const menuBadges = useMemo(
        () => ({
            pendingSos:
                pendingSosCount,
        }),
        [pendingSosCount]
    );

    const handleLogout = async () => {
        const result =
            await Swal.fire({
                title: "ออกจากระบบ?",
                text:
                    "คุณต้องการออกจากระบบใช่หรือไม่",
                icon: "question",
                showCancelButton: true,
                confirmButtonText:
                    "ออกจากระบบ",
                cancelButtonText:
                    "ยกเลิก",
                confirmButtonColor:
                    "#0284c7",
                cancelButtonColor:
                    "#64748b",
            });

        if (!result.isConfirmed) {
            return;
        }

        localStorage.removeItem(
            "token"
        );
        localStorage.removeItem(
            "admin"
        );

        await Swal.fire({
            icon: "success",
            title:
                "ออกจากระบบสำเร็จ",
            timer: 800,
            showConfirmButton: false,
        });

        router.replace(
            "/admin-login"
        );
    };

    return (
        <aside
            className={
                cards.adminLayout
                    .sidebar
            }
        >
            <div className="flex items-center gap-3 p-6">
                <div className="flex items-center justify-center rounded-lg bg-sky-500 p-2 shadow-lg shadow-sky-500/30">
                    <span className="material-symbols-outlined text-xl text-white">
                        water_drop
                    </span>
                </div>

                <div>
                    <h1 className="text-lg font-bold leading-none text-slate-800">
                        FLOOD RELIEF
                    </h1>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Command Center
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
                {menuGroups.map(
                    (group) => (
                        <div
                            key={
                                group.title
                            }
                        >
                            <p className="mb-2 mt-6 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 first:mt-2">
                                {
                                    group.title
                                }
                            </p>

                            {group.items.map(
                                (item) => {
                                    const active =
                                        pathname ===
                                        item.href;

                                    const badgeValue =
                                        item.badgeKey
                                            ? menuBadges[
                                                  item
                                                      .badgeKey
                                              ] || 0
                                            : 0;

                                    return (
                                        <Link
                                            key={
                                                item.href
                                            }
                                            href={
                                                item.href
                                            }
                                            className={
                                                active
                                                    ? "flex items-center gap-3 rounded-xl bg-sky-500/10 px-3 py-2.5 font-bold text-sky-500"
                                                    : "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-sky-500"
                                            }
                                        >
                                            <span className="material-symbols-outlined w-5 text-center text-[20px]">
                                                {
                                                    item.icon
                                                }
                                            </span>

                                            <p className="text-sm font-medium">
                                                {
                                                    item.title
                                                }
                                            </p>

                                            {badgeValue >
                                                0 && (
                                                <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                                                    {badgeValue >
                                                    99
                                                        ? "99+"
                                                        : badgeValue}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                }
                            )}
                        </div>
                    )
                )}
            </nav>

            <div className="border-t border-slate-100 p-4">
                <button
                    type="button"
                    onClick={
                        handleLogout
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        logout
                    </span>

                    <p className="text-sm font-medium">
                        ออกจากระบบ
                    </p>
                </button>
            </div>
        </aside>
    );
}