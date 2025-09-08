const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "eslint-config-alloy",
    "eslint-config-alloy/react",
    "eslint-config-alloy/typescript",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js", "public/"],

  rules: {
    // add specific rules configurations here
  },
};
