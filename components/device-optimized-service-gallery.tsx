"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useDeviceDetection } from "@/lib/device-detection"
import Image from "next/image"

const services = [
  {
    id: 1,
    title: "Deep Kitchen Clean",
    image: "/images/kitchen-professional.png",
    video: "/videos/kitchen-clean.mp4",
  },
  {
    id: 2,
    title: "Bathroom Sanitization",
    image: "/images/bathroom-professional.png",
    video: "/videos/bathroom-clean.mp4",
  },
  {
    id: 3,
    title: "Living Room Detail",
    image: "/images/living-room-professional.png",
    video: "/videos/living-room-clean.mp4",
  },
]

export function DeviceOptimizedServiceGallery() {
  const device = useDeviceDetection()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length)
  }

  if (device.isMobile) {
    return (
      <div className="w-full">
        <div className="relative overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {services.map((service) => (
              <div key={service.id} className="w-full flex-shrink-0">
                <Card>
                  <CardContent className="p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-16 w-16 rounded-full"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Touch-friendly navigation dots */}
        <div className="flex justify-center gap-2 mt-4">
          {services.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card key={service.id} className="group hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{service.title}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
