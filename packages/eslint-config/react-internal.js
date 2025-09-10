import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  // 基础配置 - 适用于所有文件
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      ...js.configs.recommended.rules,
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // TypeScript 推荐配置
  ...tseslint.configs.recommended,

  // React 配置
  pluginReact.configs.flat.recommended,

  // React Hooks 和 Refresh 配置 - 适用于 React 应用
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // 浏览器环境特定配置 - 适用于前端应用
  {
    files: ["**/app/**/*.{js,ts,jsx,tsx}", "**/src/**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
];
