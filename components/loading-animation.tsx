export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-lg font-medium">Loading...</p>
    </div>
  )
}
