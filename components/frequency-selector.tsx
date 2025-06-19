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
"use client"
/* Don't modify beyond what is requested ever. */

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Calendar, RotateCcw, Clock, CheckCircle2 } from "lucide-react"

interface FrequencyOption {
  id: string
  name: string
  description: string
  discount: number
  icon: React.ReactNode
  popular?: boolean
}

interface FrequencySelectorProps {
  onFrequencyChange: (frequency: string, discount: number) => void
  selectedFrequency?: string
}

export function FrequencySelector({ onFrequencyChange, selectedFrequency = "one_time" }: FrequencySelectorProps) {
  const [selected, setSelected] = useState(selectedFrequency)

  const frequencyOptions: FrequencyOption[] = [
    {
      id: "one_time",
      name: "One-Time Service",
      description: "Perfect for a single deep clean or special occasions",
      discount: 0,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: "weekly",
      name: "Weekly",
      description: "Ideal for busy households that need regular maintenance",
      discount: 15,
      icon: <RotateCcw className="h-5 w-5" />,
      popular: true,
    },
    {
      id: "biweekly",
      name: "Bi-Weekly",
      description: "Great balance of cleanliness and affordability",
      discount: 10,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "monthly",
      name: "Monthly",
      description: "Good for homes that need occasional professional cleaning",
      discount: 5,
      icon: <Calendar className="h-5 w-5" />,
    },
  ]

  const handleFrequencyChange = (value: string) => {
    setSelected(value)
    const option = frequencyOptions.find((opt) => opt.id === value)
    if (option) {
      onFrequencyChange(value, option.discount)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cleaning Frequency</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Regular cleaning schedules receive discounts. The more frequent your cleanings, the more you save!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Choose how often you'd like your cleaning service</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selected} onValueChange={handleFrequencyChange} className="grid gap-4">
          {frequencyOptions.map((option) => (
            <div key={option.id} className="relative">
              <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
              <Label
                htmlFor={option.id}
                className="flex items-start p-4 border-2 rounded-lg border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="mr-3 text-gray-500">{option.icon}</div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {option.name}
                        {option.discount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {option.discount}% OFF
                          </Badge>
                        )}
                        {option.popular && (
                          <Badge variant="default" className="ml-2">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                    </div>
                  </div>
                </div>
                {selected === option.id && <CheckCircle2 className="h-5 w-5 text-primary ml-2 flex-shrink-0" />}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
