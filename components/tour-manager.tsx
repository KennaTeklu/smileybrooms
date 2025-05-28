"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { TourGuide, TourTrigger } from "./tour-guide"
import { availableTours, type TourType } from "@/lib/tour-config"
import { HelpCircle, Play, RotateCcw, Settings, Zap, BookOpen, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TourManagerProps {
  className?: string
  showAllTours?: boolean
  defaultTour?: TourType
}

export function TourManager({ className, showAllTours = true, defaultTour = "main" }: TourManagerProps) {
  const [activeTour, setActiveTour] = useState<TourType | null>(null)
  const [showTourList, setShowTourList] = useState(false)

  const startTour = (tourType: TourType) => {
    setActiveTour(tourType)
  }

  const handleTourComplete = () => {
    setActiveTour(null)
  }

  const handleTourSkip = () => {
    setActiveTour(null)
  }

  const resetAllTours = () => {
    Object.keys(availableTours).forEach((tourId) => {
      localStorage.removeItem(`tour-completed-${availableTours[tourId as TourType].id}`)
    })
    window.location.reload()
  }

  const getTourIcon = (tourType: TourType) => {
    switch (tourType) {
      case "main":
        return <BookOpen className="h-4 w-4" />
      case "quickBooking":
        return <Zap className="h-4 w-4" />
      case "customization":
        return <Settings className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  const getTourDescription = (tourType: TourType) => {
    switch (tourType) {
      case "main":
        return "Complete walkthrough of all features"
      case "quickBooking":
        return "Fast track to booking a service"
      case "customization":
        return "Learn advanced customization options"
      default:
        return "Interactive guide"
    }
  }

  return (
    <div className={cn("tour-manager", className)}>
      {/* Tour Trigger Buttons */}
      <div className="flex items-center gap-2">
        {showAllTours ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Help & Tours
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="p-2">
                <h4 className="font-medium text-sm mb-2">Available Tours</h4>
                {Object.entries(availableTours).map(([key, tour]) => {
                  const tourType = key as TourType
                  const isCompleted = localStorage.getItem(`tour-completed-${tour.id}`) === "true"

                  return (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => startTour(tourType)}
                      className="flex items-start gap-3 p-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {getTourIcon(tourType)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{tour.name}</span>
                            {isCompleted && (
                              <Badge variant="secondary" className="text-xs">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{getTourDescription(tourType)}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetAllTours} className="text-red-600">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All Tours
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <TourTrigger tourConfig={availableTours[defaultTour]} variant="outline" />
        )}
      </div>

      {/* Tour List Card (Optional) */}
      {showTourList && (
        <Card className="mt-4 max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Available Tours
            </CardTitle>
            <CardDescription>Choose a tour to learn about different features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(availableTours).map(([key, tour]) => {
              const tourType = key as TourType
              const isCompleted = localStorage.getItem(`tour-completed-${tour.id}`) === "true"

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => startTour(tourType)}
                >
                  <div className="flex items-center gap-3">
                    {getTourIcon(tourType)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tour.name}</span>
                        {isCompleted && (
                          <Badge variant="secondary" className="text-xs">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{tour.description}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Active Tour Component */}
      {activeTour && (
        <TourGuide tourConfig={availableTours[activeTour]} onComplete={handleTourComplete} onSkip={handleTourSkip} />
      )}
    </div>
  )
}

// Quick access tour buttons for specific pages
export function QuickTourButton({ tourType, className }: { tourType: TourType; className?: string }) {
  return (
    <TourTrigger
      tourConfig={availableTours[tourType]}
      variant="ghost"
      size="sm"
      className={cn("text-blue-600 hover:text-blue-700", className)}
    >
      Need help?
    </TourTrigger>
  )
}
