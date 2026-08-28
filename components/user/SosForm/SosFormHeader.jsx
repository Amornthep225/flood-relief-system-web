"use client";

import { colors } from "@/constants/colors";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SosFormHeader() {
    const { t } = useLanguage();

    return (
        <div className="text-center mb-8">
            <h1
                className={`${colors.requestFormSos.primaryText} text-3xl font-bold mb-2`}
            >
                {t("sos.extras.formHeaderTitle")}
            </h1>

            <p className={colors.requestFormSos.secondaryText}>
                {t("sos.extras.formHeaderSubtitle")}
            </p>
        </div>
    );
}
