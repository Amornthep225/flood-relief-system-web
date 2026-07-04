export default function PublicFooter({
    theme,
    lastUpdate = "5 นาทีที่แล้ว",
}) {
    return (
        <footer className="w-full py-8 border-t border-blue-100 mt-auto bg-white/40">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

                <div className={`${theme.mutedText} flex items-center gap-2 text-sm font-medium`}>
                    <span className="material-symbols-outlined text-sm">
                        update
                    </span>

                    อัปเดตข้อมูลล่าสุด: {lastUpdate}
                </div>

                <div className="flex items-center gap-8">
                    <a
                        href="#"
                        className={`${theme.mutedText} hover:text-sky-600 transition-colors`}
                    >
                        นโยบายความเป็นส่วนตัว
                    </a>

                    <a
                        href="#"
                        className={`${theme.mutedText} hover:text-sky-600 transition-colors`}
                    >
                        ติดต่อศูนย์ช่วยเหลือ
                    </a>

                    <a
                        href="#"
                        className={`${theme.mutedText} hover:text-sky-600 transition-colors`}
                    >
                        รายงานปัญหา
                    </a>
                </div>

            </div>
        </footer>
    );
}