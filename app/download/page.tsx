import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Download App - Template",
  description: "Template download page - no functionality",
}

export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Download Our App</h1>
      <p className="text-lg mb-8">This is a template download page. No actual download functionality is implemented.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["iOS", "Android", "Windows", "macOS", "Linux"].map((platform) => (
          <div key={platform} className="border p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">{platform} App</h2>
            <p className="mb-4">Template for {platform} download.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Download Template</button>
          </div>
        ))}
      </div>
    </div>
  )
}
