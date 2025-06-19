/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
/* Don't modify beyond what is requested ever. */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Home, Sparkles } from "lucide-react"

interface CleaningTimeEstimatorProps {
  roomCounts: Record<string, number>
  selectedTiers: Record<string, string>
  totalAddOns: number
}

export function CleaningTimeEstimator({ roomCounts, selectedTiers, totalAddOns }: CleaningTimeEstimatorProps) {
  const [dirtinessLevel, setDirtinessLevel] = useState(2) // 1-5 scale
  const [cleaners, setCleaners] = useState(2) // Default 2 cleaners
  const [estimatedTime, setEstimatedTime] = useState({ min: 0, max: 0 })
  const [efficiency, setEfficiency] = useState(100) // Percentage

  // Calculate estimated cleaning time
  useEffect(() => {
    // Base time per room type (in minutes)
    const baseTimePerRoom: Record<string, number> = {
      bedroom: 15,
      bathroom: 20,
      kitchen: 30,
      livingRoom: 20,
      diningRoom: 15,
      homeOffice: 15,
      laundryRoom: 10,
      entryway: 10,
      hallway: 10,
      stairs: 15,
    }

    // Tier multipliers
    const tierMultipliers: Record<string, number> = {
      "QUICK CLEAN": 1,
      "DEEP CLEAN": 1.5,
      PREMIUM: 2,
    }

    // Calculate total base time
    let totalBaseTime = 0
    Object.entries(roomCounts).forEach(([roomType, count]) => {
      if (count > 0) {
        const baseTime = baseTimePerRoom[roomType] || 15
        const tierMultiplier = tierMultipliers[selectedTiers[roomType] || "QUICK CLEAN"]
        totalBaseTime += baseTime * count * tierMultiplier
      }
    })

    // Add time for add-ons (5 minutes per add-on)
    totalBaseTime += totalAddOns * 5

    // Adjust for dirtiness level (1-5 scale)
    const dirtinessMultiplier = 0.8 + dirtinessLevel * 0.1
    totalBaseTime *= dirtinessMultiplier

    // Adjust for efficiency
    totalBaseTime = totalBaseTime * (100 / efficiency)

    // Divide by number of cleaners
    const adjustedTime = totalBaseTime / cleaners

    // Add setup and cleanup time (15 minutes)
    const totalTime = adjustedTime + 15

    // Set min and max estimates (±10%)
    const min = Math.max(60, Math.round(totalTime * 0.9))
    const max = Math.round(totalTime * 1.1)

    setEstimatedTime({ min, max })
  }, [roomCounts, selectedTiers, totalAddOns, dirtinessLevel, cleaners, efficiency])

  // Convert minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours > 0 ? `${hours}h ` : ""}${mins}m`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" /> Cleaning Time Estimator
        </CardTitle>
        <CardDescription>Estimate how long your cleaning service will take</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Home Cleanliness Level</label>
            <Badge variant={dirtinessLevel <= 2 ? "default" : dirtinessLevel <= 4 ? "secondary" : "destructive"}>
              {dirtinessLevel === 1
                ? "Very Clean"
                : dirtinessLevel === 2
                  ? "Clean"
                  : dirtinessLevel === 3
                    ? "Average"
                    : dirtinessLevel === 4
                      ? "Dirty"
                      : "Very Dirty"}
            </Badge>
          </div>
          <Slider
            value={[dirtinessLevel]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setDirtinessLevel(value[0])}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Very Clean</span>
            <span>Average</span>
            <span>Very Dirty</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Number of Cleaners</label>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{cleaners}</span>
            </div>
          </div>
          <Slider
            value={[cleaners]}
            min={1}
            max={4}
            step={1}
            onValueChange={(value) => setCleaners(value[0])}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 Cleaner</span>
            <span>2 Cleaners</span>
            <span>4 Cleaners</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Cleaning Efficiency</label>
            <Badge variant="outline">{efficiency}%</Badge>
          </div>
          <Slider
            value={[efficiency]}
            min={80}
            max={120}
            step={5}
            onValueChange={(value) => setEfficiency(value[0])}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Thorough</span>
            <span>Standard</span>
            <span>Express</span>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Estimated Time</span>
            </div>
            <div className="text-xl font-bold">
              {formatTime(estimatedTime.min)} - {formatTime(estimatedTime.max)}
            </div>
          </div>

          <Progress value={Math.min(100, (estimatedTime.min / 180) * 100)} className="h-2" />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <Home className="h-4 w-4 text-gray-500" />
              <span>{Object.values(roomCounts).reduce((sum, count) => sum + count, 0)} rooms</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-gray-500" />
              <span>{totalAddOns} add-ons</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
