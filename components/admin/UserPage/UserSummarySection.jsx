export default function UserSummarySection({ users }) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 mb-1">ผู้ใช้ทั้งหมด</p>
                    <h3 className="text-2xl font-bold text-slate-800">
                        {users.length}
                    </h3>
                </div>

                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-2xl">groups</span>
                </div>
            </div>
        </section>
    );
}