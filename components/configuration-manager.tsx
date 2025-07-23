"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SavedConfiguration {
  id: string
  name: string
  date: string
  rooms: {
    type: string
    count: number
    tier: string
  }[]
  totalPrice: number
  favorite?: boolean
}

interface ConfigurationManagerProps {
  currentConfig: {
    rooms: {
      type: string
      count: number
      tier: string
    }[]
    totalPrice: number
  }
  onLoadConfig: (config: SavedConfiguration) => void
}

export function ConfigurationManager({ currentConfig, onLoadConfig }: ConfigurationManagerProps) {
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([
    {
      id: "config-1",
      name: "Weekly Standard Clean",
      date: "2023-05-15",
      rooms: [
        { type: "Living Room", count: 1, tier: "DEEP CLEAN" },
        { type: "Kitchen", count: 1, tier: "DEEP CLEAN" },
        { type: "Bathroom", count: 2, tier: "QUICK CLEAN" },
        { type: "Bedroom", count: 3, tier: "QUICK CLEAN" },
      ],
      totalPrice: 245.0,
      favorite: true,
    },
    {
      id: "config-2",
      name: "Monthly Deep Clean",
      date: "2023-04-20",
      rooms: [
        { type: "Living Room", count: 1, tier: "PREMIUM" },
        { type: "Kitchen", count: 1, tier: "PREMIUM" },
        { type: "Bathroom", count: 2, tier: "DEEP CLEAN" },
        { type: "Bedroom", count: 3, tier: "DEEP CLEAN" },
        { type: "Dining Room", count: 1, tier: "DEEP CLEAN" },
      ],
      totalPrice: 495.0,
    },
    {
      id: "config-3",
      name: "Guest Room Prep",
      date: "2023-03-10",
      rooms: [
        { type: "Bedroom", count: 1, tier: "PREMIUM" },
        { type: "Bathroom", count: 1, tier: "PREMIUM" },
      ],
      totalPrice: 175.0,
    },
  ])

  const [newConfigName, setNewConfigName] = useState("")
  const [editingConfig, setEditingConfig] = useState<SavedConfiguration | null>(null)

  const handleSaveConfig = () => {
    if (!newConfigName.trim()) return

    const newConfig: SavedConfiguration = {
      id: `config-${Date.now()}`,
      name: newConfigName,
      date: new Date().toISOString().split("T")[0],
      rooms: currentConfig.rooms,
      totalPrice: currentConfig.totalPrice,
    }

    setSavedConfigs([newConfig, ...savedConfigs])
    setNewConfigName("")
  }

  const handleDeleteConfig = (id: string) => {
    setSavedConfigs(savedConfigs.filter((config) => config.id !== id))
  }

  const handleToggleFavorite = (id: string) => {
    setSavedConfigs(
      savedConfigs.map((config) => (config.id === id ? { ...config, favorite: !config.favorite } : config)),
    )
  }

  const handleUpdateConfig = () => {
    if (!editingConfig) return

    setSavedConfigs(savedConfigs.map((config) => (config.id === editingConfig.id ? editingConfig : config)))

    setEditingConfig(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuration Manager</CardTitle>
        <CardDescription>Save and load your cleaning configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Removed "Save Current Configuration" section */}
          {/* Removed Separator */}
          {/* Removed "Saved Configurations" section */}
        </div>
      </CardContent>
    </Card>
  )
}
