import { NestedTypeOf } from "@swell-draw/common";
import fallbackLangData from "./locales/zh-cN.json";
import percentages from "./locales/precentages.json";

const COMPLETION_THRESHOLD = 85;

export interface Language {
  code: string;
  label: string;
  rtl?: boolean;
}

export type TranslationKeys = NestedTypeOf<typeof fallbackLangData>;

export const defaultLang = {
  code: "zh-CN",
  label: "简体中文",
};

export const languages: Language[] = [
  defaultLang,
  ...[
    { code: "en", label: "English" },
    { code: "ja-JP", label: "日本語" },
  ],
]
  .filter(
    (lang) =>
      (percentages as Record<string, number>)[lang.code] >=
      COMPLETION_THRESHOLD,
  )
  .sort((left, right) => (left.label > right.label ? 1 : -1));

let currentLang: Language = defaultLang;
let currentLangData = fallbackLangData;

export const setLanguage = async (lang: Language) => {
  currentLang = lang;
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.rtl ? "rtl" : "ltr";

  try {
    currentLangData = await import(`./locales/${currentLang.code}.json`);
  } catch (error) {
    console.error("Failed to load language data for", currentLang.code, error);
    currentLangData = fallbackLangData;
  }
};

console.log(currentLangData);
