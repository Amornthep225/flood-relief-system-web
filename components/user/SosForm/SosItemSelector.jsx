export default function SosItemSelector({
    categories,
    itemsByCategory,
    selectedCategoryIds,
    selectedItemIds,
    quantities,
    onToggleItem,
    onIncrease,
    onDecrease,
    onQuantityChange,
}) {
    return (
        <div className="space-y-6">
            {selectedCategoryIds.map((categoryId) => {
                const category = categories.find(
                    (item) => item.id === categoryId
                );

                const items =
                    itemsByCategory[categoryId] || [];

                return (
                    <div
                        key={categoryId}
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                    >
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-sky-500">
                                {category?.icon || "category"}
                            </span>

                            {category?.title ||
                                category?.name ||
                                categoryId}
                        </h3>

                        {items.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                ยังไม่มีรายการสิ่งของในหมวดนี้
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {items.map((item) => {
                                    const isSelected =
                                        selectedItemIds.includes(
                                            item.id
                                        );

                                    return (
                                        <div
                                            key={item.id}
                                            className={`rounded-xl border p-4 transition-all ${
                                                isSelected
                                                    ? "border-sky-400 bg-white shadow-sm"
                                                    : "border-slate-200 bg-white"
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            isSelected
                                                        }
                                                        onChange={() =>
                                                            onToggleItem(
                                                                item.id
                                                            )
                                                        }
                                                        className="w-5 h-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                                                    />

                                                    <div>
                                                        <p className="font-bold text-slate-800">
                                                            {
                                                                item.name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-slate-400 mt-1">
                                                            หน่วย:{" "}
                                                            {
                                                                item.unit
                                                            }
                                                        </p>
                                                    </div>
                                                </label>

                                                {isSelected && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onDecrease(
                                                                    item.id
                                                                )
                                                            }
                                                            className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">
                                                                remove
                                                            </span>
                                                        </button>

                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                quantities[
                                                                    item
                                                                        .id
                                                                ] || 1
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                onQuantityChange(
                                                                    item.id,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-20 h-9 rounded-lg border border-slate-200 text-center text-sm font-bold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onIncrease(
                                                                    item.id
                                                                )
                                                            }
                                                            className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">
                                                                add
                                                            </span>
                                                        </button>

                                                        <span className="text-xs font-medium text-slate-500 min-w-10">
                                                            {item.unit}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}