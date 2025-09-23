import React from "react";
import * as Sentry from "@sentry/browser";

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

    Sentry.withScope((scope) => {
      scope.setExtras({ errorInfo });
      const eventId = Sentry.captureException(error);

      this.setState(() => ({
        hasError: true,
        sentryEventId: eventId,
        localStorage: JSON.stringify(_localStorage),
      }));
    });
  }

  private errorSplash() {
    return (
      <div className="ErrorSplash swell-draw">
        <div className="ErrorSplash-messageContainer">Error</div>
      </div>
    );
  }
}
