"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { SERVICES } from "@/lib/constants"

export function SalesServiceCards() {
  const router = useRouter()
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const services = SERVICES.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    image: service.image,
    price: service.price,
    features: service.features,
    rating: 4.9,
    reviewCount: Math.floor(Math.random() * 200) + 100,
    popular: service.id === "deep-cleaning",
  }))

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
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400"
          >
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Professional Cleaning Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose from our range of professional cleaning services tailored to your needs
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                className={`h-full flex flex-col transition-all duration-300 overflow-hidden ${
                  hoveredService === service.id
                    ? "shadow-xl border-indigo-300 dark:border-indigo-700 transform -translate-y-1"
                    : "shadow-md border-gray-200 dark:border-gray-800"
                }`}
              >
                {/* Image container */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      hoveredService === service.id ? "scale-110" : "scale-100"
                    }`}
                  />
                  {service.popular && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="flex-grow p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{service.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-300 dark:text-gray-700">|</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{service.reviewCount} reviews</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>

                  <div className="mt-auto">
                    <div className="flex items-baseline mb-4">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">${service.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">/ service</span>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button
                    onClick={() => handleBookService(service.id)}
                    className={`w-full group ${
                      hoveredService === service.id
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 hover:border-indigo-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-indigo-400 dark:border-indigo-800"
                    }`}
                  >
                    Book Service
                    <ArrowRight
                      className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                        hoveredService === service.id ? "group-hover:translate-x-1" : ""
                      }`}
                    />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-gray-800"
            onClick={() => router.push("/services")}
          >
            View All Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
