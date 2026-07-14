import { cards } from "@/constants/cards";

export default function SosCategorySelector({
    categories,
    selectedCategories,
    onToggleCategory,
}) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
                const selected = selectedCategories.includes(category.id);

                return (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onToggleCategory(category.id)}
                        className={`${cards.userSosForm.category} ${
                            selected
                                ? "border-sky-500 bg-sky-50 shadow-md"
                                : "border-slate-100"
                        }`}
                    >
                        <div
                            className={`absolute top-2 right-2 w-6 h-6 bg-sky-500 text-white rounded-full flex items-center justify-center text-xs shadow-sm z-10 transition-transform ${
                                selected ? "scale-100" : "scale-0"
                            }`}
                        >
                            <span className="material-symbols-outlined text-sm">
                                check
                            </span>
                        </div>

                        <span
                            className={`material-symbols-outlined text-3xl mb-3 transition-colors ${
                                selected ? "text-sky-500" : "text-slate-400"
                            }`}
                        >
                            {category.icon}
                        </span>

                        <span className="font-bold text-slate-700 mb-1 text-sm md:text-base">
                            {category.title}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}