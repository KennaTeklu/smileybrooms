"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, Sparkles, BrushIcon as Broom, SparkleIcon, Star } from "lucide-react"

interface ServiceTypeSelectorProps {
  value: "standard" | "detailing"
  onChange: (value: "standard" | "detailing") => void
}

export default function ServiceTypeSelector({ value, onChange }: ServiceTypeSelectorProps) {
  return (
    <div className="space-y-4 py-4">
      <h3 className="text-lg font-medium">Service Type</h3>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as "standard" | "detailing")}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="relative">
          <RadioGroupItem value="standard" id="standard" className="peer sr-only" />
          <Label
            htmlFor="standard"
            className="flex flex-col h-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Broom className="h-5 w-5 text-primary mr-2" />
                  <p className="font-medium">Standard Cleaning</p>
                </div>
                <p className="text-sm text-muted-foreground">Regular cleaning service</p>
              </div>
              <Check className="h-5 w-5 text-primary opacity-0 peer-data-[state=checked]:opacity-100" />
            </div>
            <ul className="text-sm space-y-1 mt-2 text-muted-foreground">
              <li className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>General dusting and vacuuming</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>Bathroom and kitchen cleaning</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>Floor cleaning</span>
              </li>
            </ul>
          </Label>
        </div>

        <div className="relative">
          <RadioGroupItem value="detailing" id="detailing" className="peer sr-only" />
          <Label
            htmlFor="detailing"
            className="flex flex-col h-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="space-y-1">
                <div className="flex items-center">
                  <SparkleIcon className="h-5 w-5 text-primary mr-2" />
                  <p className="font-medium">Premium Detailing</p>
                  <Sparkles className="h-4 w-4 text-yellow-500 ml-1" />
                </div>
                <p className="text-sm text-muted-foreground">Thorough, detailed cleaning</p>
              </div>
              <Check className="h-5 w-5 text-primary opacity-0 peer-data-[state=checked]:opacity-100" />
            </div>
            <ul className="text-sm space-y-1 mt-2 text-muted-foreground">
              <li className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>All standard cleaning services</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>Deep cleaning of every corner</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>Special care for valuable items</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary">✓</span>
                <span>Detailed attention to fixtures and fittings</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-yellow-500">
                  <Star className="h-3 w-3 inline" />
                </span>
                <span className="font-medium text-primary">3.5x more thorough cleaning</span>
              </li>
            </ul>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
