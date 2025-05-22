"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MapPin, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onAddressSelect?: (address: AddressDetails) => void
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
  error?: string
}

interface AddressDetails {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface AddressSuggestion {
  description: string
  placeId: string
}

// Mock suggestions for demo purposes
const MOCK_SUGGESTIONS: AddressSuggestion[] = [
  { description: "123 Main St, New York, NY 10001", placeId: "place1" },
  { description: "456 Broadway, New York, NY 10012", placeId: "place2" },
  { description: "789 5th Ave, New York, NY 10022", placeId: "place3" },
  { description: "321 Park Ave, New York, NY 10022", placeId: "place4" },
]

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  label = "Address",
  placeholder = "Enter your address",
  required = false,
  className,
  error,
}: AddressAutocompleteProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Handle outside clicks to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setSuggestions([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch address suggestions
  const fetchSuggestions = (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    // In a real implementation, you would call a geocoding API here
    // For demo purposes, we'll use mock data with a timeout to simulate API call
    setTimeout(() => {
      const filtered = MOCK_SUGGESTIONS.filter((suggestion) =>
        suggestion.description.toLowerCase().includes(query.toLowerCase()),
      )
      setSuggestions(filtered)
      setIsLoading(false)
    }, 300)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    fetchSuggestions(newValue)
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    onChange(suggestion.description)
    setSuggestions([])

    // In a real implementation, you would fetch place details here
    // For demo purposes, we'll parse the mock address
    if (onAddressSelect) {
      const parts = suggestion.description.split(", ")
      const addressParts = parts[1].split(" ")

      const addressDetails: AddressDetails = {
        address: parts[0],
        city: addressParts[0],
        state: addressParts[1],
        zipCode: parts[2],
        country: "US",
      }

      onAddressSelect(addressDetails)
    }
  }

  // Clear input
  const handleClear = () => {
    onChange("")
    setSuggestions([])
    inputRef.current?.focus()
  }

  return (
    <div className={cn("relative", className)}>
      {label && (
        <Label htmlFor="address-input" className="mb-2 block">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin className="h-4 w-4" />
        </div>

        <Input
          id="address-input"
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true)
            if (value.length >= 3) fetchSuggestions(value)
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn("pl-9", error && "border-red-500")}
          aria-invalid={!!error}
          aria-describedby={error ? "address-error" : undefined}
        />

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      {error && (
        <p id="address-error" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}

      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200"
        >
          <ul className="max-h-60 overflow-auto py-1 text-base">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.placeId}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onMouseDown={() => handleSuggestionSelect(suggestion)}
              >
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-gray-400" />
                  <span>{suggestion.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading && isFocused && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
          <div className="px-4 py-3 text-sm text-gray-500">Loading suggestions...</div>
        </div>
      )}
    </div>
  )
}
