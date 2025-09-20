import reactInternalConfig from "../packages/eslint-config/react-internal.js";

export default [
  ...reactInternalConfig,
  {
    rules: {
      "react/react-in-jsx-scope": "off", // 关闭此规则，因为使用了新的 JSX 转换
    },
  },
];
