const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");

module.exports = [
  ...tseslint.configs.recommended,
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
  {
    files: ["swell-draw-app/**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
];
