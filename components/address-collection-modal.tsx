"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { US_STATES } from "@/lib/location-data"
import { useToast } from "@/components/ui/use-toast"
import { MapPin } from "lucide-react"

interface AddressData {
  address: string
  address2?: string
  city: string
  state: string
  zipCode: string
  specialInstructions?: string
}

interface AddressCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: AddressData) => void
  initialData?: AddressData
}

export default function AddressCollectionModal({ isOpen, onClose, onSave, initialData }: AddressCollectionModalProps) {
  const { toast } = useToast()
  const [address, setAddress] = useState(initialData?.address || "")
  const [address2, setAddress2] = useState(initialData?.address2 || "")
  const [city, setCity] = useState(initialData?.city || "")
  const [state, setState] = useState(initialData?.state || "")
  const [zipCode, setZipCode] = useState(initialData?.zipCode || "")
  const [specialInstructions, setSpecialInstructions] = useState(initialData?.specialInstructions || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!address.trim()) newErrors.address = "Street address is required"
    if (!city.trim()) newErrors.city = "City is required"
    if (!state) newErrors.state = "State is required"
    if (!zipCode.trim()) newErrors.zipCode = "ZIP code is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ address, address2, city, state, zipCode, specialInstructions })
      onClose()
    } else {
      toast({
        title: "Please correct the errors",
        description: "Some required address fields are missing or invalid.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <MapPin className="h-6 w-6" />
            Enter Service Address
          </DialogTitle>
          <DialogDescription>
            Please provide the address where you would like the cleaning service to be performed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div>
            <Label htmlFor="address" className="text-base">
              Street Address
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                if (errors.address) setErrors((prev) => ({ ...prev, address: "" }))
              }}
              className={`mt-2 h-12 ${errors.address ? "border-red-500" : ""}`}
              placeholder="123 Main Street"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
          <div>
            <Label htmlFor="address2" className="text-base">
              Apartment, suite, etc. (optional)
            </Label>
            <Input
              id="address2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="mt-2 h-12"
              placeholder="Apt 4B"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-base">
                City
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value)
                  if (errors.city) setErrors((prev) => ({ ...prev, city: "" }))
                }}
                className={`mt-2 h-12 ${errors.city ? "border-red-500" : ""}`}
                placeholder="New York"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="state" className="text-base">
                State
              </Label>
              <Select
                value={state}
                onValueChange={(value) => {
                  setState(value)
                  if (errors.state) setErrors((prev) => ({ ...prev, state: "" }))
                }}
              >
                <SelectTrigger id="state" className={`mt-2 h-12 ${errors.state ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
            <div>
              <Label htmlFor="zipCode" className="text-base">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value)
                  if (errors.zipCode) setErrors((prev) => ({ ...prev, zipCode: "" }))
                }}
                className={`mt-2 h-12 ${errors.zipCode ? "border-red-500" : ""}`}
                placeholder="10001"
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="specialInstructions" className="text-base">
              Special Instructions (Optional)
            </Label>
            <Textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Entry instructions, pets, areas to avoid, etc."
              className="mt-2 h-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Address</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
