"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { translateMasterDataText } from "@/locales/uiPhrases";

export default function DonorItemSelector({
    items,
    quantities,
    onChangeQuantity,
}) {
    const { language, t } = useLanguage();

    return (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
                {t("donation.form.itemsTitle")}
            </h2>

            <div className="space-y-4">
                {items.length > 0 ? (
                    items.map((item) => {
                        const itemName = translateMasterDataText(
                            item.name || item.reliefItemName || "",
                            language
                        );
                        const unit = translateMasterDataText(
                            item.unit || "",
                            language
                        );

                        return (
                            <div
                                key={item.id}
                                className="rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 transition-colors"
                            >
                                <div>
                                    <p className="font-bold text-slate-800">
                                        {itemName}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {t("donation.form.unitLabel")}:{" "}
                                        {unit}
                                    </p>
                                </div>

                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={quantities[item.id] || ""}
                                    onChange={(event) =>
                                        onChangeQuantity(
                                            item.id,
                                            event.target.value
                                        )
                                    }
                                    className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        );
                    })
                ) : (
                    <div className="py-8 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        {t("donation.form.selectCategoryFirst")}
                    </div>
                )}
            </div>
        </div>
    );
}
