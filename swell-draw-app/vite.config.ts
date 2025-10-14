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
    base: rootEnvVars.VITE_APP_BASE_URL,
    server: {
      port: Number(rootEnvVars.VITE_APP_PORT),
      open: true,
    },
    // 环境变量文件目录配置
    // 由于 .env 文件位于父目录而不是与 vite.config.ts 同级，需要指定 envDir
    envDir: "../",
    resolve: {
      alias: [
        {
          find: "components",
          replacement: path.resolve(__dirname, "./components"),
        },
        {
          find: "app-jotai",
          replacement: path.resolve(__dirname, "./app-jotai"),
        },
        {
          find: /^@swell-draw\/common$/,
          replacement: path.resolve(__dirname, "../packages/common/src"),
        },
        {
          find: /^@swell-draw\/common\/(.*?)/,
          replacement: path.resolve(__dirname, "../packages/common/src/$1"),
        },
        {
          find: /^@swell-draw\/swellDraw$/,
          replacement: path.resolve(
            __dirname,
            "../packages/swellDraw/index.tsx",
          ),
        },
        {
          find: /^@swell-draw\/swellDraw\/(.*?)/,
          replacement: path.resolve(__dirname, "../packages/swellDraw/$1"),
        },
        {
          find: /^@swell-draw\/element$/,
          replacement: path.resolve(__dirname, "../packages/element/src"),
        },
        {
          find: /^@swell-draw\/element\/(.*?)/,
          replacement: path.resolve(__dirname, "../packages/element/src/$1"),
        },
      ],
    },
    build: {
      outDir: "../dist",
      // 代码分割配置
      rollupOptions: {
        output: {
          assetFileNames() {
            return "assets/[name]-[hash][extname]";
          },
          manualChunks: {
            // Sentry 相关
            sentry: ["@sentry/browser"],
          },
        },
      },
      // 生成 source map 用于调试
      // sourcemap: true,
      // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。
      assetsInlineLimit: 0,
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
