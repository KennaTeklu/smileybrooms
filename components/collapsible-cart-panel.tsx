"use client"

import type React from "react"
import { useState } from "react"
import { useCart } from "../context/cart-context"

const CollapsibleCartPanel: React.FC = () => {
  const { cart, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const calculateTotalPrice = () => {
    return cart.items.reduce((total, item) => {
      const roomCount = Object.values(item.rooms || {}).reduce((sum, count) => sum + count, 0)
      return total + item.price * roomCount
    }, 0)
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gray-100 py-3 px-4 cursor-pointer flex justify-between items-center" onClick={togglePanel}>
        <h3 className="text-lg font-semibold">Your Cart</h3>
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {isOpen && (
        <div className="p-4">
          {cart.items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {cart.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Applied to:{" "}
                        {Object.entries(item.rooms || {})
                          .filter(([_, count]) => count > 0)
                          .map(([room, count]) => `${count}x ${room}`)
                          .join(", ")}
                      </p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold">${item.price}</p>
                      <p className="text-xs text-gray-500">per room</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold">Total:</h4>
              <p className="text-xl font-bold">${calculateTotalPrice()}</p>
            </div>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollapsibleCartPanel
