"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import th from "@/locales/th";
import en from "@/locales/en";

const STORAGE_KEY = "flood-relief-language";
const dictionaries = { th, en };

const LanguageContext = createContext(null);

function getNestedValue(source, key) {
  return key.split(".").reduce((value, part) => value?.[part], source);
}

function interpolate(value, params = {}) {
  if (typeof value !== "string") return value;

  return value.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match
  );
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("th");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "th" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "th" ? "th" : "en";
  }, [language]);

  const setLanguage = useCallback((nextLanguage) => {
    if (nextLanguage !== "th" && nextLanguage !== "en") return;
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
  }, []);

  const dictionary = dictionaries[language] || th;

  const t = useCallback(
    (key, params) => {
      const value = getNestedValue(dictionary, key);
      if (value === undefined || value === null) return key;
      return interpolate(value, params);
    },
    [dictionary]
  );

  const value = useMemo(
    () => ({ language, setLanguage, dictionary, t }),
    [language, setLanguage, dictionary, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
