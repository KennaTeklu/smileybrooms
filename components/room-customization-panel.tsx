"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  Repeat,
  PlusCircle,
  MinusCircle,
  Sliders,
  Home,
  ChevronRight,
  Search,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { RoomTier, RoomAddOn, RoomReduction } from "@/components/room-configurator"

interface MatrixService {
  id: string
  name: string
  price: number
  description: string
}

interface RoomCustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  roomName: string
  roomIcon: string
  roomCount: number
  baseTier: RoomTier
  tiers: RoomTier[]
  addOns: RoomAddOn[]
  reductions: RoomReduction[]
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  matrixAddServices?: MatrixService[]
  matrixRemoveServices?: MatrixService[]
  selectedMatrixAddServices?: string[]
  selectedMatrixRemoveServices?: string[]
  frequencyOptions?: { id: string; name: string; discount: number }[]
  selectedFrequency?: string
  onConfigChange: (config: {
    selectedTier: string
    selectedAddOns: string[]
    selectedReductions: string[]
    totalPrice: number
  }) => void
  onMatrixSelectionChange?: (selection: { addServices: string[]; removeServices: string[] }) => void
  onFrequencyChange?: (frequency: string, discount: number) => void
}

export function RoomCustomizationPanel({
  isOpen,
  onClose,
  roomName,
  roomIcon,
  roomCount,
  baseTier,
  tiers,
  addOns,
  reductions,
  selectedTier,
  selectedAddOns,
  selectedReductions,
  matrixAddServices = [],
  matrixRemoveServices = [],
  selectedMatrixAddServices = [],
  selectedMatrixRemoveServices = [],
  frequencyOptions = [
    { id: "one_time", name: "One-time Service", discount: 0 },
    { id: "weekly", name: "Weekly Service", discount: 15 },
    { id: "bi_weekly", name: "Bi-weekly Service", discount: 10 },
    { id: "monthly", name: "Monthly Service", discount: 5 },
  ],
  selectedFrequency = "one_time",
  onConfigChange,
  onMatrixSelectionChange,
  onFrequencyChange,
}: RoomCustomizationPanelProps) {
  const [localSelectedTier, setLocalSelectedTier] = useState(selectedTier)
  const [localSelectedAddOns, setLocalSelectedAddOns] = useState<string[]>(selectedAddOns)
  const [localSelectedReductions, setLocalSelectedReductions] = useState<string[]>(selectedReductions)
  const [localSelectedMatrixAddServices, setLocalSelectedMatrixAddServices] =
    useState<string[]>(selectedMatrixAddServices)
  const [localSelectedMatrixRemoveServices, setLocalSelectedMatrixRemoveServices] =
    useState<string[]>(selectedMatrixRemoveServices)
  const [localSelectedFrequency, setLocalSelectedFrequency] = useState(selectedFrequency)
  const [activeTab, setActiveTab] = useState("basic")
  const [expandedSections, setExpandedSections] = useState({
    tiers: true,
    addOns: false,
    reductions: false,
    matrix: false,
    frequency: false,
  })
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>("tiers")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Refs for scroll-to-section functionality
  const sectionRefs = {
    tiers: useRef<HTMLDivElement>(null),
    addOns: useRef<HTMLDivElement>(null),
    reductions: useRef<HTMLDivElement>(null),
    matrixAdd: useRef<HTMLDivElement>(null),
    matrixRemove: useRef<HTMLDivElement>(null),
    specialInstructions: useRef<HTMLDivElement>(null),
    frequency: useRef<HTMLDivElement>(null),
    duration: useRef<HTMLDivElement>(null),
  }

  // Calculate the total price based on selections
  const calculateTotalPrice = () => {
    const tierPrice = tiers.find((tier) => tier.name === localSelectedTier)?.price || baseTier.price
    const addOnsTotal = localSelectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)
    const reductionsTotal = localSelectedReductions.reduce((total, reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      return total + (reduction?.discount || 0)
    }, 0)

    // Matrix services
    const matrixAddTotal = localSelectedMatrixAddServices.reduce((total, serviceId) => {
      const service = matrixAddServices.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
    const matrixRemoveTotal = localSelectedMatrixRemoveServices.reduce((total, serviceId) => {
      const service = matrixRemoveServices.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)

    // Calculate base price with all additions and reductions
    const basePrice = tierPrice + addOnsTotal - reductionsTotal + matrixAddTotal - matrixRemoveTotal

    // Apply frequency discount if applicable
    const selectedFrequencyOption = frequencyOptions.find((option) => option.id === localSelectedFrequency)
    const discount = selectedFrequencyOption?.discount || 0
    const discountAmount = basePrice * (discount / 100)

    return basePrice - discountAmount
  }

  // Update parent component when configuration changes
  const updateConfiguration = () => {
    const totalPrice = calculateTotalPrice()
    onConfigChange({
      selectedTier: localSelectedTier,
      selectedAddOns: localSelectedAddOns,
      selectedReductions: localSelectedReductions,
      totalPrice,
    })

    // Update matrix selections if callback provided
    if (onMatrixSelectionChange) {
      onMatrixSelectionChange({
        addServices: localSelectedMatrixAddServices,
        removeServices: localSelectedMatrixRemoveServices,
      })
    }

    // Update frequency if callback provided
    if (onFrequencyChange) {
      const selectedFrequencyOption = frequencyOptions.find((option) => option.id === localSelectedFrequency)
      if (selectedFrequencyOption) {
        onFrequencyChange(localSelectedFrequency, selectedFrequencyOption.discount)
      }
    }
  }

  // Handle tier selection
  const handleTierChange = (tier: string) => {
    setLocalSelectedTier(tier)
  }

  // Handle add-on selection
  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    setLocalSelectedAddOns((prev) => {
      if (checked) {
        return [...prev, addOnId]
      } else {
        return prev.filter((id) => id !== addOnId)
      }
    })
  }

  // Handle reduction selection
  const handleReductionChange = (reductionId: string, checked: boolean) => {
    setLocalSelectedReductions((prev) => {
      if (checked) {
        return [...prev, reductionId]
      } else {
        return prev.filter((id) => id !== reductionId)
      }
    })
  }

  // Handle matrix add service selection
  const handleMatrixAddServiceChange = (serviceId: string, checked: boolean) => {
    setLocalSelectedMatrixAddServices((prev) => {
      if (checked) {
        return [...prev, serviceId]
      } else {
        return prev.filter((id) => id !== serviceId)
      }
    })
  }

  // Handle matrix remove service selection
  const handleMatrixRemoveServiceChange = (serviceId: string, checked: boolean) => {
    setLocalSelectedMatrixRemoveServices((prev) => {
      if (checked) {
        return [...prev, serviceId]
      } else {
        return prev.filter((id) => id !== serviceId)
      }
    })
  }

  // Handle frequency selection
  const handleFrequencyChange = (frequency: string) => {
    setLocalSelectedFrequency(frequency)
  }

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Scroll to section
  const scrollToSection = (sectionName: string) => {
    const sectionRef = sectionRefs[sectionName as keyof typeof sectionRefs]
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionName)

      // If on mobile, close the mobile menu after selection
      if (showMobileMenu) {
        setShowMobileMenu(false)
      }
    }
  }

  // Toggle mega menu
  const toggleMegaMenu = (menuName: string) => {
    if (activeMegaMenu === menuName) {
      setActiveMegaMenu(null)
    } else {
      setActiveMegaMenu(menuName)
    }
  }

  // Update configuration when local state changes
  useEffect(() => {
    updateConfiguration()
  }, [
    localSelectedTier,
    localSelectedAddOns,
    localSelectedReductions,
    localSelectedMatrixAddServices,
    localSelectedMatrixRemoveServices,
    localSelectedFrequency,
  ])

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Get frequency discount
  const getFrequencyDiscount = () => {
    const selectedFrequencyOption = frequencyOptions.find((option) => option.id === localSelectedFrequency)
    return selectedFrequencyOption?.discount || 0
  }

  // Get frequency name
  const getFrequencyName = () => {
    const selectedFrequencyOption = frequencyOptions.find((option) => option.id === localSelectedFrequency)
    return selectedFrequencyOption?.name || "One-time Service"
  }

  // Get breadcrumb path based on active tab and section
  const getBreadcrumbPath = () => {
    const tabNames = {
      basic: "Basic Settings",
      advanced: "Advanced Options",
      schedule: "Schedule",
    }

    const sectionNames: Record<string, string> = {
      tiers: "Service Tiers",
      addOns: "Additional Services",
      reductions: "Service Reductions",
      matrixAdd: "Specialized Add-ons",
      matrixRemove: "Service Exclusions",
      specialInstructions: "Special Instructions",
      frequency: "Service Frequency",
      duration: "Estimated Duration",
    }

    return [
      { name: roomName, onClick: () => {} },
      { name: tabNames[activeTab as keyof typeof tabNames], onClick: () => {} },
      { name: sectionNames[activeSection], onClick: () => scrollToSection(activeSection) },
    ]
  }

  // Render the price summary
  const renderPriceSummary = () => (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Base Service:</span>
            <span>${tiers.find((t) => t.name === localSelectedTier)?.price.toFixed(2)}</span>
          </div>
          {localSelectedAddOns.length > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>Add-ons:</span>
              <span>
                +$
                {localSelectedAddOns
                  .reduce((total, addOnId) => {
                    const addOn = addOns.find((a) => a.id === addOnId)
                    return total + (addOn?.price || 0)
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
          )}
          {localSelectedReductions.length > 0 && (
            <div className="flex justify-between items-center text-red-600">
              <span>Reductions:</span>
              <span>
                -$
                {localSelectedReductions
                  .reduce((total, reductionId) => {
                    const reduction = reductions.find((r) => r.id === reductionId)
                    return total + (reduction?.discount || 0)
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
          )}
          {localSelectedMatrixAddServices.length > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>Specialized Add-ons:</span>
              <span>
                +$
                {localSelectedMatrixAddServices
                  .reduce((total, serviceId) => {
                    const service = matrixAddServices.find((s) => s.id === serviceId)
                    return total + (service?.price || 0)
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
          )}
          {localSelectedMatrixRemoveServices.length > 0 && (
            <div className="flex justify-between items-center text-red-600">
              <span>Service Exclusions:</span>
              <span>
                -$
                {localSelectedMatrixRemoveServices
                  .reduce((total, serviceId) => {
                    const service = matrixRemoveServices.find((s) => s.id === serviceId)
                    return total + (service?.price || 0)
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
          )}
          {getFrequencyDiscount() > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>{getFrequencyName()} Discount:</span>
              <span>-{getFrequencyDiscount()}%</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total per Room:</span>
            <span>${calculateTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Total for {roomCount} {roomCount === 1 ? "room" : "rooms"}:
            </span>
            <span>${(calculateTotalPrice() * roomCount).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Render mega menu content
  const renderMegaMenu = () => {
    if (!activeMegaMenu) return null

    const menuContent = {
      basic: (
        <div className="p-4 bg-white border rounded-lg shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2 text-blue-700">Service Options</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("basic")
                      scrollToSection("tiers")
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600 flex items-center gap-1"
                  >
                    <Settings className="h-3 w-3" />
                    Service Tiers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("basic")
                      scrollToSection("addOns")
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600 flex items-center gap-1"
                  >
                    <PlusCircle className="h-3 w-3" />
                    Additional Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("basic")
                      scrollToSection("reductions")
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600 flex items-center gap-1"
                  >
                    <MinusCircle className="h-3 w-3" />
                    Service Reductions
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-blue-700">Quick Actions</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setLocalSelectedTier(tiers[0].name)
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600"
                  >
                    Reset to Basic Tier
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setLocalSelectedAddOns([])
                      setLocalSelectedReductions([])
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600"
                  >
                    Clear All Add-ons & Reductions
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
      advanced: (
        <div className="p-4 bg-white border rounded-lg shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2 text-blue-700">Advanced Options</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("advanced")
                      scrollToSection("matrixAdd")
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600 flex items-center gap-1"
                  >
                    <PlusCircle className="h-3 w-3" />
                    Specialized Add-ons
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("advanced")
                      scrollToSection("matrixRemove")
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600 flex items-center gap-1"
                  >
                    <MinusCircle className="h-3 w-3" />
                    Service Exclusions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("advanced")
                      scrollToSection("specialInstructions")
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600 flex items-center gap-1"
                  >
                    <Info className="h-3 w-3" />
                    Special Instructions
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-blue-700">Quick Actions</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setLocalSelectedMatrixAddServices([])
                      setLocalSelectedMatrixRemoveServices([])
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600"
                  >
                    Clear All Specialized Options
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
      schedule: (
        <div className="p-4 bg-white border rounded-lg shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2 text-blue-700">Schedule Options</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("schedule")
                      scrollToSection("frequency")
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600 flex items-center gap-1"
                  >
                    <Repeat className="h-3 w-3" />
                    Service Frequency
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("schedule")
                      scrollToSection("duration")
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600 flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    Estimated Duration
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-blue-700">Quick Actions</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setLocalSelectedFrequency("one_time")
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600"
                  >
                    Set to One-time Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setLocalSelectedFrequency("weekly")
                      setActiveMegaMenu(null)
                    }}
                    className="text-sm hover:text-blue-600"
                  >
                    Set to Weekly Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    }

    return (
      <div className="absolute top-full left-0 right-0 z-50 mt-1 px-4">
        {menuContent[activeMegaMenu as keyof typeof menuContent]}
      </div>
    )
  }

  // Render breadcrumb navigation
  const renderBreadcrumbs = () => {
    const breadcrumbs = getBreadcrumbPath()

    return (
      <nav className="flex items-center text-sm py-2 px-4 bg-gray-50 border-y">
        <button onClick={() => {}} className="text-blue-600 hover:text-blue-800 flex items-center">
          <Home className="h-3 w-3 mr-1" />
        </button>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
            <button
              onClick={crumb.onClick}
              className={cn(
                "hover:text-blue-600",
                index === breadcrumbs.length - 1 ? "font-medium text-gray-800" : "text-gray-600",
              )}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </nav>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out",
          "w-full sm:w-[480px] lg:w-[520px] xl:w-[600px]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{roomIcon}</span>
              <div>
                <h2 className="text-xl font-bold">{roomName}</h2>
                <p className="text-sm text-gray-600">
                  {roomCount} {roomCount === 1 ? "room" : "rooms"} selected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white">
                ${calculateTotalPrice().toFixed(2)}
              </Badge>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button - Only visible on small screens */}
          <div className="md:hidden border-b p-2 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-4 w-4" />
              <span>Menu</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu - Only visible when toggled on small screens */}
          {showMobileMenu && (
            <div className="md:hidden border-b bg-white p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Basic Settings</h3>
                  <ul className="space-y-2 pl-2">
                    <li>
                      <button
                        onClick={() => {
                          setActiveTab("basic")
                          scrollToSection("tiers")
                        }}
                        className="text-sm hover:text-blue-600 flex items-center gap-1"
                      >
                        <Settings className="h-3 w-3" />
                        Service Tiers
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveTab("basic")
                          scrollToSection("addOns")
                        }}
                        className="text-sm hover:text-blue-600 flex items-center gap-1"
                      >
                        <PlusCircle className="h-3 w-3" />
                        Additional Services
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveTab("basic")
                          scrollToSection("reductions")
                        }}
                        className="text-sm hover:text-blue-600 flex items-center gap-1"
                      >
                        <MinusCircle className="h-3 w-3" />
                        Service Reductions
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Advanced Options</h3>
                  <ul className="space-y-2 pl-2">
                    <li>
                      <button
                        onClick={() => {
                          setActiveTab("advanced")
                          scrollToSection("matrixAdd")
                        }}
                        className="text-sm hover:text-blue-600 flex items-center gap-1"
                      >
                        <PlusCircle className="h-3 w-3" />
                        Specialized Add-ons
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveTab("advanced")
                          scrollToSection("matrixRemove")
                        }}
                        className="text-sm hover:text-blue-600 flex items-center gap-1"
                      >
                        <MinusCircle className="h-3 w-3" />
                        Service Exclusions
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveTab("advanced")
                          scrollToSection("specialInstructions")
                        }}
                        className="text-sm hover:text-blue-600 flex items-center gap-1"
                      >
                        <Info className="h-3 w-3" />
                        Special Instructions
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Schedule</h3>
                  <ul className="space-y-2 pl-2">
                    <li>
                      <button
                        onClick={() => {
                          setActiveTab("schedule")
                          scrollToSection("frequency")
                        }}
                        className="text-sm hover:text-blue-600 flex items-center gap-1"
                      >
                        <Repeat className="h-3 w-3" />
                        Service Frequency
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveTab("schedule")
                          scrollToSection("duration")
                        }}
                        className="text-sm hover:text-blue-600 flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        Estimated Duration
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Breadcrumb Navigation */}
          {renderBreadcrumbs()}

          {/* Sticky Tabs Navigation */}
          <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
            <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 relative">
                <TabsTrigger value="basic" className="text-xs sm:text-sm" onClick={() => toggleMegaMenu("basic")}>
                  <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Basic</span>
                  <ChevronDown
                    className={cn("h-3 w-3 ml-1 transition-transform", activeMegaMenu === "basic" ? "rotate-180" : "")}
                  />
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs sm:text-sm" onClick={() => toggleMegaMenu("advanced")}>
                  <Sliders className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Advanced</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 ml-1 transition-transform",
                      activeMegaMenu === "advanced" ? "rotate-180" : "",
                    )}
                  />
                </TabsTrigger>
                <TabsTrigger value="schedule" className="text-xs sm:text-sm" onClick={() => toggleMegaMenu("schedule")}>
                  <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Schedule</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 ml-1 transition-transform",
                      activeMegaMenu === "schedule" ? "rotate-180" : "",
                    )}
                  />
                </TabsTrigger>

                {/* Mega Menu */}
                {renderMegaMenu()}
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                <TabsContent value="basic" className="mt-0 space-y-6">
                  {/* Service Tiers Section */}
                  <Card ref={sectionRefs.tiers}>
                    <CardHeader className="cursor-pointer" onClick={() => toggleSection("tiers")}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">Service Tiers</CardTitle>
                        </div>
                        {expandedSections.tiers ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                      <CardDescription>Choose your cleaning intensity level</CardDescription>
                    </CardHeader>
                    {expandedSections.tiers && (
                      <CardContent>
                        <RadioGroup value={localSelectedTier} onValueChange={handleTierChange} className="space-y-3">
                          {tiers.map((tier, index) => (
                            <div
                              key={tier.name}
                              className={cn(
                                "p-3 rounded-lg border transition-colors",
                                localSelectedTier === tier.name ? "border-blue-500 bg-blue-50" : "border-gray-200",
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <Label htmlFor={`tier-${tier.name}`} className="font-medium">
                                      {tier.name}
                                    </Label>
                                    <Badge
                                      variant={index === 0 ? "default" : index === 1 ? "secondary" : "destructive"}
                                    >
                                      ${tier.price}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                                  <div className="space-y-1">
                                    {tier.features.slice(0, 3).map((feature, i) => (
                                      <div key={i} className="text-xs flex items-start">
                                        <span className="text-green-500 mr-1">✓</span>
                                        <span>{feature}</span>
                                      </div>
                                    ))}
                                    {tier.features.length > 3 && (
                                      <div className="text-xs text-gray-500">
                                        +{tier.features.length - 3} more features
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    )}
                  </Card>

                  {/* Add-ons Section */}
                  {addOns.length > 0 && (
                    <Card ref={sectionRefs.addOns}>
                      <CardHeader className="cursor-pointer" onClick={() => toggleSection("addOns")}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-green-100 rounded flex items-center justify-center">
                              <span className="text-green-600 text-xs font-bold">+</span>
                            </div>
                            <CardTitle className="text-lg">Additional Services</CardTitle>
                          </div>
                          {expandedSections.addOns ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                        <CardDescription>Enhance your cleaning service</CardDescription>
                      </CardHeader>
                      {expandedSections.addOns && (
                        <CardContent>
                          <div className="space-y-3">
                            {addOns.map((addOn) => (
                              <div key={addOn.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                                <Checkbox
                                  id={`addon-${addOn.id}`}
                                  checked={localSelectedAddOns.includes(addOn.id)}
                                  onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked === true)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <Label htmlFor={`addon-${addOn.id}`} className="font-medium">
                                      {addOn.name}
                                    </Label>
                                    <Badge variant="outline" className="text-green-600">
                                      +${addOn.price.toFixed(2)}
                                    </Badge>
                                  </div>
                                  {addOn.description && (
                                    <p className="text-xs text-gray-500 mt-1">{addOn.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )}

                  {/* Reductions Section */}
                  {reductions.length > 0 && (
                    <Card ref={sectionRefs.reductions}>
                      <CardHeader className="cursor-pointer" onClick={() => toggleSection("reductions")}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-red-100 rounded flex items-center justify-center">
                              <span className="text-red-600 text-xs font-bold">-</span>
                            </div>
                            <CardTitle className="text-lg">Service Reductions</CardTitle>
                          </div>
                          {expandedSections.reductions ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                        <CardDescription>Remove services you don't need</CardDescription>
                      </CardHeader>
                      {expandedSections.reductions && (
                        <CardContent>
                          <div className="space-y-3">
                            {reductions.map((reduction) => (
                              <div
                                key={reduction.id}
                                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                              >
                                <Checkbox
                                  id={`reduction-${reduction.id}`}
                                  checked={localSelectedReductions.includes(reduction.id)}
                                  onCheckedChange={(checked) => handleReductionChange(reduction.id, checked === true)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <Label htmlFor={`reduction-${reduction.id}`} className="font-medium">
                                      {reduction.name}
                                    </Label>
                                    <Badge variant="outline" className="text-red-600">
                                      -${reduction.discount.toFixed(2)}
                                    </Badge>
                                  </div>
                                  {reduction.description && (
                                    <p className="text-xs text-gray-500 mt-1">{reduction.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="advanced" className="mt-0 space-y-6">
                  {/* Matrix Add Services */}
                  {matrixAddServices.length > 0 && (
                    <Card ref={sectionRefs.matrixAdd}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <PlusCircle className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-lg">Specialized Add-ons</CardTitle>
                        </div>
                        <CardDescription>Additional specialized services for this room</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {matrixAddServices.map((service) => (
                            <div key={service.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                              <Checkbox
                                id={`matrix-add-${service.id}`}
                                checked={localSelectedMatrixAddServices.includes(service.id)}
                                onCheckedChange={(checked) =>
                                  handleMatrixAddServiceChange(service.id, checked === true)
                                }
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <Label htmlFor={`matrix-add-${service.id}`} className="font-medium">
                                    {service.name}
                                  </Label>
                                  <Badge variant="outline" className="text-green-600">
                                    +${service.price.toFixed(2)}
                                  </Badge>
                                </div>
                                {service.description && (
                                  <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Matrix Remove Services */}
                  {matrixRemoveServices.length > 0 && (
                    <Card ref={sectionRefs.matrixRemove}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <MinusCircle className="h-5 w-5 text-red-600" />
                          <CardTitle className="text-lg">Service Exclusions</CardTitle>
                        </div>
                        <CardDescription>Remove specific services to customize your cleaning</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {matrixRemoveServices.map((service) => (
                            <div key={service.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                              <Checkbox
                                id={`matrix-remove-${service.id}`}
                                checked={localSelectedMatrixRemoveServices.includes(service.id)}
                                onCheckedChange={(checked) =>
                                  handleMatrixRemoveServiceChange(service.id, checked === true)
                                }
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <Label htmlFor={`matrix-remove-${service.id}`} className="font-medium">
                                    {service.name}
                                  </Label>
                                  <Badge variant="outline" className="text-red-600">
                                    -${service.price.toFixed(2)}
                                  </Badge>
                                </div>
                                {service.description && (
                                  <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Special Instructions */}
                  <Card ref={sectionRefs.specialInstructions}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Special Instructions</CardTitle>
                      </div>
                      <CardDescription>Add any specific instructions for this room</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        className="w-full p-3 border rounded-md h-24 text-sm"
                        placeholder="Enter any special instructions or notes for the cleaning team..."
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schedule" className="mt-0 space-y-6">
                  {/* Frequency Selection */}
                  <Card ref={sectionRefs.frequency}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Repeat className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Service Frequency</CardTitle>
                      </div>
                      <CardDescription>Choose how often you'd like this service</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={localSelectedFrequency}
                        onValueChange={handleFrequencyChange}
                        className="space-y-3"
                      >
                        {frequencyOptions.map((option) => (
                          <div
                            key={option.id}
                            className={cn(
                              "p-3 rounded-lg border transition-colors",
                              localSelectedFrequency === option.id ? "border-blue-500 bg-blue-50" : "border-gray-200",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={option.id} id={`frequency-${option.id}`} />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <Label htmlFor={`frequency-${option.id}`} className="font-medium">
                                    {option.name}
                                  </Label>
                                  {option.discount > 0 && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      {option.discount}% off
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  {/* Estimated Duration */}
                  <Card ref={sectionRefs.duration}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Estimated Duration</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Estimated cleaning time:</span>
                          <span className="text-lg font-bold">
                            {Math.max(1, Math.ceil(roomCount * 0.75))}{" "}
                            {Math.max(1, Math.ceil(roomCount * 0.75)) === 1 ? "hour" : "hours"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          This is an estimate based on your selected tier and add-ons. Actual time may vary depending on
                          the condition of your space.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Price Summary - Always visible at the bottom */}
                {renderPriceSummary()}
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={onClose} className="flex-1">
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
