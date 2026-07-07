export default function AdminUsersHeader() {
    return (
        <header className="flex items-center justify-between bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    ฐานข้อมูลผู้ใช้
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-500 text-xs rounded-md font-bold">
                        User Database
                    </span>
                </h2>
            </div>

            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                <span className="material-symbols-outlined text-sm">ios_share</span>
                Export รายชื่อ
            </button>
        </header>
    );
}