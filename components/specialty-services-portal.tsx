"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Clock, DollarSign, Calendar, CheckCircle, ArrowRight } from "lucide-react"

interface SpecialtyService {
  id: string
  name: string
  description: string
  priceRange: string
  timeEstimate: string
  availability: "immediate" | "scheduled" | "limited"
  popular?: boolean
}

export function SpecialtyServicesPortal() {
  const [activeTab, setActiveTab] = useState("emergency")
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const emergencyServices: SpecialtyService[] = [
    {
      id: "emergency-1",
      name: "Water Damage Response",
      description: "Immediate cleanup and drying for water spills, leaks, or flooding incidents.",
      priceRange: "$150-$300",
      timeEstimate: "2-4 hours",
      availability: "immediate",
      popular: true,
    },
    {
      id: "emergency-2",
      name: "Biohazard Cleanup",
      description: "Professional cleaning and sanitization for biohazard situations.",
      priceRange: "$200-$500",
      timeEstimate: "3-6 hours",
      availability: "immediate",
    },
    {
      id: "emergency-3",
      name: "Pet Accident Cleanup",
      description: "Deep cleaning and odor removal for pet accidents on carpets, furniture, or floors.",
      priceRange: "$100-$200",
      timeEstimate: "1-3 hours",
      availability: "immediate",
      popular: true,
    },
    {
      id: "emergency-4",
      name: "Smoke/Fire Damage",
      description: "Cleaning and odor removal for smoke or minor fire damage.",
      priceRange: "$250-$600",
      timeEstimate: "4-8 hours",
      availability: "scheduled",
    },
  ]

  const specializedServices: SpecialtyService[] = [
    {
      id: "specialized-1",
      name: "Post-Construction Clean",
      description: "Comprehensive cleaning after construction or renovation projects.",
      priceRange: "$300-$800",
      timeEstimate: "6-12 hours",
      availability: "scheduled",
      popular: true,
    },
    {
      id: "specialized-2",
      name: "Move-In/Move-Out Deep Clean",
      description: "Thorough cleaning of entire property for moving transitions.",
      priceRange: "$250-$600",
      timeEstimate: "4-10 hours",
      availability: "scheduled",
      popular: true,
    },
    {
      id: "specialized-3",
      name: "Antique Surface Care",
      description: "Specialized cleaning for delicate antique furniture and surfaces.",
      priceRange: "$150-$300",
      timeEstimate: "2-4 hours",
      availability: "limited",
    },
    {
      id: "specialized-4",
      name: "Pet Allergy Deep Treatment",
      description: "Deep cleaning focused on removing pet dander and allergens.",
      priceRange: "$200-$400",
      timeEstimate: "3-6 hours",
      availability: "scheduled",
    },
    {
      id: "specialized-5",
      name: "HVAC Vent Cleaning",
      description: "Cleaning of air vents, returns, and accessible ductwork.",
      priceRange: "$150-$350",
      timeEstimate: "2-5 hours",
      availability: "scheduled",
    },
  ]

  const premiumServices: SpecialtyService[] = [
    {
      id: "premium-1",
      name: "Whole Home Restoration",
      description: "Complete deep cleaning and restoration of all surfaces in your home.",
      priceRange: "$800-$2000",
      timeEstimate: "1-2 days",
      availability: "scheduled",
      popular: true,
    },
    {
      id: "premium-2",
      name: "Smart Home Device Sanitize",
      description: "Specialized cleaning of smart home devices, screens, and electronics.",
      priceRange: "$100-$250",
      timeEstimate: "1-3 hours",
      availability: "scheduled",
    },
    {
      id: "premium-3",
      name: "Chandelier & Lighting Detail",
      description: "Careful cleaning of chandeliers, pendant lights, and complex lighting fixtures.",
      priceRange: "$150-$400",
      timeEstimate: "2-5 hours",
      availability: "limited",
    },
    {
      id: "premium-4",
      name: "Marble & Natural Stone Restoration",
      description: "Professional cleaning and restoration of marble, granite, and natural stone surfaces.",
      priceRange: "$300-$800",
      timeEstimate: "4-10 hours",
      availability: "limited",
      popular: true,
    },
  ]

  const getServicesByTab = () => {
    switch (activeTab) {
      case "emergency":
        return emergencyServices
      case "specialized":
        return specializedServices
      case "premium":
        return premiumServices
      default:
        return emergencyServices
    }
  }

  const getSelectedService = () => {
    if (!selectedService) return null
    return [...emergencyServices, ...specializedServices, ...premiumServices].find((s) => s.id === selectedService)
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "immediate":
        return (
          <Badge variant="default" className="bg-green-500">
            Available Now
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Scheduled
          </Badge>
        )
      case "limited":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Limited Availability
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-2xl">Specialty Services Portal</CardTitle>
        <CardDescription>
          Need specialized cleaning services? Browse our specialty offerings or request a custom quote.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="emergency" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="emergency" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> Emergency
            </TabsTrigger>
            <TabsTrigger value="specialized" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Specialized
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" /> Premium
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getServicesByTab().map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all hover:border-blue-300 ${
                    selectedService === service.id ? "border-blue-500 bg-blue-50" : ""
                  } ${service.popular ? "border-l-4 border-l-blue-500" : ""}`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{service.name}</h3>
                        {service.popular && (
                          <Badge variant="outline" className="mt-1 bg-blue-50">
                            Popular
                          </Badge>
                        )}
                      </div>
                      {getAvailabilityBadge(service.availability)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{service.description}</p>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{service.priceRange}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{service.timeEstimate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Request a Custom Quote</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="service-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <select
                  id="service-type"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={selectedService || ""}
                >
                  <option value="" disabled>
                    Select a service or "Custom"
                  </option>
                  <option value="custom">Custom Service (Describe Below)</option>
                  <optgroup label="Emergency Services">
                    {emergencyServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Specialized Services">
                    {specializedServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Premium Services">
                    {premiumServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description of Needs
                </label>
                <Textarea
                  id="description"
                  placeholder="Please describe your specific cleaning needs..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input id="name" placeholder="Full Name" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input id="phone" placeholder="(123) 456-7890" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>

              <div>
                <label htmlFor="preferred-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date/Time
                </label>
                <Input id="preferred-date" type="datetime-local" />
              </div>

              <Button className="w-full">Request Quote</Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Service Details</h3>
            {selectedService ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-lg">{getSelectedService()?.name}</h4>
                <p className="text-sm text-gray-600 mt-2">{getSelectedService()?.description}</p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="font-medium">Price Range</p>
                      <p className="text-sm text-gray-600">{getSelectedService()?.priceRange}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="font-medium">Time Estimate</p>
                      <p className="text-sm text-gray-600">{getSelectedService()?.timeEstimate}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="font-medium">Availability</p>
                      <p className="text-sm text-gray-600">
                        {getSelectedService()?.availability === "immediate"
                          ? "Available for immediate booking"
                          : getSelectedService()?.availability === "scheduled"
                            ? "Available with scheduled appointment"
                            : "Limited availability, contact for details"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="font-medium mb-2">What's Included</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Professional cleaning specialists</li>
                    <li>Specialized equipment and supplies</li>
                    <li>Detailed service report</li>
                    <li>Follow-up quality check</li>
                    <li>Satisfaction guarantee</li>
                  </ul>
                </div>

                <Button className="mt-6 w-full">Book This Service</Button>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center flex flex-col items-center justify-center h-[400px]">
                <div className="text-gray-400 mb-4">
                  <AlertCircle className="h-12 w-12" />
                </div>
                <h4 className="text-lg font-medium mb-2">No Service Selected</h4>
                <p className="text-sm text-gray-500 mb-4">Select a service from the list to view details</p>
                <Button variant="outline" className="flex items-center gap-1">
                  Browse Services <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
