"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Trash2, MinusCircle, PlusCircle, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleClearCartClick = () => {
    clearCart()
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
  }

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            Your Cart
          </CardTitle>
          <CardDescription>Review your selected cleaning services before proceeding to checkout.</CardDescription>
        </CardHeader>
        <div className="flex justify-end p-6 border-b border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleClearCartClick} disabled={cart.items.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Items
          </Button>
        </div>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[70vh] lg:max-h-[calc(100vh-250px)]">
            <div className="space-y-4 p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {cart.items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 text-gray-500 dark:text-gray-400"
                >
                  <p className="text-lg font-medium mb-2">Your cart is empty.</p>
                  <p>Add some cleaning services to get started!</p>
                  <Button asChild className="mt-6">
                    <Link href="/pricing">Browse Services</Link>
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-4 border p-4 rounded-lg shadow-sm bg-white dark:bg-gray-850"
                    >
                      {item.image && (
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1 grid gap-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        {item.metadata?.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.metadata.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-lg">{formatCurrency(item.price)}</span>
                          <span className="text-gray-500">x</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Subtotal:</span>
            <span>{formatCurrency(cart.totalPrice)}</span>
          </div>
          <Button asChild className="w-full text-lg py-3 bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
