"use client"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useInView } from "react-intersection-observer"

export default function ServiceSelections() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const services = [
    {
      name: "Standard Cleaning",
      price: 99,
      description: "Perfect for regular maintenance cleaning",
      features: ["Dusting all surfaces", "Vacuuming floors", "Kitchen cleaning", "Bathroom sanitizing"],
      popular: false,
    },
    {
      name: "Deep Cleaning",
      price: 199,
      description: "Thorough cleaning for neglected spaces",
      features: [
        "Everything in Standard",
        "Inside cabinet cleaning",
        "Baseboards and trim",
        "Window sills and tracks",
        "Behind appliances",
      ],
      popular: true,
    },
    {
      name: "Move-In/Out",
      price: 299,
      description: "Complete cleaning for moving transitions",
      features: [
        "Everything in Deep Cleaning",
        "Inside oven and fridge",
        "Inside all drawers",
        "Closet cleaning",
        "Wall spot cleaning",
      ],
      popular: false,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section id="service-selections" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Service</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select the perfect cleaning package for your needs
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={item}>
              <Card className={`h-full flex flex-col ${service.popular ? "border-primary shadow-lg" : ""}`}>
                {service.popular && (
                  <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-t-lg w-full text-center">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-3xl font-bold mb-6">${service.price}</div>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Now</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
