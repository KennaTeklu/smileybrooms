/* Don't modify beyond what is requested ever. */
"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { CartHealthDashboard } from "@/components/cart-health-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, BarChart3, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

export function CartInsightsContent() {
  const { cart } = useCart()
  const [activeTab, setActiveTab] = useState("health")

  // Calculate cart metrics
  const totalItems = cart.totalItems
  const uniqueItems = cart.items.length
  const averagePrice = cart.items.length > 0 ? cart.totalPrice / cart.items.length : 0
  const highestPriceItem =
    cart.items.length > 0 ? cart.items.reduce((prev, current) => (prev.price > current.price ? prev : current)) : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/calculator">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Cart Insights</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="health">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span>Health</span>
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span>Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-6">
          <CartHealthDashboard />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Cart Summary</CardTitle>
                <CardDescription>Overview of your current cart</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Total Items:</dt>
                    <dd className="text-sm font-bold">{totalItems}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Unique Items:</dt>
                    <dd className="text-sm font-bold">{uniqueItems}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Total Value:</dt>
                    <dd className="text-sm font-bold">${cart.totalPrice.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Average Item Price:</dt>
                    <dd className="text-sm font-bold">${averagePrice.toFixed(2)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Item Analysis</CardTitle>
                <CardDescription>Breakdown of cart items</CardDescription>
              </CardHeader>
              <CardContent>
                {cart.items.length > 0 ? (
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Highest Price Item:</dt>
                      <dd className="text-sm font-bold">{highestPriceItem?.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Price:</dt>
                      <dd className="text-sm font-bold">${highestPriceItem?.price.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Items with Quantity &gt; 1:</dt>
                      <dd className="text-sm font-bold">{cart.items.filter((item) => item.quantity > 1).length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Service Types:</dt>
                      <dd className="text-sm font-bold">
                        {new Set(cart.items.map((item) => item.metadata?.serviceType)).size}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your cart is empty. Add items to see metrics.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cart History</CardTitle>
              <CardDescription>Track changes to your cart over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Cart history tracking will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
