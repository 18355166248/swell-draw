module.exports = {
  root: true,
  extends: ["./packages/eslint-config-custom/.eslintrc.json"],
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
  ],
};
