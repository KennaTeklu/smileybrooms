export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex space-x-2">
        <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
        <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  )
}
