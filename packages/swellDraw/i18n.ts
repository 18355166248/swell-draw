import { isDevEnv, NestedTypeOf } from "@swell-draw/common";
import fallbackLangData from "./locales/zh-cN.json";
import percentages from "./locales/percentage.json";
import { atom, useAtomValue } from "./editor-jotai";

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

const TEST_LANG_CODE = "__test__";
if (isDevEnv()) {
  languages.unshift(
    { code: TEST_LANG_CODE, label: "test language" },
    {
      code: `${TEST_LANG_CODE}.rtl`,
      label: "\u{202a}test language (rtl)\u{202c}",
      rtl: true,
    },
  );
}

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

export const getLanguage = () => currentLang;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findPartsForData = (data: Record<string, any>, parts: string[]) => {
  for (let index = 0; index < parts.length; ++index) {
    const part = parts[index];
    if (data[part] === undefined) {
      return undefined;
    }
    data = data[part];
  }
  if (typeof data !== "string") {
    return undefined;
  }
  return data;
};

export const t = (
  path: TranslationKeys,
  replacement?: { [key: string]: string | number } | null,
  fallback?: string,
) => {
  if (currentLang.code.startsWith(TEST_LANG_CODE)) {
    const name = replacement
      ? `${path}(${JSON.stringify(replacement).slice(1, -1)})`
      : path;
    return `\u{202a}[[${name}]]\u{202c}`;
  }

  const parts = path.split(".");
  let translation =
    findPartsForData(currentLangData, parts) ||
    findPartsForData(fallbackLangData, parts) ||
    fallback;
  if (translation === undefined) {
    const errorMessage = `Can't find translation for ${path}`;
    // 在生产环境中，不要因为缺少翻译键而使应用崩溃
    if (import.meta.env.PROD) {
      console.warn(errorMessage);
      return "";
    }
    throw new Error(errorMessage);
  }

  if (replacement) {
    for (const key in replacement) {
      translation = translation.replace(`{{${key}}}`, String(replacement[key]));
    }
  }
  return translation;
};

/** @private 仅用于重新渲染使用 `useI18n` 钩子的组件的 atom */
const editorLangCodeAtom = atom(defaultLang.code);

// 应该在以下情况的组件中使用：
// - 组件作为 <Excalidraw> 的子组件渲染
// - 组件由 <Excalidraw> 内部渲染，但该组件
//   被记忆化且未在 `langCode`、`AppState` 或 `UIAppState` 更新时更新
export const useI18n = () => {
  const langCode = useAtomValue(editorLangCodeAtom);
  return { t, langCode };
};
