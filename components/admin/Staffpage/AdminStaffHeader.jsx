export default function AdminStaffHeader({ onAddStaff }) {
    return (
        <header className="flex items-center justify-between bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    ทีมงานและเจ้าหน้าที่
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-md font-bold">
                        Staff Team
                    </span>
                </h2>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onAddStaff}
                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
                >
                    <span className="material-symbols-outlined text-sm">
                        person_add
                    </span>
                    เพิ่ม Staff
                </button>

                <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <span className="material-symbols-outlined text-sm">
                        download
                    </span>
                    Export รายชื่อ
                </button>
            </div>
        </header>
    );
}