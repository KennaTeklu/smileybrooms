"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Repeat,
  PlusCircle,
  MinusCircle,
  Home,
  ChevronRight,
  Search,
  Filter,
  Star,
  StarHalf,
  Heart,
  Palette,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  LayoutGrid,
  ArrowUpDown,
  Save,
  RotateCcw,
  Bookmark,
  Pin,
  PinOff,
  Trash,
  AlertCircle,
  Sparkles,
  MoreHorizontal,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { RoomTier, RoomAddOn, RoomReduction } from "@/components/room-configurator"

interface MatrixService {
  id: string
  name: string
  price: number
  description: string
  category?: string
  popularity?: number
  tags?: string[]
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

// Define theme types for customization
type ThemeMode = "light" | "dark" | "system"
type LayoutMode = "comfortable" | "compact" | "spacious"
type ColorScheme = "blue" | "purple" | "green" | "orange" | "neutral"

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
  // State for selections
  const [localSelectedTier, setLocalSelectedTier] = useState(selectedTier)
  const [localSelectedAddOns, setLocalSelectedAddOns] = useState<string[]>(selectedAddOns)
  const [localSelectedReductions, setLocalSelectedReductions] = useState<string[]>(selectedReductions)
  const [localSelectedMatrixAddServices, setLocalSelectedMatrixAddServices] =
    useState<string[]>(selectedMatrixAddServices)
  const [localSelectedMatrixRemoveServices, setLocalSelectedMatrixRemoveServices] =
    useState<string[]>(selectedMatrixRemoveServices)
  const [localSelectedFrequency, setLocalSelectedFrequency] = useState(selectedFrequency)
  
  // Navigation state
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
  
