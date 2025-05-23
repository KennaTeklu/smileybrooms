"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronUp, ChevronDown, X, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoomCustomizationPanelProps {
  roomType: string
  roomName: string
  onClose?: () => void
  children?: React.ReactNode
}

export function RoomCustomizationPanel({ roomType, roomName, onClose, children }: RoomCustomizationPanelProps) {
  const [activeTab, setActiveTab] = React.useState("tiers")
  const [tabScrollPositions, setTabScrollPositions] = React.useState<Record<string, number>>({
    tiers: 0,
    addons: 0,
    reductions: 0,
  })
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Save scroll position when changing tabs
  const handleTabChange = (value: string) => {
    if (scrollContainerRef.current && activeTab) {
      setTabScrollPositions((prev) => ({
        ...prev,
        [activeTab]: scrollContainerRef.current?.scrollTop || 0,
      }))
    }
    setActiveTab(value)
  }

  // Restore scroll position when tab is active
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = tabScrollPositions[activeTab] || 0
    }
  }, [activeTab, tabScrollPositions])

  // Scroll to top/bottom handlers
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button id={`customize-${roomType}`} variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          Customize
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] rounded-t-[10px]">
        <div className="h-full flex flex-col">
          {/* Header - Fixed at top */}
          <div className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{roomName} Customization</h2>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <p className="text-sm text-muted-foreground">Customize cleaning options for this room</p>
          </div>

          {/* Tabs - Sticky below header */}
          <div className="sticky top-[73px] bg-background z-10 border-b">
            <TabsList className="w-full justify-start p-0 h-auto bg-transparent">
              <TabsTrigger
                value="tiers"
                onClick={() => handleTabChange("tiers")}
                className={cn(
                  "flex-1 py-3 rounded-none data-[state=active]:bg-transparent",
                  activeTab === "tiers" ? "border-b-2 border-primary" : "",
                )}
              >
                Tiers
              </TabsTrigger>
              <TabsTrigger
                value="addons"
                onClick={() => handleTabChange("addons")}
                className={cn(
                  "flex-1 py-3 rounded-none data-[state=active]:bg-transparent",
                  activeTab === "addons" ? "border-b-2 border-primary" : "",
                )}
              >
                Add-ons
              </TabsTrigger>
              <TabsTrigger
                value="reductions"
                onClick={() => handleTabChange("reductions")}
                className={cn(
                  "flex-1 py-3 rounded-none data-[state=active]:bg-transparent",
                  activeTab === "reductions" ? "border-b-2 border-primary" : "",
                )}
              >
                Reductions
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable content area */}
          <ScrollArea className="flex-1 px-4" ref={scrollContainerRef}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsContent value="tiers" className="m-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Cleaning Tiers</CardTitle>
                    <CardDescription>Select the cleaning tier for this room</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Tier content would go here */}
                    <p>Tier options for {roomName}</p>
                    {/* Example content to make it scrollable */}
                    <div className="space-y-4 mt-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-md">
                          <h3 className="font-medium">Tier Option {i + 1}</h3>
                          <p className="text-sm text-gray-500">Description of this tier option</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addons" className="m-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add-on Services</CardTitle>
                    <CardDescription>Select additional services for this room</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Add-ons content would go here */}
                    <p>Add-on options for {roomName}</p>
                    {/* Example content to make it scrollable */}
                    <div className="space-y-4 mt-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-md">
                          <h3 className="font-medium">Add-on Option {i + 1}</h3>
                          <p className="text-sm text-gray-500">Description of this add-on option</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reductions" className="m-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Reductions</CardTitle>
                    <CardDescription>Select services to remove from this room</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Reductions content would go here */}
                    <p>Reduction options for {roomName}</p>
                    {/* Example content to make it scrollable */}
                    <div className="space-y-4 mt-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-md">
                          <h3 className="font-medium">Reduction Option {i + 1}</h3>
                          <p className="text-sm text-gray-500">Description of this reduction option</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          {/* Footer - Fixed at bottom */}
          <div className="p-4 border-t sticky bottom-0 bg-background z-10">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={scrollToTop}>
                <ChevronUp className="h-4 w-4 mr-1" />
                Top
              </Button>
              <Button variant="default">Apply Changes</Button>
              <Button variant="outline" size="sm" onClick={scrollToBottom}>
                <ChevronDown className="h-4 w-4 mr-1" />
                Bottom
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
