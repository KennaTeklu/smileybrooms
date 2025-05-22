"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Home, Heart, BookmarkIcon, ShoppingCart } from "lucide-react"
import { useEnhancedCart, type CartListType } from "@/lib/enhanced-cart-context"
import { formatCurrency } from "@/lib/utils"

interface CartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  listType: CartListType
  onMove: (id: string, fromList: CartListType, toList: CartListType) => void
  onRemove: (id: string, listType: CartListType) => void
  onUpdateQuantity: (id: string, quantity: number, listType: CartListType) => void
}

const CartItem = ({
  id,
  name,
  price,
  quantity,
  image,
  listType,
  onMove,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const moveOptions: { label: string; value: CartListType; icon: React.ReactNode }[] = [
    { label: "Main Cart", value: "main", icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
    { label: "Business", value: "business", icon: <Briefcase className="h-4 w-4 mr-2" /> },
    { label: "Personal", value: "personal", icon: <Home className="h-4 w-4 mr-2" /> },
    { label: "Wishlist", value: "wishlist", icon: <Heart className="h-4 w-4 mr-2" /> },
    { label: "Save for Later", value: "saved", icon: <BookmarkIcon className="h-4 w-4 mr-2" /> },
  ].filter((option) => option.value !== listType)

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      {image && (
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{name}</h4>
        <div className="flex items-center mt-1">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1), listType)}
            >
              -
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onUpdateQuantity(id, quantity + 1, listType)}
            >
              +
            </Button>
          </div>
          <div className="ml-auto text-sm font-medium">{formatCurrency(price * quantity)}</div>
        </div>
      </div>
      <div className="relative">
        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-muted-foreground">
          •••
        </Button>
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 z-10 border">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Move to</div>
              {moveOptions.map((option) => (
                <button
                  key={option.value}
                  className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    onMove(id, listType, option.value)
                    setIsMenuOpen(false)
                  }}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
              <div className="border-t my-1"></div>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  onRemove(id, listType)
                  setIsMenuOpen(false)
                }}
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function MultiListCart() {
  const { cart, removeItem, updateQuantity, moveItem, setActiveList, clearList, getListCount, getListTotal } =
    useEnhancedCart()

  const listConfig: Record<CartListType, { label: string; icon: React.ReactNode; emptyMessage: string }> = {
    main: {
      label: "Main Cart",
      icon: <ShoppingCart className="h-4 w-4" />,
      emptyMessage: "Your cart is empty",
    },
    business: {
      label: "Business",
      icon: <Briefcase className="h-4 w-4" />,
      emptyMessage: "No business items yet",
    },
    personal: {
      label: "Personal",
      icon: <Home className="h-4 w-4" />,
      emptyMessage: "No personal items yet",
    },
    wishlist: {
      label: "Wishlist",
      icon: <Heart className="h-4 w-4" />,
      emptyMessage: "Your wishlist is empty",
    },
    saved: {
      label: "Saved",
      icon: <BookmarkIcon className="h-4 w-4" />,
      emptyMessage: "No saved items",
    },
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs
        defaultValue={cart.activeList}
        onValueChange={(value) => setActiveList(value as CartListType)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-4">
          {(Object.keys(listConfig) as CartListType[]).map((listType) => {
            const count = getListCount(listType)
            return (
              <TabsTrigger key={listType} value={listType} className="relative">
                <span className="flex items-center">
                  {listConfig[listType].icon}
                  <span className="hidden sm:inline ml-2">{listConfig[listType].label}</span>
                </span>
                {count > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {(Object.keys(listConfig) as CartListType[]).map((listType) => (
          <TabsContent key={listType} value={listType} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                {listConfig[listType].icon}
                <span className="ml-2">{listConfig[listType].label}</span>
              </h3>
              {getListCount(listType) > 0 && (
                <Button variant="outline" size="sm" onClick={() => clearList(listType)}>
                  Clear
                </Button>
              )}
            </div>

            {cart.lists[listType].length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">{listConfig[listType].emptyMessage}</div>
            ) : (
              <div>
                <div className="space-y-1">
                  {cart.lists[listType].map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      quantity={item.quantity}
                      image={item.image}
                      listType={listType}
                      onMove={moveItem}
                      onRemove={removeItem}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getListTotal(listType))}</span>
                  </div>
                  {listType === "main" && <Button className="w-full mt-4">Proceed to Checkout</Button>}
                  {listType === "wishlist" && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        cart.lists[listType].forEach((item) => {
                          moveItem(item.id, listType, "main")
                        })
                      }}
                    >
                      Move All to Cart
                    </Button>
                  )}
                  {listType === "saved" && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        cart.lists[listType].forEach((item) => {
                          moveItem(item.id, listType, "main")
                        })
                      }}
                    >
                      Restore All Items
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
