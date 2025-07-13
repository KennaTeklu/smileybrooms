import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Skeleton className="h-8 w-32" />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Skeleton className="h-16 w-3/4 max-w-md mb-4" />
        <Skeleton className="h-8 w-1/2 max-w-sm mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <Skeleton className="h-6 w-48" />
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </nav>
      </footer>
    </div>
  )
}
