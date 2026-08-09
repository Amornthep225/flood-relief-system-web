export default function AdminSosEmpty() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <span className="material-symbols-outlined text-5xl text-slate-300">
                search_off
            </span>

            <h2 className="mt-4 text-lg font-bold text-slate-700">
                ไม่พบเคสที่ตรงกับตัวกรอง
            </h2>

            <p className="mt-1 text-sm text-slate-400">
                ลองเปลี่ยนคำค้นหาหรือสถานะ
            </p>
        </div>
    );
}
