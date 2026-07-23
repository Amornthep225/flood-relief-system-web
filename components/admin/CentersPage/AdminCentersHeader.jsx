export default function AdminCentersHeader({
    onAdd,
}) {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div>
                <h1 className="flex flex-wrap items-center gap-2 text-xl font-bold text-slate-800">
                    จัดการจุดรับบริจาค

                    <span className="rounded-md bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700">
                        Donation Centers
                    </span>
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    เพิ่ม แก้ไข ลบ และตรวจสอบสถานะคลังของแต่ละศูนย์
                </p>
            </div>

            <button
                type="button"
                onClick={onAdd}
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-teal-500/30 transition hover:bg-teal-700"
            >
                <span className="material-symbols-outlined text-sm">
                    add
                </span>

                <span className="hidden sm:inline">
                    เพิ่มศูนย์ใหม่
                </span>
            </button>
        </header>
    );
}
