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

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

interface ChecklistItem {
  id: string
  name: string
  tier: "QUICK CLEAN" | "DEEP CLEAN" | "PREMIUM"
  category: string
}

interface CleaningChecklistProps {
  roomType: string
  selectedTier: string
}

export function CleaningChecklist({ roomType, selectedTier }: CleaningChecklistProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Generate checklist items based on room type
  const getChecklistItems = (type: string): ChecklistItem[] => {
    switch (type.toLowerCase()) {
      case "bedroom":
        return [
          { id: "bed-1", name: "Dust all surfaces", tier: "QUICK CLEAN", category: "Dusting" },
          { id: "bed-2", name: "Make bed", tier: "QUICK CLEAN", category: "Tidying" },
          { id: "bed-3", name: "Vacuum floor", tier: "QUICK CLEAN", category: "Floors" },
          { id: "bed-4", name: "Empty trash", tier: "QUICK CLEAN", category: "Trash" },
          { id: "bed-5", name: "Clean mirrors", tier: "QUICK CLEAN", category: "Glass" },
          { id: "bed-6", name: "Dust ceiling fan", tier: "DEEP CLEAN", category: "Dusting" },
          { id: "bed-7", name: "Clean baseboards", tier: "DEEP CLEAN", category: "Detailing" },
          { id: "bed-8", name: "Spot clean walls", tier: "DEEP CLEAN", category: "Walls" },
          { id: "bed-9", name: "Clean window sills", tier: "DEEP CLEAN", category: "Windows" },
          { id: "bed-10", name: "Organize nightstands", tier: "PREMIUM", category: "Organization" },
          { id: "bed-11", name: "Clean inside drawers", tier: "PREMIUM", category: "Detailing" },
          { id: "bed-12", name: "Clean under bed", tier: "PREMIUM", category: "Detailing" },
          { id: "bed-13", name: "Clean light fixtures", tier: "PREMIUM", category: "Lighting" },
          { id: "bed-14", name: "Sanitize door knobs", tier: "PREMIUM", category: "Sanitizing" },
        ]
      case "bathroom":
        return [
          { id: "bath-1", name: "Clean toilet", tier: "QUICK CLEAN", category: "Fixtures" },
          { id: "bath-2", name: "Clean sink", tier: "QUICK CLEAN", category: "Fixtures" },
          { id: "bath-3", name: "Clean shower/tub surface", tier: "QUICK CLEAN", category: "Fixtures" },
          { id: "bath-4", name: "Clean mirrors", tier: "QUICK CLEAN", category: "Glass" },
          { id: "bath-5", name: "Wipe countertops", tier: "QUICK CLEAN", category: "Surfaces" },
          { id: "bath-6", name: "Sweep and mop floor", tier: "QUICK CLEAN", category: "Floors" },
          { id: "bath-7", name: "Empty trash", tier: "QUICK CLEAN", category: "Trash" },
          { id: "bath-8", name: "Deep clean toilet", tier: "DEEP CLEAN", category: "Fixtures" },
          { id: "bath-9", name: "Deep clean shower/tub", tier: "DEEP CLEAN", category: "Fixtures" },
          { id: "bath-10", name: "Clean shower door tracks", tier: "DEEP CLEAN", category: "Detailing" },
          { id: "bath-11", name: "Clean baseboards", tier: "DEEP CLEAN", category: "Detailing" },
          { id: "bath-12", name: "Clean light fixtures", tier: "PREMIUM", category: "Lighting" },
          { id: "bath-13", name: "Clean inside cabinets", tier: "PREMIUM", category: "Detailing" },
          { id: "bath-14", name: "Sanitize door knobs", tier: "PREMIUM", category: "Sanitizing" },
          { id: "bath-15", name: "Clean exhaust fan", tier: "PREMIUM", category: "Detailing" },
          { id: "bath-16", name: "Descale shower head", tier: "PREMIUM", category: "Detailing" },
        ]
      case "kitchen":
        return [
          { id: "kit-1", name: "Clean countertops", tier: "QUICK CLEAN", category: "Surfaces" },
          { id: "kit-2", name: "Clean stovetop", tier: "QUICK CLEAN", category: "Appliances" },
          { id: "kit-3", name: "Clean sink", tier: "QUICK CLEAN", category: "Fixtures" },
          { id: "kit-4", name: "Wipe appliance exteriors", tier: "QUICK CLEAN", category: "Appliances" },
          { id: "kit-5", name: "Sweep and mop floor", tier: "QUICK CLEAN", category: "Floors" },
          { id: "kit-6", name: "Empty trash", tier: "QUICK CLEAN", category: "Trash" },
          { id: "kit-7", name: "Clean microwave interior", tier: "DEEP CLEAN", category: "Appliances" },
          { id: "kit-8", name: "Clean inside refrigerator", tier: "DEEP CLEAN", category: "Appliances" },
          { id: "kit-9", name: "Clean cabinet fronts", tier: "DEEP CLEAN", category: "Cabinets" },
          { id: "kit-10", name: "Clean baseboards", tier: "DEEP CLEAN", category: "Detailing" },
          { id: "kit-11", name: "Clean oven interior", tier: "PREMIUM", category: "Appliances" },
          { id: "kit-12", name: "Clean inside cabinets", tier: "PREMIUM", category: "Cabinets" },
          { id: "kit-13", name: "Clean range hood", tier: "PREMIUM", category: "Detailing" },
          { id: "kit-14", name: "Sanitize countertops", tier: "PREMIUM", category: "Sanitizing" },
          { id: "kit-15", name: "Polish stainless steel", tier: "PREMIUM", category: "Detailing" },
        ]
      case "living room":
        return [
          { id: "liv-1", name: "Dust all surfaces", tier: "QUICK CLEAN", category: "Dusting" },
          { id: "liv-2", name: "Vacuum floor/carpet", tier: "QUICK CLEAN", category: "Floors" },
          { id: "liv-3", name: "Tidy cushions and throw pillows", tier: "QUICK CLEAN", category: "Tidying" },
          { id: "liv-4", name: "Empty trash", tier: "QUICK CLEAN", category: "Trash" },
          { id: "liv-5", name: "Clean coffee table", tier: "QUICK CLEAN", category: "Surfaces" },
          { id: "liv-6", name: "Dust ceiling fan", tier: "DEEP CLEAN", category: "Dusting" },
          { id: "liv-7", name: "Clean baseboards", tier: "DEEP CLEAN", category: "Detailing" },
          { id: "liv-8", name: "Vacuum upholstery", tier: "DEEP CLEAN", category: "Furniture" },
          { id: "liv-9", name: "Clean window sills", tier: "DEEP CLEAN", category: "Windows" },
          { id: "liv-10", name: "Spot clean walls", tier: "DEEP CLEAN", category: "Walls" },
          { id: "liv-11", name: "Clean light fixtures", tier: "PREMIUM", category: "Lighting" },
          { id: "liv-12", name: "Clean under furniture", tier: "PREMIUM", category: "Detailing" },
          { id: "liv-13", name: "Clean inside entertainment center", tier: "PREMIUM", category: "Detailing" },
          { id: "liv-14", name: "Sanitize remote controls", tier: "PREMIUM", category: "Sanitizing" },
          { id: "liv-15", name: "Clean decorative items", tier: "PREMIUM", category: "Detailing" },
        ]
      default:
        return [
          { id: "gen-1", name: "Dust all surfaces", tier: "QUICK CLEAN", category: "Dusting" },
          { id: "gen-2", name: "Vacuum/sweep floors", tier: "QUICK CLEAN", category: "Floors" },
          { id: "gen-3", name: "Empty trash", tier: "QUICK CLEAN", category: "Trash" },
          { id: "gen-4", name: "Clean baseboards", tier: "DEEP CLEAN", category: "Detailing" },
          { id: "gen-5", name: "Spot clean walls", tier: "DEEP CLEAN", category: "Walls" },
          { id: "gen-6", name: "Clean light fixtures", tier: "PREMIUM", category: "Lighting" },
          { id: "gen-7", name: "Sanitize high-touch surfaces", tier: "PREMIUM", category: "Sanitizing" },
        ]
    }
  }

  const allItems = getChecklistItems(roomType)

  // Filter items based on selected tier
  const getItemsForTier = (tier: string) => {
    switch (tier) {
      case "PREMIUM":
        return allItems
      case "DEEP CLEAN":
        return allItems.filter((item) => item.tier !== "PREMIUM")
      case "QUICK CLEAN":
      default:
        return allItems.filter((item) => item.tier === "QUICK CLEAN")
    }
  }

  // Filter items based on search query and active tab
  const filteredItems = getItemsForTier(selectedTier).filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && item.category.toLowerCase() === activeTab.toLowerCase()
  })

  // Get unique categories for tabs
  const categories = ["all", ...new Set(allItems.map((item) => item.category.toLowerCase()))]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cleaning Checklist</CardTitle>
        <CardDescription>
          Tasks included in your {selectedTier} for {roomType}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-8 w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === "all" ? "All Tasks" : category}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 p-2 border rounded-md">
                    <Checkbox id={item.id} checked />
                    <label
                      htmlFor={item.id}
                      className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.name}
                    </label>
                    <Badge
                      variant={
                        item.tier === "PREMIUM" ? "destructive" : item.tier === "DEEP CLEAN" ? "secondary" : "default"
                      }
                    >
                      {item.tier}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No tasks found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-gray-500">{filteredItems.length} tasks included</div>
          <Button variant="outline" size="sm">
            Print Checklist
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
