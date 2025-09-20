import { defineConfig, loadEnv } from "vite";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import react from "@vitejs/plugin-react";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import checker from "vite-plugin-checker"; // 类型检查和 ESLint 检查插件

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const rootEnvVars = loadEnv(mode, "../");
  return {
    plugins: [
      react(),
      ViteEjsPlugin({
        title: "Swell Draw",
      }),
      checker({
        typescript: true,
        // 根据环境变量决定是否启用 ESLint
        eslint:
          rootEnvVars.VITE_APP_ENABLE_ESLINT === "false"
            ? undefined
            : {
                lintCommand: 'eslint "./**/*.{js,ts,tsx}"',
                useFlatConfig: true,
              },
        overlay: {
          // 错误覆盖层配置
          initialIsOpen: rootEnvVars.VITE_APP_COLLAPSE_OVERLAY === "false",
          badgeStyle: "margin-bottom: 4rem; margin-left: 1rem",
        },
      }),
    ],
  };
});
