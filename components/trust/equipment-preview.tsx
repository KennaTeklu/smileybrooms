"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Wrench, Droplets, Zap, Leaf, CheckCircle } from "lucide-react"

interface EquipmentItem {
  id: string
  name: string
  category: "vacuum" | "chemical" | "tool" | "safety"
  brand: string
  ecoFriendly: boolean
  description: string
  image: string
}

interface EquipmentPreviewProps {
  modal?: boolean
  compact?: boolean
}

export function EquipmentPreview({ modal = true, compact = false }: EquipmentPreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const equipment: EquipmentItem[] = [
    {
      id: "1",
      name: "HEPA Vacuum System",
      category: "vacuum",
      brand: "Shark Professional",
      ecoFriendly: true,
      description: "Hospital-grade HEPA filtration removes 99.97% of allergens",
      image: "/professional-vacuum.png",
    },
    {
      id: "2",
      name: "Eco-Safe All-Purpose Cleaner",
      category: "chemical",
      brand: "Method",
      ecoFriendly: true,
      description: "Plant-based formula, safe for pets and children",
      image: "/placeholder-gjl3r.png",
    },
    {
      id: "3",
      name: "Microfiber Cleaning System",
      category: "tool",
      brand: "Norwex",
      ecoFriendly: true,
      description: "Removes 99% of bacteria with just water",
      image: "/microfiber-cloths.png",
    },
    {
      id: "4",
      name: "UV Sanitizing Wand",
      category: "tool",
      brand: "CleanSlate",
      ecoFriendly: true,
      description: "Chemical-free sanitization using UV-C light",
      image: "/uv-sanitizer.png",
    },
  ]

  const categories = [
    { id: "all", label: "All Equipment", icon: Wrench },
    { id: "vacuum", label: "Vacuums", icon: Zap },
    { id: "chemical", label: "Cleaners", icon: Droplets },
    { id: "tool", label: "Tools", icon: Wrench },
    { id: "safety", label: "Safety", icon: CheckCircle },
  ]

  const filteredEquipment =
    selectedCategory === "all" ? equipment : equipment.filter((item) => item.category === selectedCategory)

  const EquipmentGrid = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center space-x-1"
            >
              <IconComponent className="h-3 w-3" />
              <span>{category.label}</span>
            </Button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    {item.ecoFriendly && (
                      <Badge variant="outline" className="text-xs">
                        <Leaf className="h-3 w-3 mr-1" />
                        Eco
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{item.brand}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Wrench className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Professional equipment & eco-friendly supplies</span>
        {modal && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" size="sm" className="p-0 h-auto">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Our Professional Equipment</DialogTitle>
                <DialogDescription>
                  We use only the best professional-grade equipment and eco-friendly supplies
                </DialogDescription>
              </DialogHeader>
              <EquipmentGrid />
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }

  if (modal) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Wrench className="h-4 w-4 mr-2" />
            View Our Equipment
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Our Professional Equipment</DialogTitle>
            <DialogDescription>
              We use only the best professional-grade equipment and eco-friendly supplies
            </DialogDescription>
          </DialogHeader>
          <EquipmentGrid />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wrench className="h-5 w-5" />
          <span>Our Professional Equipment</span>
        </CardTitle>
        <CardDescription>We use only the best professional-grade equipment and eco-friendly supplies</CardDescription>
      </CardHeader>
      <CardContent>
        <EquipmentGrid />
      </CardContent>
    </Card>
  )
}
