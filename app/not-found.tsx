export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <a href="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
        Return to Home
      </a>
    </div>
  )
}
