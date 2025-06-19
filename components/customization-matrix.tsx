/* Don't modify beyond what is requested ever. */
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Info, Plus, Minus, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface MatrixService {
  id: string
  name: string
  price: number
  description: string
  compatibility?: {
    requires?: string[]
    conflicts?: string[]
    recommendedWith?: string[]
  }
  category: "add" | "remove"
}

export interface CustomizationMatrixProps {
  roomName: string
  selectedTier: string
  addServices: MatrixService[]
  removeServices: MatrixService[]
  onSelectionChange: (selection: { addServices: string[]; removeServices: string[] }) => void
  initialSelection?: { addServices: string[]; removeServices: string[] }
}

export function CustomizationMatrix({
  roomName,
  selectedTier,
  addServices,
  removeServices,
  onSelectionChange,
  initialSelection = { addServices: [], removeServices: [] },
}: CustomizationMatrixProps) {
  const [selectedAddServices, setSelectedAddServices] = useState<string[]>(initialSelection.addServices)
  const [selectedRemoveServices, setSelectedRemoveServices] = useState<string[]>(initialSelection.removeServices)

  // Check if a service has compatibility issues
  const hasCompatibilityIssue = (service: MatrixService): boolean => {
    if (!service.compatibility) return false

    // Check if required services are selected
    if (service.compatibility.requires?.length) {
      const missingRequirements = service.compatibility.requires.filter((reqId) => !selectedAddServices.includes(reqId))
      if (missingRequirements.length > 0) return true
    }

    // Check for conflicts
    if (service.compatibility.conflicts?.length) {
      const conflicts = service.compatibility.conflicts.filter(
        (conflictId) => selectedAddServices.includes(conflictId) || selectedRemoveServices.includes(conflictId),
      )
      if (conflicts.length > 0) return true
    }

    return false
  }

  // Get compatibility message for a service
  const getCompatibilityMessage = (service: MatrixService): string => {
    if (!service.compatibility) return ""

    const messages: string[] = []

    // Required services
    if (service.compatibility.requires?.length) {
      const missingRequirements = service.compatibility.requires.filter((reqId) => !selectedAddServices.includes(reqId))
      if (missingRequirements.length > 0) {
        const requiredServices = missingRequirements.map(
          (reqId) => addServices.find((s) => s.id === reqId)?.name || "Unknown service",
        )
        messages.push(`Requires: ${requiredServices.join(", ")}`)
      }
    }

    // Conflicts
    if (service.compatibility.conflicts?.length) {
      const conflicts = service.compatibility.conflicts.filter(
        (conflictId) => selectedAddServices.includes(conflictId) || selectedRemoveServices.includes(conflictId),
      )
      if (conflicts.length > 0) {
        const conflictingServices = conflicts.map((conflictId) => {
          const addService = addServices.find((s) => s.id === conflictId)
          const removeService = removeServices.find((s) => s.id === conflictId)
          return addService?.name || removeService?.name || "Unknown service"
        })
        messages.push(`Conflicts with: ${conflictingServices.join(", ")}`)
      }
    }

    return messages.join(". ")
  }

  // Handle add service selection
  const handleAddServiceChange = (serviceId: string, checked: boolean) => {
    let newSelection: string[]

    if (checked) {
      newSelection = [...selectedAddServices, serviceId]
    } else {
      newSelection = selectedAddServices.filter((id) => id !== serviceId)
    }

    setSelectedAddServices(newSelection)
    onSelectionChange({
      addServices: newSelection,
      removeServices: selectedRemoveServices,
    })
  }

  // Handle remove service selection
  const handleRemoveServiceChange = (serviceId: string, checked: boolean) => {
    let newSelection: string[]

    if (checked) {
      newSelection = [...selectedRemoveServices, serviceId]
    } else {
      newSelection = selectedRemoveServices.filter((id) => id !== serviceId)
    }

    setSelectedRemoveServices(newSelection)
    onSelectionChange({
      addServices: selectedAddServices,
      removeServices: newSelection,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Customization Matrix: {roomName}</span>
          <Badge variant="outline">{selectedTier}</Badge>
        </CardTitle>
        <CardDescription>Fine-tune your cleaning service by adding or removing specific tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="add" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Services
            </TabsTrigger>
            <TabsTrigger value="remove" className="flex items-center gap-1">
              <Minus className="h-4 w-4" /> Remove Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addServices.map((service) => {
                const hasIssue = hasCompatibilityIssue(service)
                const compatibilityMessage = getCompatibilityMessage(service)

                return (
                  <div
                    key={service.id}
                    className={`p-4 border rounded-lg ${
                      selectedAddServices.includes(service.id)
                        ? "border-green-500 bg-green-50"
                        : hasIssue
                          ? "border-amber-300 bg-amber-50"
                          : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start">
                      <Checkbox
                        id={`add-${service.id}`}
                        checked={selectedAddServices.includes(service.id)}
                        onCheckedChange={(checked) => handleAddServiceChange(service.id, checked === true)}
                        disabled={hasIssue}
                        className="mt-1"
                      />
                      <div className="ml-3 w-full">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor={`add-${service.id}`}
                            className={`font-medium ${hasIssue ? "text-gray-400" : ""}`}
                          >
                            {service.name}
                          </Label>
                          <Badge variant="outline" className="ml-2">
                            +${service.price.toFixed(2)}
                          </Badge>
                        </div>
                        <p className={`text-sm mt-1 ${hasIssue ? "text-gray-400" : "text-gray-500"}`}>
                          {service.description}
                        </p>

                        {hasIssue && (
                          <div className="mt-2 flex items-center text-xs text-amber-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {compatibilityMessage}
                          </div>
                        )}

                        {service.compatibility?.recommendedWith &&
                          selectedAddServices.some((id) => service.compatibility?.recommendedWith?.includes(id)) && (
                            <div className="mt-2 flex items-center text-xs text-green-600">
                              <Info className="h-3 w-3 mr-1" />
                              Recommended with your current selections
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="remove" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {removeServices.map((service) => {
                const hasIssue = hasCompatibilityIssue(service)
                const compatibilityMessage = getCompatibilityMessage(service)

                return (
                  <div
                    key={service.id}
                    className={`p-4 border rounded-lg ${
                      selectedRemoveServices.includes(service.id)
                        ? "border-red-500 bg-red-50"
                        : hasIssue
                          ? "border-amber-300 bg-amber-50"
                          : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start">
                      <Checkbox
                        id={`remove-${service.id}`}
                        checked={selectedRemoveServices.includes(service.id)}
                        onCheckedChange={(checked) => handleRemoveServiceChange(service.id, checked === true)}
                        disabled={hasIssue}
                        className="mt-1"
                      />
                      <div className="ml-3 w-full">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor={`remove-${service.id}`}
                            className={`font-medium ${hasIssue ? "text-gray-400" : ""}`}
                          >
                            {service.name}
                          </Label>
                          <Badge variant="outline" className="ml-2 text-red-500">
                            -${service.price.toFixed(2)}
                          </Badge>
                        </div>
                        <p className={`text-sm mt-1 ${hasIssue ? "text-gray-400" : "text-gray-500"}`}>
                          {service.description}
                        </p>

                        {hasIssue && (
                          <div className="mt-2 flex items-center text-xs text-amber-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {compatibilityMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-medium mb-1">Selected Customizations</h4>
            <div className="flex flex-wrap gap-2">
              {selectedAddServices.length === 0 && selectedRemoveServices.length === 0 ? (
                <span className="text-sm text-gray-500">No customizations selected</span>
              ) : (
                <>
                  {selectedAddServices.map((serviceId) => {
                    const service = addServices.find((s) => s.id === serviceId)
                    if (!service) return null
                    return (
                      <TooltipProvider key={serviceId}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              + {service.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{service.description}</p>
                            <p className="font-bold mt-1">+${service.price.toFixed(2)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                  {selectedRemoveServices.map((serviceId) => {
                    const service = removeServices.find((s) => s.id === serviceId)
                    if (!service) return null
                    return (
                      <TooltipProvider key={serviceId}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                              - {service.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{service.description}</p>
                            <p className="font-bold mt-1">-${service.price.toFixed(2)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            View Service Map
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
