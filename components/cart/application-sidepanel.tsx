"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  User,
  Check,
  Shield,
  ArrowRight,
  X,
  Home,
  Building,
  Navigation,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  Save,
  History,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import type { CheckoutData } from "@/lib/types"
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet"
import { logWelcomeStart, logContactSubmit, logAddressSubmit, logCheckoutComplete } from "@/lib/google-sheet-logger" // Updated import
import { useCart } from "@/lib/cart-context"

const isValidArizonaZip = (zipCode: string): boolean => {
  const arizonaZipRanges = [
    { min: 85001, max: 85099 }, // Phoenix metro area
    { min: 85201, max: 85299 }, // Mesa/Tempe/Chandler area
    { min: 85301, max: 85399 }, // Glendale/Peoria/Surprise area
    { min: 85501, max: 85599 }, // Globe/Superior area
    { min: 85601, max: 85699 }, // Sierra Vista/Benson area
    { min: 85701, max: 85799 }, // Tucson metro area
    { min: 86001, max: 86099 }, // Flagstaff/Sedona area
    { min: 86301, max: 86399 }, // Prescott/Prescott Valley area
    { min: 86401, max: 86499 }, // Kingman/Bullhead City area
    { min: 86501, max: 86599 }, // Yuma area
  ]

  const cleanZip = zipCode.replace(/\D/g, "").substring(0, 5)
  if (cleanZip.length !== 5) return false

  const zipNum = Number.parseInt(cleanZip, 10)
  return arizonaZipRanges.some((range) => zipNum >= range.min && zipNum <= range.max)
}

type CheckoutStepId = "welcome" | "contact" | "address" | "confirmation"

interface ValidationRule {
  field: string
  validator: (value: any, data?: any) => string | null
  dependencies?: string[]
}

interface AddressSuggestion {
  formatted_address: string
  place_id: string
  components: {
    street_number?: string
    route?: string
    locality?: string
    administrative_area_level_1?: string
    postal_code?: string
  }
}

interface ApplicationSidePanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCheckoutComplete: (data: CheckoutData) => void
}

