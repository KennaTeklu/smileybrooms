"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Home, TrendingUp, Building } from "lucide-react"
import { useRouter } from "next/navigation"

interface Service {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  price: string
  popular?: boolean
  features: string[]
}

export default function ServiceCards() {
  const router = useRouter()
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const services: Service[] = [
    {
      id: "regular",
      name: "Regular Cleaning",
      description: "Our standard cleaning service for homes that need regular maintenance.",
      icon: <Home className="h-6 w-6" />,
      price: "$120",
      popular: true,
      features: [
        "Dusting all accessible surfaces",
        "Vacuuming carpets and floors",
        "Mopping hard floors",
        "Cleaning kitchen surfaces",
        "Cleaning bathrooms",
      ],
    },
    {
      id: "deep",
      name: "Deep Cleaning",
      description: "Thorough cleaning for homes that need extra attention to detail.",
      icon: <TrendingUp className="h-6 w-6" />,
      price: "$220",
      features: [
        "All regular cleaning services",
        "Inside cabinet cleaning",
        "Inside oven and refrigerator",
        "Baseboards and door frames",
        "Window sills and tracks",
        "Light fixtures and ceiling fans",
      ],
    },
    {
      id: "move",
      name: "Move In/Out Cleaning",
      description: "Comprehensive cleaning for when you're moving in or out of a property.",
      icon: <Sparkles className="h-6 w-6" />,
      price: "$320",
      features: [
        "All deep cleaning services",
        "Inside all cabinets and drawers",
        "Inside all appliances",
        "Wall spot cleaning",
        "Garage sweeping",
        "Window cleaning",
      ],
    },
    {
      id: "office",
      name: "Office Cleaning",
      description: "Professional cleaning services for office spaces and commercial properties.",
      icon: <Building className="h-6 w-6" />,
      price: "Custom",
      features: [
        "Reception and common areas",
        "Workstations and desks",
        "Meeting rooms",
        "Kitchen and break areas",
        "Restrooms",
        "Trash removal",
      ],
    },
  ]

  const handleBookService = (serviceId: string) => {
    router.push(`/pricing?service=${serviceId}`)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Cleaning Services</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from our range of professional cleaning services tailored to your needs.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={item}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              className="h-full"
            >
              <Card
                className={`h-full flex flex-col transition-all duration-300 ${
                  hoveredService === service.id
                    ? "shadow-lg border-primary/50 transform -translate-y-1"
                    : "shadow border-gray-200 dark:border-gray-800"
                }`}
              >
                <CardContent className="pt-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-lg ${
                        hoveredService === service.id ? "bg-primary/20" : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      {service.icon}
                    </div>
                    {service.popular && <Badge className="bg-green-500 hover:bg-green-600">Popular</Badge>}
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>

                  <div className="mt-auto">
                    <div className="flex items-baseline mb-4">
                      <span className="text-2xl font-bold">{service.price}</span>
                      {service.price !== "Custom" && (
                        <span className="text-gray-500 dark:text-gray-400 ml-1">/ service</span>
                      )}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="h-5 w-5 text-green-500 flex-shrink-0">✓</span>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    onClick={() => handleBookService(service.id)}
                    className={`w-full ${
                      hoveredService === service.id
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    }`}
                  >
                    Book Service
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
