import { Button } from "@/components/ui/button"
import CartButton from "@/components/cart-button"

const MinimalHero = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Discover Amazing Experiences</h1>
        <p className="text-gray-600 text-lg mb-8">Find and book unique activities and adventures near you.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            Book Now
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3">
            Learn More
          </Button>

          {/* Add cart access button */}
          <CartButton
            variant="outline"
            size="lg"
            className="px-8 py-3 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
          />
        </div>
      </div>
    </section>
  )
}

export default MinimalHero
