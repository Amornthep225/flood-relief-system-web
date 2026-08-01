export default function InventoryEmptyState({
    hasItems,
}) {
    return (
        <div className="rounded-3xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <span className="material-symbols-outlined text-3xl">
                    {hasItems
                        ? "search_off"
                        : "inventory_2"}
                </span>
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-700">
                {hasItems
                    ? "ไม่พบสิ่งของที่ค้นหา"
                    : "ยังไม่มีข้อมูลในคลัง"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
                {hasItems
                    ? "ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น"
                    : "เมื่อรับของบริจาคเข้าคลัง รายการจะแสดงที่หน้านี้"}
            </p>
        </div>
    );
}
