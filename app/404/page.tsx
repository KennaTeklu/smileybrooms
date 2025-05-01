"use client"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mb-8 text-lg">Sorry, the page you are looking for does not exist.</p>
      <div className="flex gap-4">
        <a href="/" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Go Home
        </a>
        <button
          onClick={() => window.history.back()}
          className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
