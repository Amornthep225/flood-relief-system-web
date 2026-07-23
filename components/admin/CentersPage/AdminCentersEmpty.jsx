export default function AdminCentersEmpty() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <span className="material-symbols-outlined text-6xl text-slate-300">
                domain_disabled
            </span>

            <h2 className="mt-4 font-bold text-slate-700">
                ไม่พบข้อมูลศูนย์
            </h2>

            <p className="mt-1 text-sm text-slate-500">
                ลองเปลี่ยนคำค้นหาหรือตัวกรอง
            </p>
        </div>
    );
}
