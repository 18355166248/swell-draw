import * as Sentry from "@sentry/browser";

const SentryEnvHostnameMap: { [key: string]: string } = {
  "swell-draw.com": "production",
};

const onlineEnv = Object.keys(SentryEnvHostnameMap).find(
  (item) => window.location.hostname.indexOf(item) >= 0,
);

// 检查是否为开发环境
const isDevelopment =
  import.meta.env.DEV ||
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("127.0.0.1");

// 只在生产环境或指定域名下初始化 Sentry
if (!isDevelopment || onlineEnv) {
  try {
    // https://swell-x7.sentry.io/insights/projects/swell-draw/?project=4510066675154944&statsPeriod=14d
    Sentry.init({
      dsn: "https://a7648d965444e52f6ad6e9b831cc2f0f@o4509999784329216.ingest.us.sentry.io/4510066675154944",
      environment: onlineEnv ? SentryEnvHostnameMap[onlineEnv] : "development",
      integrations: [Sentry.browserTracingIntegration()],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: isDevelopment ? 0.1 : 1.0,

      // 添加错误处理
      beforeSend(event, hint) {
        // 检查是否是网络错误
        if (hint.originalException && hint.originalException instanceof Error) {
          const error = hint.originalException;
          if (
            error.message.includes("ERR_BLOCKED_BY_CLIENT") ||
            error.message.includes("Failed to fetch") ||
            error.message.includes("NetworkError")
          ) {
            console.warn(
              "Sentry 数据上传被阻止，可能是广告拦截器或网络问题:",
              error.message,
            );
            return null; // 不发送这个事件
          }
        }
        return event;
      },

      // 添加传输选项
      transportOptions: {
        // 可以在这里添加支持的传输选项
      },
    });

    console.log("Sentry 初始化成功");
  } catch (error) {
    console.warn("Sentry 初始化失败:", error);
  }
} else {
  console.log("开发环境，跳过 Sentry 初始化");
}
