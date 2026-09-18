"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const METHODS = [
    {
        value: "Delivery",
        icon: "local_shipping",
        titleKey: "sos.relief.receiveMethod.deliveryTitle",
        descriptionKey: "sos.relief.receiveMethod.deliveryDescription",
    },
    {
        value: "Pickup",
        icon: "storefront",
        titleKey: "sos.relief.receiveMethod.pickupTitle",
        descriptionKey: "sos.relief.receiveMethod.pickupDescription",
    },
];

export default function ReceiveMethodSelector({ value, onChange }) {
    const { t } = useLanguage();

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {METHODS.map((method) => {
                const selected = value === method.value;

                return (
                    <button
                        key={method.value}
                        type="button"
                        onClick={() => onChange(method.value)}
                        className={`rounded-2xl border p-5 text-left transition ${
                            selected
                                ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100"
                                : "border-slate-200 bg-white hover:border-sky-200"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                    selected
                                        ? "bg-sky-600 text-white"
                                        : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                <span className="material-symbols-outlined">
                                    {method.icon}
                                </span>
                            </div>

                            <div>
                                <p className="font-black text-slate-800">
                                    {t(method.titleKey)}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                    {t(method.descriptionKey)}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
