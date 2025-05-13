import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Windows Download - Template",
  description: "Template Windows download page - no functionality",
}

export default function WindowsDownloadPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Download Windows App</h1>
      <p className="text-lg mb-8">
        This is a template Windows download page. No actual download functionality is implemented.
      </p>

      <div className="border p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Windows App</h2>
        <p className="mb-4">Template for Windows download.</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Download Template</button>
      </div>
    </div>
  )
}
