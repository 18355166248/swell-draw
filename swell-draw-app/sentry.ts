import * as Sentry from "@sentry/browser";

const SentryEnvHostnameMap: { [key: string]: string } = {
  "swell-draw.com": "production",
};

const onlineEnv = Object.keys(SentryEnvHostnameMap).find(
  (item) => window.location.hostname.indexOf(item) >= 0,
);

// https://swell-x7.sentry.io/insights/projects/swell-draw/?project=4510066675154944&statsPeriod=14d
Sentry.init({
  dsn: "https://400d7b1b282e1e3126751527e7754050@o4509999784329216.ingest.us.sentry.io/4510066672271360",
  environment: onlineEnv ? SentryEnvHostnameMap[onlineEnv] : undefined,
  integrations: [Sentry.browserTracingIntegration()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
