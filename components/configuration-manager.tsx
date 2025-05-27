"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, Download, Trash2, Star, Clock, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([])

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
          <div>
            <h3 className="text-lg font-medium mb-4">Save Current Configuration</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Configuration name"
                value={newConfigName}
                onChange={(e) => setNewConfigName(e.target.value)}
              />
              <Button onClick={handleSaveConfig} disabled={!newConfigName.trim()}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Saved Configurations</h3>

            {savedConfigs.length === 0 ? (
              <div className="text-center p-6 border rounded-md bg-gray-50">
                <p className="text-gray-500">No saved configurations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedConfigs.map((config) => (
                  <Card key={config.id} className={config.favorite ? "border-blue-200" : ""}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{config.name}</h4>
                            {config.favorite && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                <Star className="h-3 w-3 mr-1 fill-current" /> Favorite
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Saved on {config.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(config.id)}>
                            <Star
                              className={`h-4 w-4 ${config.favorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                            />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4 text-gray-400" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Configuration</DialogTitle>
                                <DialogDescription>Update your saved configuration details</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="config-name">Configuration Name</Label>
                                  <Input
                                    id="config-name"
                                    value={editingConfig?.name || config.name}
                                    onChange={(e) =>
                                      setEditingConfig({
                                        ...config,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div>
                                  <Label>Rooms</Label>
                                  <div className="mt-2 space-y-2">
                                    {config.rooms.map((room, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between items-center p-2 border rounded-md"
                                      >
                                        <span>
                                          {room.count} x {room.type} ({room.tier})
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingConfig(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateConfig}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button variant="ghost" size="icon" onClick={() => handleDeleteConfig(config.id)}>
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {config.rooms.map((room, index) => (
                            <Badge key={index} variant="outline">
                              {room.count} x {room.type} ({room.tier})
                            </Badge>
                          ))}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-medium">${config.totalPrice.toFixed(2)}</span>
                          <Button variant="outline" size="sm" onClick={() => onLoadConfig(config)}>
                            <Download className="h-4 w-4 mr-2" /> Load
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
