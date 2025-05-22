import { CartDrawer } from "@/components/cart-drawer"

export const WebsiteHeader = () => {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Store</h1>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Home
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Products
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              About
            </a>
            <CartDrawer />
          </div>
        </div>
      </div>
    </header>
  )
}
