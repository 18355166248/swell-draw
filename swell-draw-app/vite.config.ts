import path from "path";
import { defineConfig, loadEnv } from "vite";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker"; // 类型检查和 ESLint 检查插件
import { createHtmlPlugin } from "vite-plugin-html"; // HTML 处理插件
import UnoCSS from "unocss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const rootEnvVars = loadEnv(mode, "../");
  return {
    server: {
      port: Number(rootEnvVars.VITE_APP_PORT),
      open: true,
    },
    // 环境变量文件目录配置
    // 由于 .env 文件位于父目录而不是与 vite.config.ts 同级，需要指定 envDir
    envDir: "../",
    resolve: {
      alias: {
        components: path.resolve(__dirname, "./components"),
        "app-jotai": path.resolve(__dirname, "./app-jotai"),
      },
    },
    plugins: [
      react(),
      UnoCSS(),
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
      // HTML 处理插件配置
      createHtmlPlugin({
        minify: true, // 启用 HTML 压缩
        inject: {
          data: {
            title: "Swell Draw",
          },
        },
      }),
    ],
    publicDir: "../public",
  };
});
