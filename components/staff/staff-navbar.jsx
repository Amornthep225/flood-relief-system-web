import Link from "next/link";
import { buttons } from "@/constants/buttons";
export default function StaffNavbar({
    user,
    theme,
    hotline = "1784",
    notificationCount = 0,

    homeHref = "/",
    backHref = "/",
    logoutHref = "/",

    options = {},
}) {
    const {
        home = false,
        back = false,
        logout = false,
        notification = true,
        profile = true,
        hotlineButton = true,
    } = options;

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
                <Link href={homeHref} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#2a93d5] rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-2xl">waves</span>
                    </div>

                    <h2 className={`${theme.primaryText} text-xl font-black uppercase tracking-tight`}>
                        Flood Relief
                    </h2>
                </Link>

                <div className="flex items-center gap-5">
                    {back && (
                        <Link
                            href={backHref}
                            className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                arrow_back
                            </span>
                            กลับ
                        </Link>
                    )}

                    {home && (
                        <Link
                            href={homeHref}
                            className={`${theme.primaryText} text-sm font-bold hover:text-[#2a93d5] transition-colors`}
                        >
                            หน้าแรก
                        </Link>
                    )}

                    {logout && (
                        <Link
                            href={logoutHref}
                            className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors"
                        >
                            Logout
                        </Link>
                    )}

                    {(back || home || logout) && (
                        <div className="hidden md:block h-6 w-px bg-slate-200" />
                    )}

                    {notification && (
                        <button className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-600">
                                notifications
                            </span>

                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                    {notificationCount}
                                </span>
                            )}
                        </button>
                    )}

                    {profile && user && (
                        <div className="flex items-center gap-3">
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />

                            <div className="hidden md:block">
                                <p className={`${theme.primaryText} text-sm font-bold`}>
                                    {user.name}
                                </p>
                                <p className="text-xs text-slate-400">เจ้าหน้าที่</p>
                            </div>
                        </div>
                    )}

                    {hotlineButton && (
                        <div className="flex flex-col items-center">
                            <span className={`${theme.emergencyText} text-[10px] font-bold`}>
                                สายด่วนฉุกเฉิน
                            </span>

                            <a href={`tel:${hotline}`} className={buttons.common.hotline}>
                                {hotline}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}