"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SERVICES } from "@/lib/constants"
import { formatCurrency } from "@/lib/utils"
import { Check } from "lucide-react"

export function ServiceDetailsModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          View Service Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Our Cleaning Services</DialogTitle>
          <DialogDescription>Detailed information about each of our cleaning services</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={SERVICES[0].id} className="mt-6">
          <TabsList className="grid grid-cols-3">
            {SERVICES.slice(0, 3).map((service) => (
              <TabsTrigger key={service.id} value={service.id}>
                {service.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {SERVICES.slice(0, 3).map((service) => (
            <TabsContent key={service.id} value={service.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-primary mb-4">{formatCurrency(service.price)}</div>
                  <h4 className="font-semibold mb-2">What's Included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
