"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

type FilterableService = {
  id: string
  name: string
  description: string
  price: number
  popular: boolean
}

const sampleServices: FilterableService[] = [
  { id: "s1", name: "Basic Home Clean", description: "Standard cleaning for all rooms.", price: 120, popular: true },
  { id: "s2", name: "Deep Kitchen Clean", description: "Intensive cleaning for kitchens.", price: 80, popular: false },
  { id: "s3", name: "Bathroom Refresh", description: "Quick clean for bathrooms.", price: 50, popular: true },
  {
    id: "s4",
    name: "Move-in/out Clean",
    description: "Comprehensive cleaning for new homes.",
    price: 300,
    popular: false,
  },
  {
    id: "s5",
    name: "Office Space Clean",
    description: "Regular cleaning for small offices.",
    price: 150,
    popular: true,
  },
  {
    id: "s6",
    name: "Window Washing",
    description: "Exterior and interior window cleaning.",
    price: 75,
    popular: false,
  },
  { id: "s7", name: "Carpet Steam Clean", description: "Deep steam cleaning for carpets.", price: 100, popular: true },
]

export default function AdvancedSearchFilter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300])
  const [showPopularOnly, setShowPopularOnly] = useState(false)

  const filteredServices = useMemo(() => {
    return sampleServices.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1]
      const matchesPopular = !showPopularOnly || service.popular

      return matchesSearch && matchesPrice && matchesPopular
    })
  }, [searchTerm, priceRange, showPopularOnly])

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Find Your Perfect Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Column */}
          <Card className="md:col-span-1 p-4">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Refine your service search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Input */}
              <div>
                <Label htmlFor="search">Search Services</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="e.g., kitchen, deep clean"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Price Range Slider */}
              <div>
                <Label>
                  Price Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </Label>
                <Slider
                  min={0}
                  max={300}
                  step={10}
                  value={priceRange}
                  onValueChange={(value: number[]) => setPriceRange(value as [number, number])}
                  className="mt-3"
                />
              </div>

              {/* Popular Services Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="popular"
                  checked={showPopularOnly}
                  onCheckedChange={(checked: boolean) => setShowPopularOnly(checked)}
                />
                <Label htmlFor="popular">Show Popular Services Only</Label>
              </div>
            </CardContent>
          </Card>

          {/* Results Column */}
          <div className="md:col-span-3 grid gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold">{formatCurrency(service.price)}</div>
                    {service.popular && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary-foreground text-primary rounded-full">
                        Popular
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full text-center p-8">
                <CardTitle>No Services Found</CardTitle>
                <CardDescription>Try adjusting your search or filters.</CardDescription>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
