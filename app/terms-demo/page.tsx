"use client"

import { useState } from "react"
import TermsBadge from "@/components/terms-badge"

export default function TermsDemoPage() {
  const [showDemo, setShowDemo] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms Modal Demo</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About This Demo</h2>
          <p className="mb-4">
            This page demonstrates the enhanced Terms Modal with animations and error handling. The modal will
            automatically open if terms haven't been accepted yet.
          </p>
          <p className="mb-4">
            You can also click the floating badge in the bottom-right corner to open the modal manually.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Smooth animations using Framer Motion</li>
            <li>Error handling for localStorage operations</li>
            <li>Version tracking for terms</li>
            <li>Loading states and accessibility improvements</li>
            <li>Enhanced scroll detection with throttling</li>
          </ul>
        </div>

        {showDemo && <TermsBadge />}
      </div>
    </div>
  )
}
