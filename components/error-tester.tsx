"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ErrorTester() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error("This is a simulated client-side rendering error!")
  }

  const triggerUnhandledPromiseRejection = () => {
    Promise.reject(new Error("This is a simulated unhandled promise rejection!"))
  }

  const triggerUncaughtException = () => {
    // This will cause an uncaught exception
    // @ts-ignore
    const nonExistentFunction = () => {
      throw new Error("Simulated uncaught exception")
    }
    nonExistentFunction()
  }

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
      <h3 className="text-lg font-semibold">Error Testing</h3>
      <p className="text-sm text-muted-foreground">
        Use these buttons to simulate different types of client-side errors to test your error handling.
      </p>
      <div className="flex gap-2">
        <Button onClick={() => setShouldError(true)} variant="destructive">
          Trigger Client Error (Render)
        </Button>
        <Button onClick={triggerUnhandledPromiseRejection} variant="destructive">
          Trigger Unhandled Promise
        </Button>
        <Button onClick={triggerUncaughtException} variant="destructive">
          Trigger Uncaught Exception
        </Button>
      </div>
    </div>
  )
}
