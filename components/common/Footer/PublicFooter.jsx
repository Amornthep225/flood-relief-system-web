"use client";

export default function PublicFooter({
    theme,
    lastUpdate = "5 นาทีที่แล้ว",
    version = "v1.0.0",
}) {
    const currentYear = new Date().getFullYear();
    const textStyle = theme?.mutedText || "text-slate-500";

    return (
        <footer className="w-full py-8 border-t border-blue-100 mt-auto bg-white/40">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className={`${textStyle} flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-medium`}>
                    <span>&copy; {currentYear} Flood Relief System.</span>

                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 border border-slate-200">
                        {version}
                    </span>

                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                            update
                        </span>
                        อัปเดตข้อมูลล่าสุด: {lastUpdate}
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                    <a href="#" className={`${textStyle} hover:text-sky-600 transition-colors`}>
                        นโยบายความเป็นส่วนตัว
                    </a>

                    <a href="#" className={`${textStyle} hover:text-sky-600 transition-colors`}>
                        ติดต่อศูนย์ช่วยเหลือ
                    </a>

                    <a href="#" className={`${textStyle} hover:text-sky-600 transition-colors`}>
                        รายงานปัญหา
                    </a>

                    <div className="hidden sm:inline-block w-px h-4 bg-slate-300" />

                </div>
            </div>
        </footer>
    );
}