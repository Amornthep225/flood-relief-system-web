"use client";

import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    translateMasterDataText,
    translateUiText,
} from "@/locales/uiPhrases";

export function useNativeUi() {
    const { language, t } = useLanguage();

    const ui = useCallback(
        (value) => translateUiText(value, language),
        [language]
    );

    const master = useCallback(
        (value) => translateMasterDataText(value, language),
        [language]
    );

    return { language, t, ui, master };
}
