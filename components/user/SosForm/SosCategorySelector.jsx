export default function SosCategorySelector({
    categories,
    selectedCategoryIds,
    onToggle,
}) {
    if (categories.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                ยังไม่มีหมวดหมู่สิ่งของที่เปิดใช้งาน
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => {
                const isSelected =
                    selectedCategoryIds.includes(category.id);

                return (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onToggle(category.id)}
                        className={`relative min-h-32 rounded-2xl border p-5 text-left transition-all ${
                            isSelected
                                ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-100"
                                : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                        }`}
                    >
                        {isSelected && (
                            <span className="material-symbols-outlined absolute right-3 top-3 text-sky-500">
                                check_circle
                            </span>
                        )}

                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                                isSelected
                                    ? "bg-sky-500 text-white"
                                    : "bg-sky-100 text-sky-500"
                            }`}
                        >
                            <span className="material-symbols-outlined text-2xl">
                                {category.icon || "inventory_2"}
                            </span>
                        </div>

                        <p className="font-bold text-slate-800">
                            {category.title ||
                                category.name ||
                                "ไม่ระบุชื่อ"}
                        </p>
                    </button>
                );
            })}
        </div>
    );
}