"use client";

import Link from "next/link";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateMasterDataText } from "@/locales/uiPhrases";

function getProductStyle(item) {
    const isOutOfStock =
        item.stockStatus === "OutOfStock";

    if (isOutOfStock) {
        return {
            icon: "production_quantity_limits",
            iconBox: "bg-red-50 text-red-500",
            progressColor: "bg-red-500",
            missingColor: "text-red-600",
            button:
                "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
        };
    }

    return {
        icon: "inventory_2",
        iconBox: "bg-orange-50 text-orange-500",
        progressColor: "bg-orange-500",
        missingColor: "text-orange-600",
        button:
            "bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50",
    };
}

export default function LowProductCard({ item }) {
    const { language, t } = useLanguage();

    const quantity = Number(item.quantity ?? 0);
    const minimumQuantity = Number(
        item.minimumQuantity ?? 0
    );
    const missing = Math.max(
        minimumQuantity - quantity,
        0
    );
    const progress =
        minimumQuantity > 0
            ? Math.min(
                  (quantity / minimumQuantity) * 100,
                  100
              )
            : 0;

    const style = getProductStyle(item);
    const donationUrl = `/user/donor-form?centerId=${encodeURIComponent(
        item.centerId ?? ""
    )}&reliefItemId=${encodeURIComponent(
        item.reliefItemId ?? ""
    )}`;

    const itemName = translateMasterDataText(
        item.reliefItemName ||
            t("donation.lowStock.unspecifiedItem"),
        language
    );
    const centerName = translateMasterDataText(
        item.centerName ||
            t("donation.lowStock.unspecifiedCenter"),
        language
    );
    const unit = translateMasterDataText(
        item.unit || t("donation.lowStock.piece"),
        language
    );

    return (
        <article className={cards.donorLowProducts.card}>
            {item.stockStatus === "OutOfStock" && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                    <span className="material-symbols-outlined text-sm">
                        warning
                    </span>
                    {t("donation.lowStock.outOfStock")}
                </div>
            )}

            <div
                className={`${cards.donorLowProducts.image} ${style.iconBox}`}
            >
                <span className="material-symbols-outlined text-6xl transition-transform duration-500 group-hover:scale-110">
                    {style.icon}
                </span>
            </div>

            <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-800">
                        {itemName}
                    </h3>
                    <p className="mt-1 truncate text-xs text-slate-400">
                        {centerName}
                    </p>
                </div>

                <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                    {unit}
                </span>
            </div>

            <div className="mb-4 mt-3">
                <div className="mb-1 flex justify-between gap-3 text-xs">
                    <span className="text-slate-500">
                        {t("donation.lowStock.remaining", {
                            count: quantity,
                        })}
                    </span>

                    <span
                        className={`font-bold ${style.missingColor}`}
                    >
                        {t("donation.lowStock.missing", {
                            count: missing,
                        })}
                    </span>
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-2.5 rounded-full transition-all ${style.progressColor}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p className="mt-1 text-right text-[10px] text-slate-400">
                    {t("donation.lowStock.minimum", {
                        count: minimumQuantity,
                        unit,
                    })}
                </p>
            </div>

            <div className="mt-auto">
                <Link
                    href={donationUrl}
                    className={`${buttons.donorLowProducts.primary} ${style.button}`}
                >
                    {t("donation.lowStock.donateThis")}
                </Link>
            </div>
        </article>
    );
}
