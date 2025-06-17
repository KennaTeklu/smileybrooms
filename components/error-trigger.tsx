"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ErrorTrigger() {
  const [shouldThrow, setShouldThrow] = useState(false)
  const [shouldThrowPromise, setShouldThrowPromise] = useState(false)

  if (shouldThrow) {
    throw new Error("This is a simulated React rendering error!")
  }

  const throwGlobalError = () => {
    // This error is outside React's render cycle, caught by window.onerror
    setTimeout(() => {
      // @ts-ignore
      // Intentionally trigger an error
      try {
        nonExistentFunction()
      } catch (error) {
        console.error("Caught expected error:", error)
      }
    }, 100)
  }

  const throwPromiseRejection = () => {
    // This unhandled promise rejection is caught by window.onunhandledrejection
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("This is a simulated unhandled promise rejection!"))
      }, 100)
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-red-50 border-red-200">
      <h3 className="text-lg font-semibold text-red-800">Error Testing Tools</h3>
      <p className="text-sm text-red-700">
        Use these buttons to simulate different types of errors and observe the error reporting system.
      </p>
      <div className="flex gap-2">
        <Button onClick={() => setShouldThrow(true)} variant="destructive">
          Throw Render Error
        </Button>
        <Button onClick={throwGlobalError} variant="destructive">
          Throw Global JS Error
        </Button>
        <Button onClick={throwPromiseRejection} variant="destructive">
          Throw Promise Rejection
        </Button>
      </div>
    </div>
  )
}