export default function ApplicationSidePanel({ isOpen, onOpenChange, onCheckoutComplete }: ApplicationSidePanelProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLDivElement>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  const validationTimeoutRef = useRef<NodeJS.Timeout>()
  const { cart } = useCart()

  const [currentStep, setCurrentStep] = useState<CheckoutStepId>("welcome")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [warnings, setWarnings] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoadingAddressSuggestions, setIsLoadingAddressSuggestions] = useState(false)
  const [formHistory, setFormHistory] = useState<CheckoutData[]>([])
  const [validationInProgress, setValidationInProgress] = useState<Set<string>>(new Set())
  const [fieldTouched, setFieldTouched] = useState<Set<string>>(new Set())
  const [autoFillSuggestions, setAutoFillSuggestions] = useState<Record<string, string[]>>({})

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    address: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      specialInstructions: "",
      addressType: "residential",
    },
    payment: {
      paymentMethod: "card",
      allowVideoRecording: false,
      agreeToTerms: false,
    },
  })

  const validationRules: ValidationRule[] = useMemo(
    () => [
      {
        field: "firstName",
        validator: (value: string) => {
          if (!value?.trim()) return "First name is required"
          if (value.trim().length < 2) return "First name must be at least 2 characters"
          if (!/^[a-zA-Z\s'-]+$/.test(value)) return "First name contains invalid characters"
          return null
        },
      },
      {
        field: "lastName",
        validator: (value: string) => {
          if (!value?.trim()) return "Last name is required"
          if (value.trim().length < 2) return "Last name must be at least 2 characters"
          if (!/^[a-zA-Z\s'-]+$/.test(value)) return "Last name must be at least 2 characters"
          return null
        },
      },
      {
        field: "email",
        validator: (value: string) => {
          if (!value?.trim()) return "Email address is required"
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) return "Please enter a valid email address"
          const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
          const domain = value.split("@")[1]?.toLowerCase()
          if (domain && !commonDomains.includes(domain) && domain.includes(".co")) {
            return null
          }
          return null
        },
      },
      {
        field: "phone",
        validator: (value: string) => {
          if (!value?.trim()) return "Phone number is required"
          const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
          const cleanPhone = value.replace(/[\s\-().]/g, "")
          if (!phoneRegex.test(cleanPhone)) return "Please enter a valid phone number"
          if (cleanPhone.length < 10) return "Phone number must be at least 10 digits"
          return null
        },
      },
      {
        field: "address",
        validator: (value: string) => {
          if (!value?.trim()) return "Street address is required"
          if (value.trim().length < 5) return "Please enter a complete street address"
          if (!/\d/.test(value)) return "Address should include a street number"
          return null
        },
      },
      {
        field: "city",
        validator: (value: string) => {
          const allowedCities = ["Glendale", "Phoenix", "Peoria"]
          if (!value?.trim()) return "City is required"
          if (!allowedCities.includes(value)) return "Please select a valid city (Glendale, Phoenix, or Peoria)"
          return null
        },
      },
      {
        field: "state",
        validator: (value: string) => {
          if (value !== "AZ") return "Only Arizona is supported"
          return null
        },
      },
      {
        field: "zipCode",
        validator: (value: string) => {
          if (!value?.trim()) return "ZIP code is required"
          if (!isValidArizonaZip(value)) return "Please enter a valid Arizona ZIP code"
          return null
        },
        dependencies: ["state"],
      },
    ],
    [],
  )

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "Connection restored",
        description: "Your data will be saved automatically",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "Connection lost",
        description: "Your data is saved locally and will sync when reconnected",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  const performAutoSave = useCallback(
    async (data: CheckoutData, force = false) => {
      if (!isDirty && !force) return

      try {
        const saveData = {
          ...data,
          timestamp: new Date().toISOString(),
          version: Date.now(),
        }

        localStorage.setItem("checkout-data", JSON.stringify(saveData))
        localStorage.setItem("checkout-contact", JSON.stringify(data.contact))
        localStorage.setItem("checkout-address", JSON.stringify(data.address))

        if ("indexedDB" in window) {
          const request = indexedDB.open("CheckoutDB", 1)
          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains("checkouts")) {
              db.createObjectStore("checkouts", { keyPath: "id" })
            }
          }
          request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            const transaction = db.transaction(["checkouts"], "readwrite")
            const store = transaction.objectStore("checkouts")
            store.put({ id: "current", data: saveData })
          }
          request.onerror = (event) => {
            console.error("IndexedDB error:", (event.target as IDBOpenDBRequest).error)
          }
        }

        setLastSaved(new Date())
        setIsDirty(false)

        if (isOnline) {
          try {
            await fetch("/api/checkout/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(saveData),
            })
          } catch (error) {
            console.warn("Failed to sync to server:", error)
          }
        }
      } catch (error) {
        console.error("Auto-save failed:", error)
        toast({
          title: "Save failed",
          description: "Unable to save your progress. Please check your connection.",
          variant: "destructive",
        })
      }
    },
    [isDirty, isOnline, toast],
  )

  useEffect(() => {
    if (!isOpen || !isDirty) return

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave(checkoutData)
    }, 2000)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [checkoutData, isDirty, isOpen, performAutoSave])

  useEffect(() => {
    if (!isOpen) return

    const loadSavedData = async () => {
      try {
        let savedData = null

        if ("indexedDB" in window) {
          const request = indexedDB.open("CheckoutDB", 1)
          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains("checkouts")) {
              db.createObjectStore("checkouts", { keyPath: "id" })
            }
          }
          const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
            request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result)
            request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error)
          })

          try {
            const db = await dbPromise
            const transaction = db.transaction(["checkouts"], "readonly")
            const store = transaction.objectStore("checkouts")
            const getRequest = store.get("current")
            savedData = await new Promise((resolve) => {
              getRequest.onsuccess = () => resolve(getRequest.result?.data)
              getRequest.onerror = () => resolve(null)
            })
          } catch (e) {
            console.warn("IndexedDB load failed:", e)
          }
        }

        if (!savedData) {
          savedData = JSON.parse(localStorage.getItem("checkout-data") || "null")
          if (!savedData) {
            const savedContact = JSON.parse(localStorage.getItem("checkout-contact") || "null")
            const savedAddress = JSON.parse(localStorage.getItem("checkout-address") || "null")
            if (savedContact || savedAddress) {
              savedData = { contact: savedContact, address: savedAddress }
            }
          }
        }

        if (savedData) {
          setCheckoutData((prev) => ({
            contact: { ...prev.contact, ...(savedData.contact || {}) },
            address: { ...prev.address, ...(savedData.address || {}) },
            payment: { ...prev.payment, ...(savedData.payment || {}) },
          }))

          const historyData = localStorage.getItem("checkout-history")
          if (historyData) {
            setFormHistory(JSON.parse(historyData).slice(0, 5))
          }

          if (savedData.contact?.firstName && savedData.contact?.email) {
            setCurrentStep("contact")
          }

          toast({
            title: "Previous data restored",
            description: "We've restored your previous information",
          })
        }
      } catch (error) {
        console.error("Failed to load saved data:", error)
        localStorage.removeItem("checkout-data")
        localStorage.removeItem("checkout-contact")
        localStorage.removeItem("checkout-address")
        if ("indexedDB" in window) {
          indexedDB.deleteDatabase("CheckoutDB")
        }
      }
    }

    loadSavedData()
  }, [isOpen, toast])

  const validateField = useCallback(
    async (fieldName: string, value: any, allData: CheckoutData) => {
      const rule = validationRules.find((r) => r.field === fieldName)
      if (!rule) return

      setValidationInProgress((prev) => new Set([...prev, fieldName]))

      await new Promise((resolve) => setTimeout(resolve, 300))

      const error = rule.validator(value, allData)

      setErrors((prev) => {
        const newErrors = { ...prev }
        if (error) {
          newErrors[fieldName] = error
        } else {
          delete newErrors[fieldName]
        }
        return newErrors
      })

      if (fieldName === "email" && value && !error) {
        const domain = value.split("@")[1]?.toLowerCase()
        if (domain && domain.includes(".co") && !domain.includes(".com")) {
          setWarnings((prev) => ({
            ...prev,
            [fieldName]: `Did you mean ${value.replace(".co", ".com")}?`,
          }))
        } else {
          setWarnings((prev) => {
            const newWarnings = { ...prev }
            delete newWarnings[fieldName]
            return newWarnings
          })
        }
      }

      setValidationInProgress((prev) => {
        const newSet = new Set(prev)
        newSet.delete(fieldName)
        return newSet
      })
    },
    [validationRules],
  )

  const fetchAddressSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([])
      return
    }

    setIsLoadingAddressSuggestions(true)

    try {
      const response = await fetch(`/api/address/autocomplete?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const suggestions = await response.json()
        setAddressSuggestions(suggestions.slice(0, 5))
      } else {
        console.error("Address autocomplete API error:", response.status, response.statusText)
        setAddressSuggestions([])
      }
    } catch (error) {
      console.error("Address autocomplete failed:", error)
      setAddressSuggestions([])
    } finally {
      setIsLoadingAddressSuggestions(false)
    }
  }, [])

  const generateAutoFillSuggestions = useCallback((fieldName: string, currentValue: string) => {
    const suggestions: string[] = []

    switch (fieldName) {
      case "firstName":
        if (currentValue.length > 0) {
          const commonNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily"]
          suggestions.push(...commonNames.filter((name) => name.toLowerCase().startsWith(currentValue.toLowerCase())))
        }
        break
      case "email":
        if (currentValue.includes("@") && !currentValue.includes(".")) {
          const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
          const [localPart] = currentValue.split("@")
          suggestions.push(...commonDomains.map((domain) => `${localPart}@${domain}`))
        }
        break
      case "city":
        const commonCities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]
        suggestions.push(...commonCities.filter((city) => city.toLowerCase().includes(currentValue.toLowerCase())))
        break
    }

    setAutoFillSuggestions((prev) => ({
      ...prev,
      [fieldName]: suggestions.slice(0, 3),
    }))
  }, [])

  const handleInputChange = useCallback(
    (section: "contact" | "address", field: string, value: string) => {
      setCheckoutData((prev) => {
        const newData = {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        }

        if (validationTimeoutRef.current) {
          clearTimeout(validationTimeoutRef.current)
        }

        validationTimeoutRef.current = setTimeout(() => {
          if (fieldTouched.has(field)) {
            validateField(field, value, newData)
          }
        }, 500)

        return newData
      })

      setIsDirty(true)
      setFieldTouched((prev) => new Set([...prev, field]))

      generateAutoFillSuggestions(field, value)

      if (field === "address") {
        fetchAddressSuggestions(value)
      }

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    },
    [errors, fieldTouched, validateField, generateAutoFillSuggestions, fetchAddressSuggestions],
  )

  const validateStep = useCallback(
    (step: CheckoutStepId): boolean => {
      const fieldsToValidate =
        step === "contact" ? ["firstName", "lastName", "email", "phone"] : ["address", "city", "state", "zipCode"]

      const newErrors: Record<string, string> = {}
      let isValid = true

      for (const fieldName of fieldsToValidate) {
        const rule = validationRules.find((r) => r.field === fieldName)
        if (rule) {
          const value =
            step === "contact"
              ? checkoutData.contact[fieldName as keyof typeof checkoutData.contact]
              : checkoutData.address[fieldName as keyof typeof checkoutData.address]

          const error = rule.validator(value, checkoutData)
          if (error) {
            newErrors[fieldName] = error
            isValid = false
          }
        }
      }

      setErrors(newErrors)
      return isValid
    },
    [checkoutData, validationRules],
  )

  const handleStepTransition = useCallback(
    async (nextStep: CheckoutStepId) => {
      if (currentStep === "contact" && !validateStep("contact")) {
        const firstError = Object.keys(errors)[0]
        const errorElement = document.getElementById(firstError)
        errorElement?.focus()

        if (typeof window !== "undefined" && (window as any).gtag) {
          ;(window as any).gtag("event", "checkout_validation_failed", {
            step: currentStep,
            field: firstError,
          })
        }
        return
      }

      if (currentStep === "address" && !validateStep("address")) {
        const firstError = Object.keys(errors)[0]
        const errorElement = document.getElementById(firstError)
        errorElement?.focus()
        return
      }

      setIsSubmitting(true)

      try {
        // Log event before transitioning to the next step
        if (currentStep === "contact") {
          await logContactSubmit({
            checkoutData,
            cartItems: cart.items,
            subtotalPrice: cart.subtotalPrice,
            couponDiscount: cart.couponDiscount,
            fullHouseDiscount: cart.fullHouseDiscount,
            totalPrice: cart.totalPrice,
          })
        } else if (currentStep === "address") {
          await logAddressSubmit({
            checkoutData,
            cartItems: cart.items,
            subtotalPrice: cart.subtotalPrice,
            couponDiscount: cart.couponDiscount,
            fullHouseDiscount: cart.fullHouseDiscount,
            totalPrice: cart.totalPrice,
          })
        }

        if (currentStep !== "welcome") {
          setFormHistory((prev) => {
            const newHistory = [checkoutData, ...prev.slice(0, 4)]
            localStorage.setItem("checkout-history", JSON.stringify(newHistory))
            return newHistory
          })
        }

        if (currentStep === "contact") {
          setCheckoutData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              fullName: `${prev.contact.firstName} ${prev.contact.lastName}`.trim(),
              email: prev.contact.email,
              phone: prev.contact.phone,
            },
          }))
        }

        await performAutoSave(checkoutData, true)

        if (nextStep === "confirmation") {
          await logCheckoutComplete({
            checkoutData,
            cartItems: cart.items,
            subtotalPrice: cart.subtotalPrice,
            couponDiscount: cart.couponDiscount,
            fullHouseDiscount: cart.fullHouseDiscount,
            totalPrice: cart.totalPrice,
          })

          onCheckoutComplete(checkoutData)
          onOpenChange(false)

          toast({
            title: "Information saved successfully!",
            description: "Redirecting to payment...",
          })
          return
        }

        if (typeof window !== "undefined" && (window as any).gtag) {
          ;(window as any).gtag("event", "checkout_progress", {
            step_completed: currentStep,
            next_step: nextStep,
          })
        }

        setCurrentStep(nextStep)
      } catch (error) {
        console.error("Step transition failed:", error)
        toast({
          title: "Something went wrong",
          description: "Please try again or contact support if the issue persists.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [currentStep, validateStep, errors, checkoutData, performAutoSave, onCheckoutComplete, onOpenChange, toast, cart],
  )

  const handleAutoFillSuggestion = useCallback(
    (section: "contact" | "address", field: string, suggestion: string) => {
      handleInputChange(section, field, suggestion)
      setAutoFillSuggestions((prev) => ({
        ...prev,
        [field]: [],
      }))
    },
    [handleInputChange],
  )

  const handleAddressSuggestion = useCallback((suggestion: AddressSuggestion) => {
    const { components } = suggestion

    setCheckoutData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        address: `${components.street_number || ""} ${components.route || ""}`.trim(),
        city: components.locality || prev.address.city,
        state: components.administrative_area_level_1 || prev.address.state,
        zipCode: components.postal_code || prev.address.zipCode,
      },
    }))

    setAddressSuggestions([])
    setIsDirty(true)
  }, [])

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen && currentStep === "welcome") {
      logWelcomeStart({
        checkoutData,
        cartItems: cart.items,
        subtotalPrice: cart.subtotalPrice,
        couponDiscount: cart.couponDiscount,
        fullHouseDiscount: cart.fullHouseDiscount,
        totalPrice: cart.totalPrice,
      })
    }
  }, [isOpen, currentStep, checkoutData, cart])

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12 px-6"
    >
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Apply for Professional Cleaning Service! ✨
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          We just need a few quick details to process your service application. This will only take 2 minutes!
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Takes less than 2 minutes</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your information is secure</span>
        </div>
        {formHistory.length > 0 && (
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <History className="h-4 w-4" />
            <span>Previous information available</span>
          </div>
        )}
      </div>

      <Button
        onClick={() => setCurrentStep("contact")}
        size="lg"
        className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Start Application!
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      {formHistory.length > 0 && (
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => {
              const lastEntry = formHistory[0]
              setCheckoutData(lastEntry)
              setCurrentStep("contact")
              toast({
                title: "Previous data loaded",
                description: "Your last session has been restored",
              })
            }}
            className="text-sm"
          >
            <History className="mr-2 h-4 w-4" />
            Use Previous Information
          </Button>
        </div>
      )}
    </motion.div>
  )

  const renderContactStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Nice to meet you! 👋</h2>
            <p className="text-muted-foreground">Tell us a bit about yourself</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">Step 1 of 2</Badge>
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6" ref={formRef}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-base font-medium">
              First Name *
            </Label>
            <div className="relative">
              <Input
                id="firstName"
                value={checkoutData.contact.firstName}
                onChange={(e) => handleInputChange("contact", "firstName", e.target.value)}
                onFocus={() => setFocusedField("firstName")}
                onBlur={() => setFocusedField(null)}
                className={`h-12 transition-all ${
                  errors.firstName
                    ? "border-red-500 focus:border-red-500"
                    : focusedField === "firstName"
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : ""
                }`}
                placeholder="John"
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              {validationInProgress.has("firstName") && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                </div>
              )}
            </div>
            {autoFillSuggestions.firstName?.length > 0 && (
              <div className="space-y-1">
                {autoFillSuggestions.firstName.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleAutoFillSuggestion("contact", "firstName", suggestion)}
                    className="text-sm text-blue-600 hover:text-blue-800 block"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {errors.firstName && (
              <p id="firstName-error" className="text-sm text-red-500 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-base font-medium">
              Last Name *
            </Label>
            <div className="relative">
              <Input
                id="lastName"
                value={checkoutData.contact.lastName}
                onChange={(e) => handleInputChange("contact", "lastName", e.target.value)}
                onFocus={() => setFocusedField("lastName")}
                onBlur={() => setFocusedField(null)}
                className={`h-12 transition-all ${
                  errors.lastName
                    ? "border-red-500 focus:border-red-500"
                    : focusedField === ""
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : ""
                }`}
                placeholder="Doe"
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              {validationInProgress.has("lastName") && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                </div>
              )}
            </div>
            {errors.lastName && (
              <p id="lastName-error" className="text-sm text-red-500 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address *
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={checkoutData.contact.email}
              onChange={(e) => handleInputChange("contact", "email", e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={`h-12 transition-all ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : focusedField === "email"
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : ""
              }`}
              placeholder="john.doe@example.com"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {validationInProgress.has("email") && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              </div>
            )}
          </div>
          {autoFillSuggestions.email?.length > 0 && (
            <div className="space-y-1">
              {autoFillSuggestions.email.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAutoFillSuggestion("contact", "email", suggestion)}
                  className="text-sm text-blue-600 hover:text-blue-800 block"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          {warnings.email && (
            <p className="text-sm text-amber-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {warnings.email}
            </p>
          )}
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
          {!errors.email && checkoutData.contact.email && (
            <p className="text-sm text-green-600 flex items-center gap-2">
              <Check className="h-4 w-4" />
              We'll send booking confirmations here
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number *
          </Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              value={checkoutData.contact.phone}
              onChange={(e) => handleInputChange("contact", "phone", e.target.value)}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
              className={`h-12 transition-all ${
                errors.phone
                  ? "border-red-500 focus:border-red-500"
                  : focusedField === "phone"
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : ""
              }`}
              placeholder="(555) 123-4567"
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {validationInProgress.has("phone") && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              </div>
            )}
          </div>
          {errors.phone && (
            <p id="phone-error" className="text-sm text-red-500 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {errors.phone}
            </p>
          )}
          {!errors.phone && checkoutData.contact.phone && (
            <p className="text-sm text-green-600 flex items-center gap-2">
              <Check className="h-4 w-4" />
              For service coordination and updates
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <Button
          onClick={() => handleStepTransition("address")}
          disabled={isSubmitting}
          size="lg"
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              Continue to Address
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )

  const renderAddressStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <MapPin className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Where should we work our magic? ✨</h2>
            <p className="text-muted-foreground">Tell us about your space</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">Step 2 of 2</Badge>
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span>Auto-saved</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">What type of space is this?</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "residential", icon: Home, label: "Home", desc: "House, apartment, condo" },
              { value: "commercial", icon: Building, label: "Business", desc: "Office, store, restaurant" },
              { value: "other", icon: Navigation, label: "Other", desc: "Something else" },
            ].map(({ value, icon: Icon, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange("address", "addressType", value)}
                className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all hover:shadow-md ${
                  checkoutData.address.addressType === value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="font-medium">{label}</span>
                <span className="text-xs text-muted-foreground text-center">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-base font-medium">
              Street Address *
            </Label>
            <div className="relative">
              <Input
                id="address"
                value={checkoutData.address.address}
                onChange={(e) => handleInputChange("address", "address", e.target.value)}
                onFocus={() => setFocusedField("address")}
                onBlur={() => setFocusedField(null)}
                className={`h-12 transition-all ${
                  errors.address
                    ? "border-red-500 focus:border-red-500"
                    : focusedField === "address"
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : ""
                }`}
                placeholder="123 Main Street"
                aria-describedby={errors.address ? "address-error" : undefined}
              />
              {isLoadingAddressSuggestions && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                </div>
              )}
            </div>
            {addressSuggestions.length > 0 && (
              <div className="border rounded-lg bg-white dark:bg-gray-800 shadow-lg max-h-48 overflow-y-auto">
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.place_id || index}
                    type="button"
                    onClick={() => handleAddressSuggestion(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0"
                  >
                    <div className="font-medium">{suggestion.formatted_address}</div>
                  </button>
                ))}
              </div>
            )}
            {errors.address && (
              <p id="address-error" className="text-sm text-red-500 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {errors.address}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2" className="text-base font-medium">
              Apartment, Suite, etc. (Optional)
            </Label>
            <Input
              id="address2"
              value={checkoutData.address.address2}
              onChange={(e) => handleInputChange("address", "address2", e.target.value)}
              className="h-12"
              placeholder="Apt 4B, Suite 200, Floor 3"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-base font-medium">
                City *
              </Label>
              <Select
                value={checkoutData.address.city}
                onValueChange={(value) => handleInputChange("address", "city", value)}
              >
                <SelectTrigger className={`h-12 ${errors.city ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Glendale">Glendale</SelectItem>
                  <SelectItem value="Phoenix">Phoenix</SelectItem>
                  <SelectItem value="Peoria">Peoria</SelectItem>
                </SelectContent>
              </Select>
              {errors.city && (
                <p id="city-error" className="text-sm text-red-500">
                  {errors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-base font-medium">
                State *
              </Label>
              <Select
                value={checkoutData.address.state}
                onValueChange={(value) => handleInputChange("address", "state", value)}
              >
                <SelectTrigger className={`h-12 ${errors.state ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Arizona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AZ">Arizona</SelectItem>
                </SelectContent>
              </Select>
              {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-base font-medium">
                ZIP Code *
              </Label>
              <div className="relative">
                <Input
                  id="zipCode"
                  value={checkoutData.address.zipCode}
                  onChange={(e) => handleInputChange("address", "zipCode", e.target.value)}
                  onFocus={() => setFocusedField("zipCode")}
                  onBlur={() => setFocusedField(null)}
                  className={`h-12 transition-all ${
                    errors.zipCode
                      ? "border-red-500 focus:border-red-500"
                      : focusedField === "zipCode"
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : ""
                  }`}
                  placeholder="85001"
                  maxLength={5}
                  aria-describedby={errors.zipCode ? "zipCode-error" : undefined}
                />
                {validationInProgress.has("zipCode") && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                  </div>
                )}
              </div>
              {errors.zipCode && (
                <p id="zipCode-error" className="text-sm text-red-500">
                  {errors.zipCode}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Enter a valid Arizona ZIP code</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions" className="text-base font-medium">
              Anything special we should know? (Optional)
            </Label>
            <Textarea
              id="specialInstructions"
              value={checkoutData.address.specialInstructions}
              onChange={(e) => handleInputChange("address", "specialInstructions", e.target.value)}
              placeholder="Entry instructions, pets, areas to focus on or avoid, parking info..."
              className="h-24 resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Help us provide the best service by sharing any important details
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t space-y-4">
        <Button
          onClick={() => handleStepTransition("confirmation")}
          disabled={isSubmitting}
          size="lg"
          className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            <>
              Review My Order
              <Check className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <Button variant="ghost" onClick={() => setCurrentStep("contact")} className="w-full">
          ← Back to Contact Info
        </Button>
      </div>
    </motion.div>
  )

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 flex flex-col"
        aria-labelledby="application-title"
        aria-describedby="application-description"
      >
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-green-950/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 id="application-title" className="text-xl font-bold">
                {currentStep === "welcome" && "Welcome!"}
                {currentStep === "contact" && "Contact Info"}
                {currentStep === "address" && "Service Address"}
                {currentStep === "confirmation" && "Almost Done!"}
              </h1>
              <p id="application-description" className="text-sm text-muted-foreground">
                {currentStep === "welcome" && "Let's get started with your cleaning service"}
                {currentStep === "contact" && "Tell us how to reach you"}
                {currentStep === "address" && "Where should we clean?"}
                {currentStep === "confirmation" && "Reviewing your information"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isDirty && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => performAutoSave(checkoutData, true)}
                  className="text-xs"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Close checkout">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Card className="border-0 shadow-none h-full">
            <CardContent className="p-0 h-full">
              <AnimatePresence mode="wait">
                {currentStep === "welcome" && renderWelcomeStep()}
                {currentStep === "contact" && renderContactStep()}
                {currentStep === "address" && renderAddressStep()}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <div className="flex-shrink-0 border-t bg-gray-50 dark:bg-gray-900/50 p-4">
          <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>100% Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { ApplicationSidePanel as ApplicationSidepanel }
