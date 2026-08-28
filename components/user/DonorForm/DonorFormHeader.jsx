"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function DonorFormHeader() {
    const { t } = useLanguage();

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800">
                {t("donation.form.title")}
            </h1>
            <p className="mt-2 text-slate-500">
                {t("donation.form.subtitle")}
            </p>
        </div>
    );
}
