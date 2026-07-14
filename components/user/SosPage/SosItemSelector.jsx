import { cards } from "@/constants/cards";

export default function SosItemSelector({
    categories,
    itemsByCategory,
    selectedCategories,
    selectedItems,
    quantities,
    onToggleItem,
    onIncrease,
    onDecrease,
    onQuantityChange,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {selectedCategories.map((categoryId) => {
                const category = categories.find((item) => item.id === categoryId);
                const items = itemsByCategory[categoryId] || [];

                return (
                    <div key={categoryId} className={cards.userSosForm.itemGroup}>
                        <h4 className="font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2 flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-sky-500">
                                {category?.icon}
                            </span>
                            ระบุจำนวน {category?.title}
                        </h4>

                        <div className="space-y-3">
                            {items.map((item) => {
                                const checked = selectedItems.includes(item.id);

                                return (
                                    <div key={item.id} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => onToggleItem(item.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer relative ${
                                                checked
                                                    ? "bg-sky-50 border-sky-500 text-sky-700 rounded-b-none"
                                                    : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                                            }`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                                    checked
                                                        ? "bg-sky-500 border-sky-500"
                                                        : "border-slate-300"
                                                }`}
                                            >
                                                {checked && (
                                                    <span className="material-symbols-outlined text-white text-[12px]">
                                                        check
                                                    </span>
                                                )}
                                            </div>

                                            <span className="text-sm font-medium flex-grow text-left truncate">
                                                {item.name}
                                            </span>
                                        </button>

                                        {checked && (
                                            <div className="flex items-center justify-between px-3 py-2.5 bg-sky-50/50 border border-t-0 border-sky-500 rounded-b-xl -mt-1 pt-3">
                                                <div className="flex items-center gap-2 bg-white border border-sky-200 rounded-lg p-0.5 shadow-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => onDecrease(item.id)}
                                                        className="w-6 h-6 rounded flex items-center justify-center text-sky-500 hover:bg-sky-100"
                                                    >
                                                        -
                                                    </button>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={quantities[item.id] || 1}
                                                        onChange={(e) =>
                                                            onQuantityChange(item.id, e.target.value)
                                                        }
                                                        className="w-8 text-center text-xs font-bold text-slate-700 focus:outline-none bg-transparent"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => onIncrease(item.id)}
                                                        className="w-6 h-6 rounded bg-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-200"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <span className="text-[10px] text-slate-500 font-bold">
                                                    {item.unit}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}