import { ESLint } from "eslint";

// see https://github.com/okonet/lint-staged#how-can-i-ignore-files-from-eslintignore-
// for explanation
const eslint = new ESLint({});

export default {
  "*.{js,ts,tsx}": async (files) => {
    const filteredFiles = [];
    for (const file of files) {
      const isIgnored = await eslint.isPathIgnored(file);
      if (!isIgnored) {
        filteredFiles.push(file);
      }
    }
    return `eslint --max-warnings=0 --fix ${filteredFiles.join(" ")}`;
  },
  "*.{css,scss,json,md,html,yml}": ["prettier --write"],
};
