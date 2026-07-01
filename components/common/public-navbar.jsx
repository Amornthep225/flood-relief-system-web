import Link from "next/link";
import { buttons } from "@/constants/buttons";
import { colors } from "@/constants/colors";

export default function PublicNavbar({
    hotline = "1784",
    homeHref = "/",
    theme = colors.role,
    backHref = "/",
    options = {},
}) {
    const {
        back = true,
        hotlineButton = true,
    } = options;
    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link href={homeHref} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#2a93d5] rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-2xl">
                            waves
                        </span>
                    </div>

                    <h2 className={`${theme.primaryText} text-xl font-black uppercase tracking-tight`}>
                        Flood Relief
                    </h2>
                </Link>

                {/* Right */}
                <div className="flex items-center gap-6">

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

                    {hotlineButton && (
                        <div className="flex flex-col items-center">
                            <span className={`${theme.emergencyText} text-[10px] font-bold`}>
                                สายด่วนฉุกเฉิน
                            </span>

                            <a
                                href={`tel:${hotline}`}
                                className={buttons.common.hotline}
                            >
                                {hotline}
                            </a>
                        </div>
                    )}

                </div>

            </div>
        </nav>
    );
}