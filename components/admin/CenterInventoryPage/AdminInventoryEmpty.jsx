export default function AdminInventoryEmpty({
    activeTab,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <span className="material-symbols-outlined text-6xl text-slate-300">
                {activeTab ===
                "inventory"
                    ? "inventory_2"
                    : "history"}
            </span>

            <h2 className="mt-4 font-bold text-slate-700">
                {activeTab ===
                "inventory"
                    ? "ไม่พบข้อมูลสินค้าในคลัง"
                    : "ไม่พบประวัติ Transaction"}
            </h2>
        </div>
    );
}
