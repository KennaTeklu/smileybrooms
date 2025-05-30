"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { useShoppingCart } from "use-shopping-cart"
import AdvancedSidePanel from "./advanced-side-panel"

const MinimalHero = () => {
  const { cartCount, cartDetails } = useShoppingCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    // You can add any logic here that needs to run when the component mounts
  }, [])

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const hasItemsInCart = cartCount > 0

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
              <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <a href="#">
                    <span className="sr-only">Workflow</span>
                    <img
                      className="h-8 w-auto sm:h-10"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      alt=""
                    />
                  </a>
                </div>
              </div>
              <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
                  Product
                </a>

                <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
                  Features
                </a>

                <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
                  Marketplace
                </a>

                <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
                  Company
                </a>

                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Log in
                </a>
              </div>
            </nav>
          </div>

          <main className="mt-8 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h2 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                Data to enrich your
                <br className="xl:hidden" />
                <span className="text-indigo-600">online business</span>
              </h2>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
                fugiat veniam occaecat fugiat aliqua.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get started
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                  >
                    Live demo
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
          alt=""
        />
      </div>
      {hasItemsInCart && (
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleCart}
            className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="ml-2">{cartCount}</span>
          </button>
        </div>
      )}
      <AdvancedSidePanel isOpen={isCartOpen} onClose={toggleCart}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
          {cartDetails &&
            Object.values(cartDetails).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b">
                <span>{item.name}</span>
                <span>
                  {item.quantity} x ${item.price}
                </span>
              </div>
            ))}
          <button onClick={toggleCart} className="mt-4 bg-gray-200 px-4 py-2 rounded">
            Close Cart
          </button>
        </div>
      </AdvancedSidePanel>
    </div>
  )
}

export default MinimalHero
