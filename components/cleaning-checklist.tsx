"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ListChecks, Home, Bath, Bed, Utensils, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface ChecklistCategory {
  name: string
  icon: React.ElementType
  items: string[]
}

const cleaningChecklist: ChecklistCategory[] = [
  {
    name: "General Cleaning (All Rooms)",
    icon: Home,
    items: [
      "Dust all accessible surfaces",
      "Wipe down light fixtures and ceiling fans",
      "Empty trash cans and replace liners",
      "Vacuum/mop all floors",
      "Clean mirrors and glass surfaces",
      "Wipe down baseboards",
      "Clean and sanitize door handles and light switches",
    ],
  },
  {
    name: "Bathrooms",
    icon: Bath,
    items: [
      "Clean and sanitize toilets, sinks, and showers/tubs",
      "Wipe down countertops and cabinets",
      "Shine chrome fixtures",
      "Clean and disinfect floors",
      "Empty trash",
    ],
  },
  {
    name: "Bedrooms",
    icon: Bed,
    items: [
      "Dust all accessible surfaces",
      "Make beds (if linens are provided)",
      "Vacuum/mop floors",
      "Empty trash",
      "Wipe down reachable window sills",
    ],
  },
  {
    name: "Kitchen",
    icon: Utensils,
    items: [
      "Clean and sanitize countertops and sink",
      "Wipe down exterior of appliances (microwave, oven, fridge)",
      "Clean stovetop",
      "Wipe down cabinet exteriors",
      "Vacuum/mop floor",
      "Empty trash",
    ],
  },
  {
    name: "Deep Cleaning Add-ons (Optional)",
    icon: Sparkles,
    items: [
      "Inside oven cleaning",
      "Inside refrigerator cleaning",
      "Interior window cleaning",
      "Wall spot cleaning",
      "Baseboard scrubbing",
      "Cabinet interior cleaning",
      "Blinds cleaning",
    ],
  },
]

export default function CleaningChecklist() {
  const [checkedItems, setCheckedItems] = useState<string[]>([])

  const handleCheck = (item: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedItems((prev) => [...prev, item])
    } else {
      setCheckedItems((prev) => prev.filter((i) => i !== item))
    }
  }

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <ListChecks className="h-8 w-8" />
              Our Cleaning Checklist
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              See what's included in our standard cleaning service and optional add-ons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <Accordion type="multiple" className="w-full">
              {cleaningChecklist.map((category, catIndex) => {
                const Icon = category.icon
                return (
                  <motion.div
                    key={catIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                  >
                    <AccordionItem value={`item-${catIndex}`}>
                      <AccordionTrigger className="text-lg font-semibold flex items-center gap-3">
                        <Icon className="h-5 w-5 text-blue-600" />
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 p-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-3">
                            <Checkbox
                              id={`item-${catIndex}-${itemIndex}`}
                              checked={checkedItems.includes(item)}
                              onCheckedChange={(checked) => handleCheck(item, checked as boolean)}
                            />
                            <Label htmlFor={`item-${catIndex}-${itemIndex}`} className="text-base font-normal">
                              {item}
                            </Label>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                )
              })}
            </Accordion>
            <p className="text-sm text-center text-muted-foreground mt-8">
              This checklist provides a general overview. Specific services may vary based on your chosen package and
              property condition.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
