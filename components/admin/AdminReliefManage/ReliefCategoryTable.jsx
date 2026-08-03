import ReliefStatusBadge from "./ReliefStatusBadge";

export default function ReliefCategoryTable({ rows, onEdit, onToggle }) {
    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="font-black text-slate-800">หมวดหมู่สินค้า</h2>
                <p className="mt-1 text-sm text-slate-500">ใช้จัดกลุ่มสิ่งของในระบบ</p>
            </div>

            {rows.length === 0 ? (
                <div className="px-6 py-20 text-center text-slate-500">ไม่พบหมวดหมู่</div>
            ) : (
                <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                    {rows.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-slate-200 p-5 hover:border-violet-200 hover:shadow-md">
                            <div className="flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                                    <span className="material-symbols-outlined">category</span>
                                </div>
                                <ReliefStatusBadge isActive={item.isActive} />
                            </div>
                            <p className="mt-5 text-xs font-mono font-bold text-slate-400">#{item.id}</p>
                            <h3 className="mt-1 text-lg font-black text-slate-800">{item.name}</h3>
                            <div className="mt-5 flex gap-2">
                                <button onClick={() => onEdit(item)} className="flex-1 rounded-xl bg-sky-50 px-3 py-2.5 text-xs font-bold text-sky-700">
                                    แก้ไข
                                </button>
                                <button
                                    onClick={() => onToggle(item)}
                                    className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold ${
                                        item.isActive
                                            ? "bg-orange-50 text-orange-700"
                                            : "bg-emerald-50 text-emerald-700"
                                    }`}
                                >
                                    {item.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
