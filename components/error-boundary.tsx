"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children?: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

// Mock function to simulate logging errors to an external service
const logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
  console.error("🚨 Error reported to service:", {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
  })
  // In a real application, you would send this data to Sentry, Datadog, Bugsnag, etc.
  // Example: Sentry.captureException(error, { extra: errorInfo });
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })

    // Log the error to our simulated error reporting service
    logErrorToService(error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="mb-4">We're sorry, but there was an error loading this component.</p>
            <details className="text-sm">
              <summary className="cursor-pointer">Technical details</summary>
              <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded overflow-auto text-xs">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
