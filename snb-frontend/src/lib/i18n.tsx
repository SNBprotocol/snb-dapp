"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import en from "@/locales/en";
import zh from "@/locales/zh";

type Lang = "en" | "zh";

type I18nParams = Record<string, string | number>;

type I18nContextType = {
  lang: Lang;
  t: (key: string, params?: I18nParams) => string;
  switchLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18nContextType | null>(null);

/**
 * 支持 a.b.c 形式的深层取值
 */
function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object") {
      return acc[key];
    }
    return undefined;
  }, obj);
}

/**
 * 文案插值：将 {key} 替换为 params[key]
 */
function interpolate(
  template: string,
  params?: I18nParams
): string {
  if (!params) return template;

  return Object.keys(params).reduce((text, key) => {
    const value = String(params[key]);
    return text.replaceAll(`{${key}}`, value);
  }, template);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const dict = lang === "zh" ? zh : en;

  function t(key: string, params?: I18nParams): string {
    const value = getByPath(dict, key);
    if (typeof value !== "string") return key;
    return interpolate(value, params);
  }

  return (
    <I18nContext.Provider value={{ lang, t, switchLang: setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
