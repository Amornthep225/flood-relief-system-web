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
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
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

                        const unit = translateMasterDataText(item.unit || "", language);

                        const currentQuantity = Number(quantities[item.id] || 0);

                        const maximumQuantity = Number(item.maximumQuantity || 0);

                        const remainingQuantity =
                            item.remainingQuantity === null ||
                                item.remainingQuantity === undefined
                                ? null
                                : Number(item.remainingQuantity);

                        // Max > 0 = มีการจำกัดจำนวน
                        const hasLimit = maximumQuantity > 0 && remainingQuantity !== null;

                        // User กรอกถึงจำนวนสูงสุดที่ยังรับได้แล้ว
                        const reachedLimit =
                            hasLimit &&
                            remainingQuantity > 0 &&
                            currentQuantity >= remainingQuantity;

                        return (
                            <div
                                key={item.id}
                                className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    {/* Item information */}
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800">{itemName}</p>

                                        <p className="mt-0.5 text-sm text-slate-500">
                                            {t("donation.form.unitLabel")}: {unit}
                                        </p>

                                        {/* จำกัดจำนวน */}
                                        {hasLimit && (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-sm font-semibold text-sky-700">
                                                    {language === "en"
                                                        ? `Can receive ${remainingQuantity.toLocaleString(
                                                            "en-US"
                                                        )} more ${unit}`
                                                        : `รับบริจาคได้อีก ${remainingQuantity.toLocaleString(
                                                            "th-TH"
                                                        )} ${unit}`}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {language === "en"
                                                        ? `Maximum target: ${maximumQuantity.toLocaleString(
                                                            "en-US"
                                                        )} ${unit}`
                                                        : `เป้าหมายการรับบริจาค ${maximumQuantity.toLocaleString(
                                                            "th-TH"
                                                        )} ${unit}`}
                                                </p>
                                            </div>
                                        )}

                                        {/* ไม่จำกัด */}
                                        {!hasLimit && (
                                            <p className="mt-2 text-xs font-medium text-emerald-600">
                                                {language === "en"
                                                    ? "No maximum donation limit"
                                                    : "ไม่จำกัดจำนวนรับบริจาค"}
                                            </p>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <input
                                        type="number"
                                        min="0"
                                        max={hasLimit ? remainingQuantity : undefined}
                                        step="1"
                                        placeholder="0"
                                        value={quantities[item.id] || ""}
                                        onChange={(event) =>
                                            onChangeQuantity(item.id, event.target.value)
                                        }
                                        className={`w-24 rounded-xl border px-3 py-2 text-center font-semibold outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${reachedLimit
                                                ? "border-amber-400 bg-amber-50 text-amber-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                                : "border-slate-200 text-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            }`}
                                    />
                                </div>

                                {/* แจ้งเมื่อกรอกถึงเพดาน */}
                                {reachedLimit && (
                                    <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2">
                                        <p className="text-xs font-semibold text-amber-700">
                                            {language === "en"
                                                ? `You have reached the maximum quantity this center can currently accept (${remainingQuantity.toLocaleString(
                                                    "en-US"
                                                )} ${unit}).`
                                                : `ถึงจำนวนสูงสุดที่ศูนย์ยังรับได้แล้ว (${remainingQuantity.toLocaleString(
                                                    "th-TH"
                                                )} ${unit})`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-sm text-slate-400">
                        {t("donation.form.selectCategoryFirst")}
                    </div>
                )}
            </div>
        </div>
    );
}
