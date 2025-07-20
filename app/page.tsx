"use client"

import { useAbandonmentRescue } from "@/hooks/use-abandonment-rescue"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { isRescuable, startRescue, stopRescue, isRescuing } = useAbandonmentRescue()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {isRescuable ? (
          <>
            <p>Abandonment rescue is available!</p>
            {isRescuing ? (
              <Button onClick={stopRescue} disabled={!isRescuing}>
                Stop Rescue
              </Button>
            ) : (
              <Button onClick={startRescue} disabled={isRescuing}>
                Start Rescue
              </Button>
            )}
          </>
        ) : (
          <p>Abandonment rescue is not available.</p>
        )}
      </div>
    </main>
  )
}
