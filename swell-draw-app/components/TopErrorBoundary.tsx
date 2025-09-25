import React from "react";
import * as Sentry from "@sentry/browser";
import Trans from "@swell-draw/swellDraw/components/Trans";

interface TopErrorBoundaryProps {
  children: React.ReactNode;
}

interface TopErrorBoundaryState {
  hasError: boolean;
  sentryEventId: string;
  localStorage: string;
}

export class TopErrorBoundary extends React.Component<
  TopErrorBoundaryProps,
  TopErrorBoundaryState
> {
  state: TopErrorBoundaryState = {
    hasError: false,
    sentryEventId: "",
    localStorage: "",
  };

  render() {
    return this.state.hasError ? this.errorSplash() : this.props.children;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const _localStorage: Record<string, unknown> = {};
    for (const [key, value] of Object.entries({ ...localStorage })) {
      try {
        _localStorage[key] = JSON.parse(value);
      } catch {
        _localStorage[key] = value;
      }
    }

    // 检查 Sentry 是否可用
    if (typeof Sentry !== "undefined" && Sentry.captureException) {
      try {
        Sentry.withScope((scope) => {
          scope.setExtras({ errorInfo });
          const eventId = Sentry.captureException(error);

          this.setState(() => ({
            hasError: true,
            sentryEventId: eventId,
            localStorage: JSON.stringify(_localStorage),
          }));
        });
      } catch (sentryError) {
        console.warn("Sentry 错误上报失败:", sentryError);
        // 即使 Sentry 失败，也要显示错误界面
        this.setState(() => ({
          hasError: true,
          sentryEventId: "",
          localStorage: JSON.stringify(_localStorage),
        }));
      }
    } else {
      console.warn("Sentry 不可用，跳过错误上报");
      // 即使没有 Sentry，也要显示错误界面
      this.setState(() => ({
        hasError: true,
        sentryEventId: "",
        localStorage: JSON.stringify(_localStorage),
      }));
    }
  }

  private errorSplash() {
    return (
      <div className="ErrorSplash swell-draw">
        <div className="ErrorSplash-messageContainer">
          <div className="ErrorSplash-paragraph bigger align-center">
            <Trans
              i18nKey="errorSplash.headingMain"
              button={(el) => (
                <button onClick={() => window.location.reload()}>{el}</button>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}
