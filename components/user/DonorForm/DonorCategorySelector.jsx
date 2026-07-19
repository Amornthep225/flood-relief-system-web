export default function DonorCategorySelector({
    categories,
    selectedCategory,
    onSelect
}) {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
                ประเภทสิ่งของ
            </h2>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onSelect(category.id)}
                        className={`rounded-xl border p-4 font-bold text-sm transition-all active:scale-[0.98] ${selectedCategory === category.id
                                ? "border-red-500 bg-red-50 text-red-500 shadow-sm"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                    >
                        {category.title}
                    </button>
                ))}
            </div>
        </div>
    );
}