"use client"

import type React from "react"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to console
    console.error("Error caught by GlobalErrorBoundary:", error, errorInfo)

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Update state with error info
    this.setState({ errorInfo })

    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="p-6 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Something went wrong</h3>
          </div>

          <div className="mb-4">
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">
              We encountered an unexpected error. Our team has been notified.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/40 rounded border border-red-200 dark:border-red-800 overflow-auto max-h-40">
                <p className="font-mono text-xs text-red-800 dark:text-red-300 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.error.stack && (
                    <>
                      <br />
                      {this.state.error.stack}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
              className="bg-white dark:bg-gray-800"
            >
              Try again
            </Button>

            <Button variant="outline" onClick={() => window.location.reload()} className="bg-white dark:bg-gray-800">
              Reload page
            </Button>

            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="bg-white dark:bg-gray-800"
            >
              Go to homepage
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
