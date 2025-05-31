import { Button } from "@/components/ui/button"
import Link from "next/link"

const MinimalHero = () => {
  return (
    <div className="bg-gray-100 py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-8">Unlock Your Potential</h1>
        <p className="text-xl text-gray-600 mb-12">Join our community and discover new opportunities.</p>
        <div className="flex justify-center">
          {/* Input field placeholder */}
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
          />
        </div>
        <Link href="/pricing">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg mt-8">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default MinimalHero