  // Search and filtering state
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCriteria, setFilterCriteria] = useState<{
    priceRange: [number, number]
    categories: string[]
    sortBy: "price" | "popularity" | "name" | "newest"
    sortDirection: "asc" | "desc"
  }>({
    priceRange: [0, 100],
    categories: [],
    sortBy: "price",
    sortDirection: "asc",
  })
  const [showFilters, setShowFilters] = useState(false)
  
  // Customization state
  const [themeMode, setThemeMode] = useState<ThemeMode>("light")
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("comfortable")
  const [colorScheme, setColorScheme] = useState<ColorScheme>("blue")
  const [fontSize, setFontSize] = useState(16)
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(false)
  
  // Personalization state
  const [favorites, setFavorites] = useState<string[]>([])
  const [pinnedSections, setPinnedSections] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [savedConfigurations, setSavedConfigurations] = useState<Array<{
    id: string
    name: string
    tier: string
    addOns: string[]
    reductions: string[]
    matrixAddServices: string[]
    matrixRemoveServices: string[]
    frequency: string
  }>>([])
  
  // Performance and loading state
  const [isPending, startTransition] = useTransition()
  const [visibleSections, setVisibleSections] = useState<string[]>(["tiers"])
  const [loadedSections, setLoadedSections] = useState<string[]>(["tiers"])
  const [loadProgress, setLoadProgress] = useState(0)
  
  // Accessibility state
  const [keyboardNavigationEnabled, setKeyboardNavigationEnabled] = useState(true)
  const [highContrastMode, setHighContrastMode] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [screenReaderHints, setScreenReaderHints] = useState(true)
  
  // Animation state
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  
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
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Calculate the total price based on selections
  const calculateTotalPrice = useCallback(() => {
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
  }, [
    tiers,
    localSelectedTier,
    baseTier.price,
    localSelectedAddOns,
    addOns,
    localSelectedReductions,
    reductions,
    localSelectedMatrixAddServices,
    matrixAddServices,
    localSelectedMatrixRemoveServices,
    matrixRemoveServices,
    localSelectedFrequency,
    frequencyOptions,
  ])

  // Update parent component when configuration changes
  const updateConfiguration = useCallback(() => {
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
  }, [
    calculateTotalPrice,
    localSelectedTier,
    localSelectedAddOns,
    localSelectedReductions,
    localSelectedMatrixAddServices,
    localSelectedMatrixRemoveServices,
    localSelectedFrequency,
    onConfigChange,
    onMatrixSelectionChange,
    onFrequencyChange,
    frequencyOptions,
  ])

  // Handle tier selection
  const handleTierChange = (tier: string) => {
    setLocalSelectedTier(tier)
    addToRecentlyViewed(`tier-${tier}`)
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
    addToRecentlyViewed(`addon-${addOnId}`)
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
    addToRecentlyViewed(`reduction-${reductionId}`)
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
    addToRecentlyViewed(`matrix-add-${serviceId}`)
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
    addToRecentlyViewed(`matrix-remove-${serviceId}`)
  }

  // Handle frequency selection
  const handleFrequencyChange = (frequency: string) => {
    setLocalSelectedFrequency(frequency)
    addToRecentlyViewed(`frequency-${frequency}`)
  }

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
    
    // If expanding a section, ensure it's loaded
    if (!expandedSections[section]) {
      loadSection(section)
    }
  }

  // Load a section dynamically
  const loadSection = (section: string) => {
    if (!loadedSections.includes(section)) {
      startTransition(() => {
        setLoadedSections((prev) => [...prev, section])
        setLoadProgress((prev) => Math.min(100, prev + 20))
      })
    }
    
    if (!visibleSections.includes(section)) {
      setVisibleSections((prev) => [...prev, section])
    }
  }

  // Scroll to section
  const scrollToSection = (sectionName: string) => {
    const sectionRef = sectionRefs[sectionName as keyof typeof sectionRefs]
    if (sectionRef && sectionRef.current) {
      // Ensure the section is loaded before scrolling
      loadSection(sectionName)
      
      // Use smooth scrolling if animations are enabled
      sectionRef.current.scrollIntoView({ 
        behavior: animationsEnabled && !reducedMotion ? "smooth" : "auto",
        block: "start"
      })
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
  
  // Toggle favorite status
  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }
  
  // Toggle pinned section
  const togglePinnedSection = (sectionId: string) => {
    setPinnedSections((prev) => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }
  
  // Add to recently viewed
  const addToRecentlyViewed = (itemId: string) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter(id => id !== itemId)
      // Add to beginning of array and limit to 10 items
      return [itemId, ...filtered].slice(0, 10)
    })
  }
  
  // Save current configuration
  const saveCurrentConfiguration = (name: string) => {
    const newConfig = {
      id: `config-${Date.now()}`,
      name,
      tier: localSelectedTier,
      addOns: [...localSelectedAddOns],
      reductions: [...localSelectedReductions],
      matrixAddServices: [...localSelectedMatrixAddServices],
      matrixRemoveServices: [...localSelectedMatrixRemoveServices],
      frequency: localSelectedFrequency
    }
    
    setSavedConfigurations((prev) => [...prev, newConfig])
  }
  
  // Load a saved configuration
  const loadSavedConfiguration = (configId: string) => {
    const config = savedConfigurations.find(c => c.id === configId)
    if (config) {
      setLocalSelectedTier(config.tier)
      setLocalSelectedAddOns(config.addOns)
      setLocalSelectedReductions(config.reductions)
      setLocalSelectedMatrixAddServices(config.matrixAddServices)
      setLocalSelectedMatrixRemoveServices(config.matrixRemoveServices)
      setLocalSelectedFrequency(config.frequency)
    }
  }
  
  // Filter services based on search and filter criteria
  const filterServices = (services: MatrixService[], query: string, criteria: typeof filterCriteria) => {
    return services.filter(service => {
      // Search query filter
      const matchesQuery = query === "" || 
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(query.toLowerCase())) ||
        (service.tags && service.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      
      // Price range filter
      const matchesPrice = service.price >= criteria.priceRange[0] && service.price <= criteria.priceRange[1]
      
      // Category filter
      const matchesCategory = criteria.categories.length === 0 || 
        (service.category && criteria.categories.includes(service.category))
      
      return matchesQuery && matchesPrice && matchesCategory
    }).sort((a, b) => {
      // Sort by selected criteria
      switch (criteria.sortBy) {
        case "price":
          return criteria.sortDirection === "asc" ? a.price - b.price : b.price - a.price
        case "popularity":
          return criteria.sortDirection === "asc" 
            ? (a.popularity || 0) - (b.popularity || 0) 
            : (b.popularity || 0) - (a.popularity || 0)
        case "name":
          return criteria.sortDirection === "asc" 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name)
        default:
          return 0
      }
    })
  }
  
  // Memoized filtered services
  const filteredMatrixAddServices = useMemo(() => 
    filterServices(matrixAddServices, searchQuery, filterCriteria),
    [matrixAddServices, searchQuery, filterCriteria]
  )
  
  const filteredMatrixRemoveServices = useMemo(() => 
    filterServices(matrixRemoveServices, searchQuery, filterCriteria),
    [matrixRemoveServices, searchQuery, filterCriteria]
  )
  
  // Get all available categories from services
  const availableCategories = useMemo(() => {
    const categories = new Set<string>()
    
    matrixAddServices.forEach(service => {
      if (service.category) categories.add(service.category)
    })
    
    matrixRemoveServices.forEach(service => {
      if (service.category) categories.add(service.category)
    })
    
    return Array.from(categories)
  }, [matrixAddServices, matrixRemoveServices])
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  // Reset all filters
  const resetFilters = () => {
    setFilterCriteria({
      priceRange: [0, 100],
      categories: [],
      sortBy: "price",
      sortDirection: "asc",
    })
    setSearchQuery("")
  }
  
  // Toggle category in filter
  const toggleCategoryFilter = (category: string) => {
    setFilterCriteria(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!keyboardNavigationEnabled) return
    
    switch (e.key) {
      case "ArrowRight":
        // Navigate to next tab
        setActiveTab(prev => {
          if (prev === "basic") return "advanced"
          if (prev === "advanced") return "schedule"
          return prev
        })
        break
      case "ArrowLeft":
        // Navigate to previous tab
        setActiveTab(prev => {
          if (prev === "advanced") return "basic"
          if (prev === "schedule") return "advanced"
          return prev
        })
        break
      case "ArrowDown":
        // Navigate to next section
        if (activeSection === "tiers") scrollToSection("addOns")
        else if (activeSection === "addOns") scrollToSection("reductions")
        else if (activeSection === "reductions") scrollToSection("matrixAdd")
        else if (activeSection === "matrixAdd") scrollToSection("matrixRemove")
        else if (activeSection === "matrixRemove") scrollToSection("specialInstructions")
        else if (activeSection === "specialInstructions") scrollToSection("frequency")
        else if (activeSection === "frequency") scrollToSection("duration")
        break
      case "ArrowUp":
        // Navigate to previous section
        if (activeSection === "duration") scrollToSection("frequency")
        else if (activeSection === "frequency") scrollToSection("specialInstructions")
        else if (activeSection === "specialInstructions") scrollToSection("matrixRemove")
        else if (activeSection === "matrixRemove") scrollToSection("matrixAdd")
        else if (activeSection === "matrixAdd") scrollToSection("reductions")
        else if (activeSection === "reductions") scrollToSection("addOns")
        else if (activeSection === "addOns") scrollToSection("tiers")
        break
      case "Escape":
        // Close any open menus or the panel itself
        if (activeMegaMenu) setActiveMegaMenu(null)
        else if (showFilters) setShowFilters(false)
        else if (showCustomizationPanel) setShowCustomizationPanel(false)
        else onClose()
        break
    }
  }, [
    keyboardNavigationEnabled, 
    activeTab, 
    activeSection, 
    activeMegaMenu, 
    showFilters, 
    showCustomizationPanel, 
    onClose
  ])

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
    updateConfiguration,
  ])

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      
      // Simulate initial loading
      setLoadProgress(20)
      const timer = setTimeout(() => {
        setLoadProgress(100)
      }, 500)
      
      return () => clearTimeout(timer)
    } else {
      document.body.style.overflow = "unset"
    }
    
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])
  
  // Add keyboard event listener
  useEffect(() => {
    if (isOpen && keyboardNavigationEnabled) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, keyboardNavigationEnabled, handleKeyDown])
  
  // Detect scroll position for dynamic loading
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollAreaRef.current) return
      
      // Check which sections are in view and load them
      Object.entries(sectionRefs).forEach(([sectionName, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect()
          // If section is in viewport or close to it
          if (rect.top < window.innerHeight + 300 && rect.bottom > -300) {
            loadSection(sectionName)
          }
        }
      })
    }
    
    // Add scroll event listener to the scroll area
    const scrollAreaElement = scrollAreaRef.current
    if (scrollAreaElement) {
      scrollAreaElement.addEventListener("scroll", handleScroll)
      return () => scrollAreaElement.removeEventListener("scroll", handleScroll)
    }
  }, [])
  
  // Apply theme mode
  useEffect(() => {
    const root = document.documentElement
    if (themeMode === "dark") {
      root.classList.add("dark")
    } else if (themeMode === "light") {
      root.classList.remove("dark")
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }, [themeMode])
  
  // Apply reduced motion preference
  useEffect(() => {
    const root = document.documentElement
    if (reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }
  }, [reducedMotion])
  
  // Apply high contrast mode
  useEffect(() => {
    const root = document.documentElement
    if (highContrastMode) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }
  }, [highContrastMode])
  
  // Apply font size
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--base-font-size", `${fontSize}px`)
  }, [fontSize])
  
  // Apply color scheme
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-color-scheme", colorScheme)
  }, [colorScheme])

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
    <motion.div
      initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
      animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "border-blue-200",
        themeMode === "dark" ? "bg-blue-950/30" : "bg-blue-50",
        highContrastMode && "border-blue-500"
      )}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Base Service:</span>
              <span>${tiers.find((t) => t.name === localSelectedTier)?.price.toFixed(2)}</span>
            </div>
            {localSelectedAddOns.length > 0 && (
              <div className="flex justify-between items-center text-green-600 dark:text-green-400">
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
              <div className="flex justify-between items-center text-red-600 dark:text-red-400">
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
              <div className="flex justify-between items-center text-green-600 dark:text-green-400">
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
              <div className="flex justify-between items-center text-red-600 dark:text-red-400">
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
              <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                <span>{getFrequencyName()} Discount:</span>
                <span>-{getFrequencyDiscount()}%</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total per Room:</span>
              <span>${calculateTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>
                Total for {roomCount} {roomCount === 1 ? "room" : "rooms"}:
              </span>
              <span>${(calculateTotalPrice() * roomCount).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  // Render mega menu content
  const renderMegaMenu = () => {
    if (!activeMegaMenu) return null

    const menuContent = {
      basic: (
        <div className={cn(
          "p-4 bg-white border rounded-lg shadow-lg",
          themeMode === "dark" && "bg-gray-900 border-gray-700",
          highContrastMode && "border-2"
        )}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className={cn(
                "font-medium mb-2",
                colorScheme === "blue" ? "text-blue-700 dark:text-blue-400" :
                colorScheme === "purple" ? "text-purple-700 dark:text-purple-400" :
                colorScheme === "green" ? "text-green-700 dark:text-green-400" :
                colorScheme === "orange" ? "text-orange-700 dark:text-orange-400" :
                "text-gray-700 dark:text-gray-300"
              )}>Service Options</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("basic")
                      scrollToSection("tiers")
                      setActiveMegaMenu(null)
                    }}
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1",
                      highContrastMode && "underline"
                    )}
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
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1",
                      highContrastMode && "underline"
                    )}
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
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1",
                      highContrastMode && "underline"
                    )}
                  >
                    <MinusCircle className="h-3 w-3" />
                    Service Reductions
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={cn(
                "font-medium mb-2",
                colorScheme === "blue" ? "text-blue-700 dark:text-blue-400" :
                colorScheme === "purple" ? "text-purple-700 dark:text-purple-400" :
                colorScheme === "green" ? "text-green-700 dark:text-green-400" :
                colorScheme === "orange" ? "text-orange-700 dark:text-orange-400" :
                "text-gray-700 dark:text-gray-300"
              )}>Quick Actions</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setLocalSelectedTier(tiers[0].name)
                      setActiveMegaMenu(null)
                    }}
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400",
                      highContrastMode && "underline"
                    )}
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
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400",
                      highContrastMode && "underline"
                    )}
                  >
                    Clear All Add-ons & Reductions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      saveCurrentConfiguration(`${roomName} Basic Config`)
                      setActiveMegaMenu(null)
                    }}
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1",
                      highContrastMode && "underline"
                    )}
                  >
                    <Save className="h-3 w-3" />
                    Save Current Configuration
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
      advanced: (
        <div className={cn(
          "p-4 bg-white border rounded-lg shadow-lg",
          themeMode === "dark" && "bg-gray-900 border-gray-700",
          highContrastMode && "border-2"
        )}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className={cn(
                "font-medium mb-2",
                colorScheme === "blue" ? "text-blue-700 dark:text-blue-400" :
                colorScheme === "purple" ? "text-purple-700 dark:text-purple-400" :
                colorScheme === "green" ? "text-green-700 dark:text-green-400" :
                colorScheme === "orange" ? "text-orange-700 dark:text-orange-400" :
                "text-gray-700 dark:text-gray-300"
              )}>Advanced Options</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("advanced")
                      scrollToSection("matrixAdd")
                      setActiveMegaMenu(null)
                    }}
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1",
                      highContrastMode && "underline"
                    )}
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
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1",
                      highContrastMode && "underline"
                    )}
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
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1",
                      highContrastMode && "underline"
                    )}
                  >
                    <Info className="h-3 w-3" />
                    Special Instructions
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={cn(
                "font-medium mb-2",
                colorScheme === "blue" ? "text-blue-700 dark:text-blue-400" :
                colorScheme === "purple" ? "text-purple-700 dark:text-purple-400" :
                colorScheme === "green" ? "text-green-700 dark:text-green-400" :
                colorScheme === "orange" ? "text-orange-700 dark:text-orange-400" :
                "text-gray-700 dark:text-gray-300"
              )}>Quick Actions</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setLocalSelectedMatrixAddServices([])
                      setLocalSelectedMatrixRemoveServices([])
                      setActiveMegaMenu(null)
                    }}
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400",
                      highContrastMode && "underline"
                    )}
                  >
                    Clear All Specialized Options
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowFilters(true)
                      setActiveMegaMenu(null)
                    }}
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1",
                      highContrastMode && "underline"
                    )}
                  >
                    <Filter className="h-3 w-3" />
                    Show Advanced Filters
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
      schedule: (
        <div className={cn(
          "p-4 bg-white border rounded-lg shadow-lg",
          themeMode === "dark" && "bg-gray-900 border-gray-700",
          highContrastMode && "border-2"
        )}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className={cn(
                "font-medium mb-2",
                colorScheme === "blue" ? "text-blue-700 dark:text-blue-400" :
                colorScheme === "purple" ? "text-purple-700 dark:text-purple-400" :
                colorScheme === "green" ? "text-green-700 dark:text-green-400" :
                colorScheme === "orange" ? "text-orange-700 dark:text-orange-400" :
                "text-gray-700 dark:text-gray-300"
              )}>Schedule Options</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("schedule")
                      scrollToSection("frequency")
                      setActiveMegaMenu(null)
                    }}
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1",
                      highContrastMode && "underline"
                    )}
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
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1",
                      highContrastMode && "underline"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    Estimated Duration
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={cn(
                "font-medium mb-2",
                colorScheme === "blue" ? "text-blue-700 dark:text-blue-400" :
                colorScheme === "purple" ? "text-purple-700 dark:text-purple-400" :
                colorScheme === "green" ? "text-green-700 dark:text-green-400" :
                colorScheme === "orange" ? "text-orange-700 dark:text-orange-400" :
                "text-gray-700 dark:text-gray-300"
              )}>Quick Actions</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setLocalSelectedFrequency("one_time")
                      setActiveMegaMenu(null)
                    }}
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400",
                      highContrastMode && "underline"
                    )}
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
                    className={cn(
                      "text-sm hover:text-blue-600 dark:hover:text-blue-400",
                      highContrastMode && "underline"
                    )}
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
      <AnimatePresence>
        <motion.div 
          className="absolute top-full left-0 right-0 z-50 mt-1 px-4"
          initial={animationsEnabled ? { opacity: 0, y: -10 } : false}
          animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
          exit={animationsEnabled ? { opacity: 0, y: -10 } : false}
          transition={{ duration: 0.2 }}
        >
          {menuContent[activeMegaMenu as keyof typeof menuContent]}
        </motion.div>
      </AnimatePresence>
    )
  }

  // Render breadcrumb navigation
  const renderBreadcrumbs = () => {
    const breadcrumbs = getBreadcrumbPath()

    return (
      <nav 
        className={cn(
          "flex items-center text-sm py-2 px-4 border-y",
          themeMode === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200",
          highContrastMode && "border-gray-900 dark:border-gray-100"
        )}
        aria-label="Breadcrumb navigation"
      >
        <button 
          onClick={() => {}}
          className={cn(
            "text-blue-600 hover:text-blue-800 flex items-center",
            themeMode === "dark" && "text-blue-400 hover:text-blue-300"
          )}
          aria-label="Home"
        >
          <Home className="h-3 w-3 mr-1" />
        </button>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
            <button
              onClick={crumb.onClick}
              className={cn(
                "hover:text-blue-600 dark:hover:text-blue-400",
                index === breadcrumbs.length - 1 
                  ? "font-medium text-gray-800 dark:text-gray-200" 
                  : "text-gray-600 dark:text-gray-400",
                highContrastMode && index === breadcrumbs.length - 1 && "underline"
              )}
              aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </nav>
    )
  }
  
  // Render filter panel
  const renderFilterPanel = () => {
    if (!showFilters) return null
    
    return (
      <AnimatePresence>
        <motion.div
          className={cn(
            "absolute inset-0 z-50 bg-white p-4 flex flex-col",
            themeMode === "dark" && "bg-gray-900"
          )}
          initial={animationsEnabled ? { opacity: 0 } : false}
          animate={animationsEnabled ? { opacity: 1 } : false}
          exit={animationsEnabled ? { opacity: 0 } : false}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-6 flex-1 overflow-auto">
            {/* Search */}
            <div>
              <Label htmlFor="search" className="text-sm font-medium mb-1.5 block">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>
            </div>
            
            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Price Range: ${filterCriteria.priceRange[0]} - ${filterCriteria.priceRange[1]}
              </Label>
              <Slider
                defaultValue={filterCriteria.priceRange}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => 
                  setFilterCriteria(prev => ({ ...prev, priceRange: value as [number, number] }))
                }
                className="my-4"
              />
            </div>
            
            {/* Categories */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Categories
              </Label>
              <div className="space-y-2 mt-2">
                {availableCategories.map(category => (
                  <div key={category} className="flex items-center">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filterCriteria.categories.includes(category)}
                      onCheckedChange={() => toggleCategoryFilter(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="ml-2 text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sort By */}
            <div>
              <Label htmlFor="sort-by" className="text-sm font-medium mb-1.5 block">
                Sort By
              </Label>
              <div className="flex gap-2">
                <Select
                  value={filterCriteria.sortBy}
                  onValueChange={(value) => 
                    setFilterCriteria(prev => ({ 
                      ...prev, 
                      sortBy: value as typeof filterCriteria.sortBy 
                    }))
                  }
                >
                  <SelectTrigger id="sort-by" className="flex-1">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => 
                    setFilterCriteria(prev => ({ 
                      ...prev, 
                      sortDirection: prev.sortDirection === "asc" ? "desc" : "asc" 
                    }))
                  }
                  aria-label={`Sort ${filterCriteria.sortDirection === "asc" ? "ascending" : "descending"}`}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              Reset Filters
            </Button>
            <Button onClick={() => setShowFilters(false)} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }
  
  // Render customization panel
  const renderCustomizationPanel = () => {
    if (!showCustomizationPanel) return null
    
    return (
      <AnimatePresence>
        <motion.div
          className={cn(
            "absolute inset-0 z-50 bg-white p-4 flex flex-col",
            themeMode === "dark" && "bg-gray-900"
          )}
          initial={animationsEnabled ? { opacity: 0 } : false}
          animate={animationsEnabled ? { opacity: 1 } : false}
          exit={animationsEnabled ? { opacity: 0 } : false}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Customize Panel
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowCustomizationPanel(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-6 flex-1 overflow-auto">
            {/* Theme Mode */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Theme Mode
              </Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={themeMode === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setThemeMode("light")}
                  className="flex-1"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={themeMode === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setThemeMode("dark")}
                  className="flex-1"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={themeMode === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setThemeMode("system")}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  System
                </Button>
              </div>
            </div>
            
            {/* Color Scheme */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Color Scheme
              </Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                <Button
                  variant={colorScheme === "blue" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColorScheme("blue")}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Blue
                </Button>
                <Button
                  variant={colorScheme === "purple" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColorScheme("purple")}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Purple
                </Button>
                <Button
                  variant={colorScheme === "green" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColorScheme("green")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  Green
                </Button>
                <Button
                  variant={colorScheme === "orange" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColorScheme("orange")}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Orange
                </Button>
                <Button
                  variant={colorScheme === "neutral" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColorScheme("neutral")}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Neutral
                </Button>
              </div>
            </div>
            
            {/* Layout Mode */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Layout Density
              </Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={layoutMode === "compact" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLayoutMode("compact")}
                  className="flex-1"
                >
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Compact
                </Button>
                <Button
                  variant={layoutMode === "comfortable" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLayoutMode("comfortable")}
                  className="flex-1"
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Comfortable
                </Button>
                <Button
                  variant={layoutMode === "spacious" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLayoutMode("spacious")}
                  className="flex-1"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Spacious
                </Button>
              </div>
            </div>
            
            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Font Size: {fontSize}px
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFontSize(16)}
                  className="h-8 text-xs"
                >
                  Reset
                </Button>
              </div>
              <Slider
                defaultValue={[fontSize]}
                min={12}
                max={24}
                step={1}
                onValueChange={(value) => setFontSize(value[0])}
                className="my-4"
              />
            </div>
            
            {/* Accessibility Options */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Accessibility
              </Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast" className="text-sm cursor-pointer">
                    High Contrast Mode
                  </Label>
                  <Switch
                    id="high-contrast"
                    checked={highContrastMode}
                    onCheckedChange={setHighContrastMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduced-motion" className="text-sm cursor-pointer">
                    Reduced Motion
                  </Label>
                  <Switch
                    id="reduced-motion"
                    checked={reducedMotion}
                    onCheckedChange={setReducedMotion}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboard-nav" className="text-sm cursor-pointer">
                    Keyboard Navigation
                  </Label>
                  <Switch
                    id="keyboard-nav"
                    checked={keyboardNavigationEnabled}
                    onCheckedChange={setKeyboardNavigationEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="screen-reader" className="text-sm cursor-pointer">
                    Screen Reader Hints
                  </Label>
                  <Switch
                    id="screen-reader"
                    checked={screenReaderHints}
                    onCheckedChange={setScreenReaderHints}
                  />
                </div>
              </div>
            </div>
            
            {/* Animation Settings */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Animations
              </Label>
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="animations" className="text-sm cursor-pointer">
                  Enable Animations
                </Label>
                <Switch
                  id="animations"
                  checked={animationsEnabled}
                  onCheckedChange={setAnimationsEnabled}
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setThemeMode("light")
              setColorScheme("blue")
              setLayoutMode("comfortable")
              setFontSize(16)
              setHighContrastMode(false)
              setReducedMotion(false)
              setKeyboardNavigationEnabled(true)
              setScreenReaderHints(true)
              setAnimationsEnabled(true)
            }} className="flex-1">
              Reset All
            </Button>
            <Button onClick={() => setShowCustomizationPanel(false)} className="flex-1">
              Apply Changes
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }
  
  // Render saved configurations panel
  const renderSavedConfigurationsPanel = () => {
    if (savedConfigurations.length === 0) return null
    
    return (
      <Card className={cn(
        "mb-4",
        themeMode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white",
        highContrastMode && "border-2"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Saved Configurations
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <ScrollArea className="max-h-32">
            <div className="space-y-2">
              {savedConfigurations.map(config => (
                <div 
                  key={config.id} 
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md",
                    themeMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  )}
                >
                  <button 
                    onClick={() => loadSavedConfiguration(config.id)}
                    className="text-sm font-medium text-left flex-1 hover:underline"
                  >
                    {config.name}
                  </button>
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete configuration</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  // Render the basic tab content
  const renderBasicTabContent = () => (
    <>
      {/* Service Tiers Section */}
      <motion.div
        ref={sectionRefs.tiers}
        initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
        animate={animationsEnabled && loadedSections.includes("tiers") ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.3 }}
      >
        <Card className={cn(
          themeMode === "dark" && "bg-gray-800 border-gray-700",
          highContrastMode && "border-2",
          pinnedSections.includes("tiers") && "border-blue-500 dark:border-blue-400"
        )}>
          <CardHeader className="cursor-pointer relative" onClick={() => toggleSection("tiers")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className={cn(
                  "h-5 w-5",
                  colorScheme === "blue" ? "text-blue-600 dark:text-blue-400" :
                  colorScheme === "purple" ? "text-purple-600 dark:text-purple-400" :
                  colorScheme === "green" ? "text-green-600 dark:text-green-400" :
                  colorScheme === "orange" ? "text-orange-600 dark:text-orange-400" :
                  "text-gray-600 dark:text-gray-400"
                )} />
                <CardTitle className="text-lg">Service Tiers</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePinnedSection("tiers")
                        }}
                      >
                        {pinnedSections.includes("tiers") ? (
                          <Pin className="h-3.5 w-3.5" />
                        ) : (
                          <PinOff className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{pinnedSections.includes("tiers") ? "Unpin section" : "Pin section"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {expandedSections.tiers ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
            <CardDescription>Choose your cleaning intensity level</CardDescription>
            
            {/* Visual indicator for selected tier */}
            {!expandedSections.tiers && (
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Selected: </span>
                <Badge variant="outline" className="ml-2">
                  {tiers.find(tier => tier.name === localSelectedTier)?.name || "Basic"}
                </Badge>
              </div>
            )}
          </CardHeader>
          
          {expandedSections.tiers && loadedSections.includes("tiers") && (
            <CardContent>
              <RadioGroup value={localSelectedTier} onValueChange={handleTierChange} className="space-y-3">
                {tiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      localSelectedTier === tier.name 
                        ? `${colorScheme === "blue" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700" : 
                           colorScheme === "purple" ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700" :
                           colorScheme === "green" ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700" :
                           colorScheme === "orange" ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700" :
                           "border-gray-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-600"}`
                        : "border-gray-200 dark:border-gray-700",
                      layoutMode === "compact" ? "p-2" : layoutMode === "spacious" ? "p-4" : "p-3"
                    )}
                    initial={animationsEnabled ? { opacity: 0, y: 10 } : false}
                    animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <Label 
                            htmlFor={`tier-${tier.name}`} 
                            className={cn(
                              "font-medium",
                              fontSize > 16 ? "text-lg" : fontSize < 16 ? "text-sm" : "text-base"
                            )}
                          >
                            {tier.name}
                          </Label>
                          <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "destructive"}>
                            ${tier.price}
                          </Badge>
                        </div>
                        <p className={cn(
                          "text-gray-600 dark:text-gray-400 mb-2",
                          fontSize > 16 ? "text-base" : fontSize < 16 ? "text-xs" : "text-sm"
                        )}>
                          {tier.description}
                        </p>
                        <div className="space-y-1">
                          {tier.features.slice(0, 3).map((feature, i) => (
                            <div key={i} className={cn(
                              "flex items-start",
                              fontSize > 16 ? "text-sm" : fontSize < 16 ? "text-xs" : "text-xs"
                            )}>
                              <span className="text-green-500 dark:text-green-400 mr-1">✓</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                          {tier.features.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{tier.features.length - 3} more features
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Favorite button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 mt-1"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(`tier-${tier.name}`)
                              }}
                            >
                              {favorites.includes(`tier-${tier.name}`) ? (
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <Star className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{favorites.includes(`tier-${tier.name}`) ? "Remove from favorites" : "Add to favorites"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </motion.div>
                ))}
              </RadioGroup>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Add-ons Section */}
      {addOns.length > 0 && (
        <motion.div
          ref={sectionRefs.addOns}
          initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
          animate={animationsEnabled && loadedSections.includes("addOns") ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className={cn(
            themeMode === "dark" && "bg-gray-800 border-gray-700",
            highContrastMode && "border-2",
            pinnedSections.includes("addOns") && "border-blue-500 dark:border-blue-400"
          )}>
            <CardHeader className="cursor-pointer relative" onClick={() => toggleSection("addOns")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-5 w-5 rounded flex items-center justify-center",
                    colorScheme === "blue" ? "bg-blue-100 dark:bg-blue-900/50" :
                    colorScheme === "purple" ? "bg-purple-100 dark:bg-purple-900/50" :
                    colorScheme === "green" ? "bg-green-100 dark:bg-green-900/50" :
                    colorScheme === "orange" ? "bg-orange-100 dark:bg-orange-900/50" :
                    "bg-gray-100 dark:bg-gray-800"
                  )}>
                    <span className={cn(
                      "text-xs font-bold",
                      colorScheme === "blue" ? "text-blue-600 dark:text-blue-400" :
                      colorScheme === "purple" ? "text-purple-600 dark:text-purple-400" :
                      colorScheme === "green" ? "text-green-600 dark:text-green-400" :
                      colorScheme === "orange" ? "text-orange-600 dark:text-orange-400" :
                      "text-gray-600 dark:text-gray-400"
                    )}>+</span>
                  </div>
                  <CardTitle className="text-lg">Additional Services</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePinnedSection("addOns")
                          }}
                        >
                          {pinnedSections.includes("addOns") ? (
                            <Pin className="h-3.5 w-3.5" />
                          ) : (
                            <PinOff className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{pinnedSections.includes("addOns") ? "Unpin section" : "Pin section"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {expandedSections.addOns ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
              <CardDescription>Enhance your cleaning service</CardDescription>
              
              {/* Visual indicator for selected add-ons */}
              {!expandedSections.addOns && localSelectedAddOns.length > 0 && (
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>Selected: </span>
                  <div className="ml-2 flex flex-wrap gap-1">
                    {localSelectedAddOns.slice(0, 2).map(id => (
                      <Badge key={id} variant="outline">
                        {addOns.find(addon => addon.id === id)?.name || id}
                      </Badge>
                    ))}
                    {localSelectedAddOns.length > 2 && (
                      <Badge variant="outline">+{localSelectedAddOns.length - 2} more</Badge>
                    )}
                  </div>
                </div>
              )}
            </CardHeader>
            
            {expandedSections.addOns && loadedSections.includes("addOns") && (
              <CardContent>
                <div className="space-y-3">
                  {addOns.map((addOn, index) => (
                    <motion.div 
                      key={addOn.id} 
                      className={cn(
                        "flex items-start gap-3 p-2 rounded-lg",
                        themeMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50",
                        layoutMode === "compact" ? "p-1.5" : layoutMode === "spacious" ? "p-3" : "p-2"
                      )}
                      initial={animationsEnabled ? { opacity: 0, y: 10 } : false}
                      animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Checkbox
                        id={`addon-${addOn.id}`}
                        checked={localSelectedAddOns.includes(addOn.id)}
                        onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked === true)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <Label 
                            htmlFor={`addon-${addOn.id}`} 
                            className={cn(
                              "font-medium",
                              fontSize > 16 ? "text-lg" : fontSize < 16 ? "text-sm" : "text-base"
                            )}
                          >
                            {addOn.name}
                          </Label>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              colorScheme === "blue" ? "text-blue-600 dark:text-blue-400" :
                              colorScheme === "purple" ? "text-purple-600 dark:text-purple-400" :
                              colorScheme === "green" ? "text-green-600 dark:text-green-400" :
                              colorScheme === "orange" ? "text-orange-600 dark:text-orange-400" :
                              "text-gray-600 dark:text-gray-400"
                            )}
                          >
                            +${addOn.price.toFixed(2)}
                          </Badge>
                        </div>
                        {addOn.description && (
                          <p className={cn(
                            "text-gray-500 dark:text-gray-400 mt-1",
                            fontSize > 16 ? "text-base" : fontSize < 16 ? "text-xs" : "text-sm"
                          )}>
                            {addOn.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Favorite button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 mt-1"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(`addon-${addOn.id}`)
                              }}
                            >
                              {favorites.includes(`addon-${addOn.id}`) ? (
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <Star className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{favorites.includes(`addon-${addOn.id}`) ? "Remove from favorites" : "Add to favorites"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      )}

      {/* Reductions Section */}
      {reductions.length > 0 && (
        <motion.div
          ref={sectionRefs.reductions}
          initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
          animate={animationsEnabled && loadedSections.includes("reductions") ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className={cn(
            themeMode === "dark" && "bg-gray-800 border-gray-700",
            highContrastMode && "border-2",
            pinnedSections.includes("reductions") && "border-blue-500 dark:border-blue-400"
          )}>
            <CardHeader className="cursor-pointer relative" onClick={() => toggleSection("reductions")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-5 w-5 rounded flex items-center justify-center",
                    colorScheme === "blue" ? "bg-red-100 dark:bg-red-900/50" :
                    colorScheme === "purple" ? "bg-red-100 dark:bg-red-900/50" :
                    colorScheme === "green" ? "bg-red-100 dark:bg-red-900/50" :
                    colorScheme === "orange" ? "bg-red-100 dark:bg-red-900/50" :
                    "bg-red-100 dark:bg-red-900/50"
                  )}>
                    <span className="text-red-600 dark:text-red-400 text-xs font-bold">-</span>
                  </div>
                  <CardTitle className="text-lg">Service Reductions</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePinnedSection("reductions")
                          }}
                        >
                          {pinnedSections.includes("reductions") ? (
                            <Pin className="h-3.5 w-3.5" />
                          ) : (
                            <PinOff className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{pinnedSections.includes("reductions") ? "Unpin section" : "Pin section"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {expandedSections.reductions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
              <CardDescription>Remove services you don't need</CardDescription>
              
              {/* Visual indicator for selected reductions */}
              {!expandedSections.reductions && localSelectedReductions.length > 0 && (
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>Selected: </span>
                  <div className="ml-2 flex flex-wrap gap-1">
                    {localSelectedReductions.slice(0, 2).map(id => (
                      <Badge key={id} variant="outline">
                        {reductions.find(reduction => reduction.id === id)?.name || id}
                      </Badge>
                    ))}
                    {localSelectedReductions.length > 2 && (
                      <Badge variant="outline">+{localSelectedReductions.length - 2} more</Badge>
                    )}
                  </div>
                </div>
              )}
            </CardHeader>
            
            {expandedSections.reductions && loadedSections.includes("reductions") && (
              <CardContent>
                <div className="space-y-3">
                  {reductions.map((reduction, index) => (
                    <motion.div 
                      key={reduction.id} 
                      className={cn(
                        "flex items-start gap-3 p-2 rounded-lg",
                        themeMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50",
                        layoutMode === "compact" ? "p-1.5" : layoutMode === "spacious" ? "p-3" : "p-2"
                      )}
                      initial={animationsEnabled ? { opacity: 0, y: 10 } : false}
                      animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Checkbox
                        id={`reduction-${reduction.id}`}
                        checked={localSelectedReductions.includes(reduction.id)}
                        onCheckedChange={(checked) => handleReductionChange(reduction.id, checked === true)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <Label 
                            htmlFor={`reduction-${reduction.id}`} 
                            className={cn(
                              "font-medium",
                              fontSize > 16 ? "text-lg" : fontSize < 16 ? "text-sm" : "text-base"
                            )}
                          >
                            {reduction.name}
                          </Label>
                          <Badge variant="outline" className="text-red-600 dark:text-red-400">
                            -${reduction.discount.toFixed(2)}
                          </Badge>
                        </div>
                        {reduction.description && (
                          <p className={cn(
                            "text-gray-500 dark:text-gray-400 mt-1",
                            fontSize > 16 ? "text-base" : fontSize < 16 ? "text-xs" : "text-sm"
                          )}>
                            {reduction.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Favorite button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 mt-1"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(`reduction-${reduction.id}`)
                              }}
                            >
                              {favorites.includes(`reduction-${reduction.id}`) ? (
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <Star className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{favorites.includes(`reduction-${reduction.id}`) ? "Remove from favorites" : "Add to favorites"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      )}
    </>
  )

  // Render the advanced tab content
  const renderAdvancedTabContent = () => (
    <>
      {/* Matrix Add Services */}
      {matrixAddServices.length > 0 && (
        <motion.div
          ref={sectionRefs.matrixAdd}
          initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
          animate={animationsEnabled && loadedSections.includes("matrixAdd") ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3 }}
        >
          <Card className={cn(
            themeMode === "dark" && "bg-gray-800 border-gray-700",
            highContrastMode && "border-2",
            pinnedSections.includes("matrixAdd") && "border-blue-500 dark:border-blue-400"
          )}>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlusCircle className={cn(
                    "h-5 w-5",
                    colorScheme === "blue" ? "text-blue-600 dark:text-blue-400" :
                    colorScheme === "purple" ? "text-purple-600 dark:text-purple-400" :
                    colorScheme === "green" ? "text-green-600 dark:text-green-400" :
                    colorScheme === "orange" ? "text-orange-600 dark:text-orange-400" :
                    "text-gray-600 dark:text-gray-400"
                  )} />
                  <CardTitle className="text-lg">Specialized Add-ons</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => togglePinnedSection("matrixAdd")}
                        >
                          {pinnedSections.includes("matrixAdd") ? (
                            <Pin className="h-3.5 w-3.5" />
                          ) : (
                            <PinOff className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{pinnedSections.includes("matrixAdd") ? "Unpin section" : "Pin section"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowFilters(true)}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filter Options
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setFilterCriteria(prev => ({
                          ...prev,
                          sortBy: "price",
                          sortDirection: prev.sortDirection === "asc" ? "desc" : "asc"
                        }))
                      }}>
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Sort by Price
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocalSelectedMatrixAddServices([])}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clear Selections
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardDescription>Additional specialized services for this room</CardDescription>
              
              {/* Search input */}
              <div className="mt-2 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search specialized services..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>
              
              {/* Active filters display */}
              {(filterCriteria.categories.length > 0 || searchQuery) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {searchQuery && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <span>Search: {searchQuery}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0" 
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  
                  {filterCriteria.categories.map(category => (
                    <Badge key={category} variant="outline" className="flex items-center gap-1">
                      <span>{category}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0" 
                        onClick={() => toggleCategoryFilter(category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs px-2" 
                    onClick={resetFilters}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              {isPending ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredMatrixAddServices.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No services found matching your criteria</p>
                  <Button 
                    variant="link" 
                    onClick={resetFilters}
                    className="mt-2"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMatrixAddServices.map((service, index) => (
                    <motion.div 
                      key={service.id} 
                      className={cn(
                        "flex items-start gap-3 p-2 rounded-lg",
                        themeMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50",
                        layoutMode === "compact" ? "p-1.5" : layoutMode === "spacious" ? "p-3" : "p-2"
                      )}
                      initial={animationsEnabled ? { opacity: 0, y: 10 } : false}
                      animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Checkbox
                        id={`matrix-add-${service.id}`}
                        checked={localSelectedMatrixAddServices.includes(service.id)}
                        onCheckedChange={(checked) => handleMatrixAddServiceChange(service.id, checked === true)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <Label 
                              htmlFor={`matrix-add-${service.id}`} 
                              className={cn(
                                "font-medium",
                                fontSize > 16 ? "text-lg" : fontSize < 16 ? "text-sm" : "text-base"
                              )}
                            >
                              {service.name}
                            </Label>
                            {service.category && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {service.category}
                              </Badge>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              colorScheme === "blue" ? "text-blue-600 dark:text-blue-400" :
                              colorScheme === "purple" ? "text-purple-600 dark:text-purple-400" :
                              colorScheme === "green" ? "text-green-600 dark:text-green-400" :
                              colorScheme === "orange" ? "text-orange-600 dark:text-orange-400" :
                              "text-gray-600 dark:text-gray-400"
                            )}
                          >
                            +${service.price.toFixed(2)}
                          </Badge>
                        </div>
                        {service.description && (
                          <p className={cn(
                            "text-gray-500 dark:text-gray-400 mt-1",
                            fontSize > 16 ? "text-base" : fontSize < 16 ? "text-xs" : "text-sm"
                          )}>
                            {service.description}
                          </p>
                        )}
                        
                        {/* Tags */}
                        {service.tags && service.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {service.tags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs px-1.5 py-0 h-5"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Popularity indicator */}
                        {service.popularity && (
                          <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const rating = service.popularity || 0
                                const fullStars = Math.floor(rating / 20)
                                const hasHalfStar = rating % 20 >= 10
                                
                                if (i < fullStars) {
                                  return <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                } else if (i === fullStars && hasHalfStar) {
                                  return <StarHalf key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                } else {
                                  return <Star key={i} className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                                }
                              })}
                            </div>
                            <span className="ml-1">Popular choice</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Favorite button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 mt-1"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(`matrix-add-${service.id}`)
                              }}
                            >
                              {favorites.includes(`matrix-add-${service.id}`) ? (
                                <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                              ) : (
                                <Heart className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{favorites.includes(`matrix-add-${service.id}`) ? "Remove from favorites" : "Add to favorites"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
            
            {filteredMatrixAddServices.length > 0 && (
              <CardFooter className="flex justify-between pt-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredMatrixAddServices.length} of {matrixAddServices.length} services
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  Advanced Filters
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      )}

      {/* Matrix Remove Services */}
      {matrixRemoveServices.length > 0 && (
        <motion.div
          ref={sectionRefs.matrixRemove}
          initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
          animate={animationsEnabled && loadedSections.includes("matrixRemove") ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className={cn(
            themeMode === "dark" && "bg-gray-800 border-gray-700",
            highContrastMode && "border-2",
            pinnedSections.includes("matrixRemove") && "border-blue-500 dark:border-blue-400"
          )}>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MinusCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <CardTitle className="text-lg">Service Exclusions</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => togglePinnedSection("matrixRemove")}
                        >
                          {pinnedSections.includes("matrixRemove") ? (
                            <Pin className="h-3.5 w-3.5" />
                          ) : (
                            <PinOff className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{pinnedSections.includes("matrixRemove") ? "Unpin section" : "Pin section"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowFilters(true)}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filter Options
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setFilterCriteria(prev => ({
                          ...prev,
                          sortBy: "price",
                          sortDirection: prev.sortDirection === "asc" ? "desc" : "asc"
                        }))
                      }}>
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Sort by Price
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocalSelectedMatrixRemoveServices([])}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clear Selections
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardDescription>Remove specific services to customize your cleaning</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {filteredMatrixRemoveServices.map((service, index) => (
                  <motion.div 
                    key={service.id} 
                    className={cn(
                      "flex items-start gap-3 p-2 rounded-lg",
                      themeMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50",
                      layoutMode === "compact" ? "p-1.5" : layoutMode === "spacious" ? "p-3" : "p-2"
                    )}
                    initial={animationsEnabled ? { opacity: 0, y: 10 } : false}
                    animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Checkbox
                      id={`matrix-remove-${service.id}`}
                      checked={localSelectedMatrixRemoveServices.includes(service.id)}
                      onCheckedChange={(checked) => handleMatrixRemoveServiceChange(service.id, checked === true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <Label 
                            htmlFor={`matrix-remove-${service.id}`} 
                            className={cn(
                              "font-medium",
                              fontSize > 16 ? "text-lg" : fontSize < 16 ? "text-sm" : "text-base"
                            )}
                          >
                            {service.name}
                          </Label>
                          {service.category && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {service.category}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-red-600 dark:text-red-400">
                          -${service.price.toFixed(2)}
                        </Badge>
                      </div>
                      {service.description && (
                        <p className={cn(
                          "text-gray-500 dark:text-gray-400 mt-1",
                          fontSize > 16 ? "text-base" : fontSize < 16 ? "text-xs" : "text-sm"
                        )}>
                          {service.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Favorite button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 mt-1"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleFavorite(`matrix-remove-${service.id}`)
                            }}
                          >
                            {favorites.includes(`matrix-remove-${service.id}`) ? (
                              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                            ) : (
                              <Heart className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{favorites.includes(`matrix-remove-${service.id}`) ? "Remove from favorites" : "Add to favorites"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Special Instructions */}
      <motion.div
        ref={sectionRefs.specialInstructions}
        initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
        animate={animationsEnabled && loadedSections.includes("specialInstructions") ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className={cn(
          themeMode === "dark" && "bg-gray-800 border-gray-700",
          highContrastMode && "border-2",
          pinnedSections.includes("specialInstructions") && "border-blue-500 dark:border-blue-400"
        )}>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className={cn(
                  "h-5 w-5",
                  colorScheme === "blue" ? "text-blue-600 dark:text-blue-400" :
                  colorScheme === "purple" ? "text-purple-600 dark:text-purple-400" :
                  colorScheme === "green" ? "text-green-600 dark:text-green-400" :
                  colorScheme === "orange" ? "text-orange-600 dark:text-orange-400" :
                  "text-gray-600 dark:text-gray-400"
                )} />
                <CardTitle className="text-lg">Special Instructions</CardTitle>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => togglePinnedSection("specialInstructions")}
                    >
                      {pinnedSections.includes("specialInstructions") ? (
                        <Pin className="h-3.5 w-3.5" />
                      ) : (
                        <PinOff className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{pinnedSections.includes("specialInstructions") ? "Unpin section" : "Pin section"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>Add any specific instructions for this room</CardDescription>
          </CardHeader>
          
          <CardContent>
            <textarea
              className={cn(
                "w-full p-3 border rounded-md h-24 text-sm",
                themeMode === "dark" && "bg-gray-700 border-gray-600 text-white",
                highContrastMode && "border-2"
              )}
              placeholder="Enter any special instructions or notes for the cleaning team..."
              aria-label="Special instructions"
            />
            
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Be specific about any areas that need special attention</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                <Sparkles className="h-3 w-3 mr-1" />
                Suggest Instructions
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )

  // Render the schedule tab content
  const renderScheduleTabContent = () => (
    <>
      {/* Frequency Selection */}
      <motion.div
        ref={sectionRefs.frequency}
        initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
        animate={animationsEnabled && loadedSections.includes("frequency") ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.3 }}
      >
        <Card className={cn(
          themeMode === "dark" && "bg-gray-800 border-gray-700",
          highContrastMode && "border-2",
          pinnedSections.includes("frequency") && "border-blue-500 dark:border-blue-400"
        )}>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className={cn(
                  "h-5 w-5",
                  colorScheme === "blue" ? "text-blue-600 dark:text-blue-400" :
                  colorScheme === "purple" ? "text-purple-600 dark:text-purple-400" :
                  colorScheme === "green" ? "text-green-600 dark:text-green-400" :
                  colorScheme === "orange" ? "text-orange-600 dark:text-orange-400" :
                  "text-gray-600 dark:text-gray-400"
                )} />
                <CardTitle className="text-lg">Service Frequency</CardTitle>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => togglePinnedSection("frequency")}
                    >
                      {pinnedSections.includes("frequency") ? (
                        <Pin className="h-3.5 w-3.5" />
                      ) : (
                        <PinOff className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{pinnedSections.includes("frequency") ? "Unpin section" : "Pin section"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>Choose how often you'd like this service</CardDescription>
          </CardHeader>
          
          <CardContent>
            <RadioGroup value={localSelectedFrequency} onValueChange={handleFrequencyChange} className="space-y-3">
              {frequencyOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    localSelectedFrequency === option.id 
                      ? `${colorScheme === "blue" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700" : 
                         colorScheme === "purple" ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700" :
                         colorScheme === "green" ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700" :
                         colorScheme === "orange" ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700" :
                         "border-gray-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-600"}`
                      : "border-gray-200 dark:border-gray-700",
                    layoutMode === "compact" ? "p-2" : layoutMode === "spacious" ? "p-4" : "p-3"
                  )}
                  initial={animationsEnabled ? { opacity: 0, y: 10 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={option.id} id={`frequency-${option.id}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <Label 
                          htmlFor={`frequency-${option.id}`} 
                          className={cn(
                            "font-medium",
                            fontSize > 16 ? "text-lg" : fontSize < 16 ? "text-sm" : "text-base"
                          )}
                        >
                          {option.name}
                        </Label>
                        {option.discount > 0 && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                              highContrastMode && "border border-green-500"
                            )}
                          >
                            {option.discount}% off
                          </Badge>
                        )}
                      </div>
                      
                      {/* Progress bar showing savings */}
                      {option.discount > 0 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500 dark:text-gray-400">Savings</span>
                            <span className="text-green-600 dark:text-green-400">
                              ${(calculateTotalPrice() * (option.discount / 100)).toFixed(2)} per service
                            </span>
                          </div>
                          <Progress value={option.discount} className="h-1.5" />
                        </div>
                      )}
                    </div>
                    
                    {/* Favorite button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleFavorite(`frequency-${option.id}`)
                            }}
                          >
                            {favorites.includes(`frequency-${option.id}`) ? (
                              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <Star className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{favorites.includes(`frequency-${option.id}`) ? "Remove from favorites" : "Add to favorites"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </motion.div>

      {/* Estimated Duration */}
      <motion.div
        ref={sectionRefs.duration}
        initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
        animate={animationsEnabled && loadedSections.includes("duration") ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className={cn(
          themeMode === "dark" && "bg-gray-800 border-gray-700",
          highContrastMode && "border-2",
          pinnedSections.includes("duration") && "border-blue-500 dark:border-blue-400"
        )}>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={cn(
                  "h-5 w-5",
                  colorScheme === "blue" ? "text-blue-600 dark:text-blue-400" :
                  colorScheme === "purple" ? "text-purple-600 dark:text-purple-400" :
                  colorScheme === "green" ? "text-green-600 dark:text-green-400" :
                  colorScheme === "orange" ? "text-orange-600 dark:text-orange-400" :
                  "text-gray-600 dark:text-gray-400"
                )} />
                <CardTitle className="text-lg">Estimated Duration</CardTitle>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => togglePinnedSection("duration")}
                    >
                      {pinnedSections.includes("duration") ? (
                        <Pin className="h-3.5 w-3.5" />
                      ) : (
                        <PinOff className="h-3.5 w-3.5" />\
