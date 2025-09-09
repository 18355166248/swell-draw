module.exports = {
  root: true,
  extends: ["custom/library"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    // 可以在这里添加项目特定的规则
  },
  ignorePatterns: [
    "node_modules/",
    "packages/*/node_modules/",
    "dist/",
    "build/",
    "coverage",
    "package-lock.json",
    ".vscode/",
  ],
};
