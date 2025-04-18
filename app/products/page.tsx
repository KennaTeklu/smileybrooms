import { Header } from "@/components/header"
import Footer from "@/components/footer"
import ProductCatalog from "@/components/product-catalog"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="py-8">
          <h1 className="text-4xl font-bold text-center mb-4">Our Products</h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Browse our selection of products and services
          </p>

          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            }
          >
            <ProductCatalog />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
