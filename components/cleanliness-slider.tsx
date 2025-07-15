"use client"

import type React from "react"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import { Sparkles, Droplet, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

interface CleanlinessLevel {
  value: number
  label: string
  description: string
  image: string
  icon: React.ElementType
}

const cleanlinessLevels: CleanlinessLevel[] = [
  {
    value: 0,
    label: "Lightly Dirty",
    description: "Minor dust, light traffic areas. Quick refresh needed.",
    image: "/images/clean-home.jpg",
    icon: Sparkles,
  },
  {
    value: 50,
    label: "Moderately Dirty",
    description: "Regular build-up, some visible grime. Standard cleaning required.",
    image: "/images/medium-dirty-home.jpg",
    icon: Droplet,
  },
  {
    value: 100,
    label: "Very Dirty",
    description: "Significant grime, heavy dust, neglected areas. Deep cleaning recommended.",
    image: "/images/very-dirty-home.jpg",
    icon: Trash2,
  },
]

export default function CleanlinessSlider() {
  const [sliderValue, setSliderValue] = useState(50)
  const selectedLevel = cleanlinessLevels.find((level) => level.value === sliderValue) || cleanlinessLevels[1] // Default to moderately dirty

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8" />
              How Dirty Is Your Home?
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Adjust the slider to match your home's current cleanliness level for an accurate quote.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="relative w-full max-w-md mx-auto">
              <Slider
                min={0}
                max={100}
                step={50}
                value={[sliderValue]}
                onValueChange={(val) => setSliderValue(val[0])}
                className="w-full"
              />
              <div className="flex justify-between text-sm mt-2">
                {cleanlinessLevels.map((level) => (
                  <span
                    key={level.value}
                    className={`cursor-pointer ${
                      sliderValue === level.value ? "font-semibold text-blue-600" : "text-muted-foreground"
                    }`}
                    onClick={() => setSliderValue(level.value)}
                  >
                    {level.label}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              key={selectedLevel.value} // Key for re-animation on value change
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
            >
              <Image
                src={selectedLevel.image || "/placeholder.svg"}
                alt={selectedLevel.label}
                width={600}
                height={400}
                className="rounded-lg shadow-md mx-auto object-cover w-full h-64"
              />
              <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                <selectedLevel.icon className="h-6 w-6 text-blue-600" />
                {selectedLevel.label}
              </h3>
              <p className="text-lg text-muted-foreground">{selectedLevel.description}</p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
