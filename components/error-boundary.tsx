"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Unexpected Error</h1>
            <p className="text-gray-600 dark:text-gray-400">
              We've encountered an unexpected error. Please try refreshing the page or return to the home page.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false })}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Try Again
              </Button>

              <Button asChild className="flex items-center gap-2">
                <Link href="/">
                  <Home size={16} />
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
