"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="card w-96 bg-error text-error-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Oops! Something went wrong</h2>
              <p className="text-sm opacity-80">{this.state.error?.message || "An unexpected error occurred"}</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    this.setState({ hasError: false });
                    window.location.reload();
                  }}
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
