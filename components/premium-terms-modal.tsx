"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useTerms } from "@/lib/terms-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { debounce, throttle } from "lodash"
import {
  FileText,
  ShieldCheck,
  X,
  CheckCircle2,
  Clock,
  Search,
  Printer,
  Download,
  ExternalLink,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Languages,
  Lightbulb,
  Sparkles,
  ArrowUp,
  BookOpen,
  Bookmark,
  MousePointer,
} from "lucide-react"

// Advanced scroll tracking types
interface ScrollPosition {
  position: number
  timestamp: number
  section: string
}

interface ScrollMetrics {
  velocity: number
  direction: "up" | "down" | "static"
  lastPositions: ScrollPosition[]
  maxPosition: number
}

interface SectionVisibility {
  [key: string]: {
    visible: boolean
    fullyVisible: boolean
    percentVisible: number
    enteredViewport: boolean
  }
}

export default function PremiumTermsModal() {
  const { showTermsModal, closeTermsModal, acceptTerms } = useTerms()
  const [activeTab, setActiveTab] = useState<string>("terms")
  const [searchQuery, setSearchQuery] = useState("")
  const [readProgress, setReadProgress] = useState<Record<string, number>>({ terms: 0, privacy: 0 })
  const [currentSection, setCurrentSection] = useState<string>("introduction")
  const [showSimplified, setShowSimplified] = useState(false)
  const [highlightedTerms, setHighlightedTerms] = useState<string[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Advanced scroll state
  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    velocity: 0,
    direction: "static",
    lastPositions: [],
    maxPosition: 0,
  })
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({})
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [autoScrollActive, setAutoScrollActive] = useState(false)
  const [scrollTarget, setScrollTarget] = useState<string | null>(null)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const scrollEndTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTime = useRef<number>(0)
  const scrollStartPosition = useRef<number>(0)
  const scrollHistory = useRef<ScrollPosition[]>([])
  const maxHistoryLength = 10

  // Sections for each tab
  const termsSections = [
    { id: "introduction", title: "Introduction", icon: FileText },
    { id: "acceptance", title: "Acceptance of Terms", icon: CheckCircle2 },
    { id: "services", title: "Service Description", icon: Sparkles },
    { id: "booking", title: "Booking & Cancellation", icon: Clock },
    { id: "payment", title: "Payment Terms", icon: FileText },
    { id: "guarantee", title: "Service Guarantee", icon: ShieldCheck },
  ]

  const privacySections = [
    { id: "collection", title: "Information Collection", icon: FileText },
    { id: "usage", title: "How We Use Information", icon: Lightbulb },
    { id: "sharing", title: "Information Sharing", icon: FileText },
    { id: "cookies", title: "Cookies & Tracking", icon: FileText },
    { id: "security", title: "Data Security", icon: ShieldCheck },
    { id: "rights", title: "Your Rights", icon: FileText },
  ]

  // Get current sections based on active tab
  const currentSections = useMemo(() => (activeTab === "terms" ? termsSections : privacySections), [activeTab])

  // Initialize section visibility tracking
  useEffect(() => {
    const initialVisibility: SectionVisibility = {}
    currentSections.forEach((section) => {
      initialVisibility[section.id] = {
        visible: false,
        fullyVisible: false,
        percentVisible: 0,
        enteredViewport: false,
      }
    })
    setSectionVisibility(initialVisibility)
  }, [currentSections])

  // Save scroll position for each tab
  useEffect(() => {
    return () => {
      // Clean up any pending timeouts on unmount
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      if (scrollEndTimeout.current) clearTimeout(scrollEndTimeout.current)
    }
  }, [])

  // Reset search and scroll position when tab changes
  useEffect(() => {
    setSearchQuery("")
    setScrollMetrics({
      velocity: 0,
      direction: "static",
      lastPositions: [],
      maxPosition: 0,
    })
    scrollHistory.current = []

    // Scroll to top when tab changes with smooth animation
    if (scrollRef.current) {
      const scrollToTop = () => {
        setAutoScrollActive(true)
        scrollRef.current?.scrollTo({
          top: 0,
          behavior: "smooth",
        })

        // Detect when scrolling has finished
        const checkIfScrollingFinished = () => {
          if (scrollRef.current?.scrollTop === 0) {
            setAutoScrollActive(false)
          } else {
            requestAnimationFrame(checkIfScrollingFinished)
          }
        }

        requestAnimationFrame(checkIfScrollingFinished)
      }

      scrollToTop()
    }
  }, [activeTab])

  // Handle search highlighting with debounce
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (!searchQuery) {
        setHighlightedTerms([])
        return
      }

      // Advanced search implementation
      setHighlightedTerms([searchQuery.toLowerCase()])

      // Auto-scroll to first match after search
      if (searchQuery.length > 2) {
        const sections = document.querySelectorAll("[data-section-id]")
        for (const section of sections) {
          const text = section.textContent?.toLowerCase() || ""
          if (text.includes(searchQuery.toLowerCase())) {
            scrollToSection(section.getAttribute("data-section-id") || "")
            break
          }
        }
      }
    }, 300)

    debouncedSearch()
    return () => debouncedSearch.cancel()
  }, [searchQuery])

  // Advanced scroll tracking with performance optimizations
  const handleScroll = useCallback(
    throttle((e: React.UIEvent<HTMLDivElement>) => {
      if (autoScrollActive) return

      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      const maxScroll = scrollHeight - clientHeight
      const progress = Math.min(100, Math.round((scrollTop / maxScroll) * 100))
      const now = Date.now()

      // Update read progress
      setReadProgress((prev) => ({
        ...prev,
        [activeTab]: progress,
      }))

      // Show scroll indicator when user scrolls
      setShowScrollIndicator(true)
      setIsScrolling(true)

      if (scrollEndTimeout.current) {
        clearTimeout(scrollEndTimeout.current)
      }

      scrollEndTimeout.current = setTimeout(() => {
        setIsScrolling(false)
        setShowScrollIndicator(false)
      }, 1500)

      // Calculate scroll velocity and direction
      const currentPosition: ScrollPosition = {
        position: scrollTop,
        timestamp: now,
        section: currentSection,
      }

      // Update scroll history with limited size
      scrollHistory.current.push(currentPosition)
      if (scrollHistory.current.length > maxHistoryLength) {
        scrollHistory.current.shift()
      }

      // Calculate velocity and direction
      let velocity = 0
      let direction: "up" | "down" | "static" = "static"

      if (scrollHistory.current.length >= 2) {
        const newest = scrollHistory.current[scrollHistory.current.length - 1]
        const oldest = scrollHistory.current[0]

        const timeDiff = newest.timestamp - oldest.timestamp
        const posDiff = newest.position - oldest.position

        if (timeDiff > 0) {
          velocity = Math.abs(posDiff / timeDiff) * 1000 // pixels per second
          direction = posDiff > 0 ? "down" : posDiff < 0 ? "up" : "static"
        }
      }

      setScrollMetrics({
        velocity,
        direction,
        lastPositions: [...scrollHistory.current],
        maxPosition: Math.max(scrollTop, scrollMetrics.maxPosition),
      })

      // Determine current section based on scroll position with IntersectionObserver
      const sectionElements = document.querySelectorAll("[data-section-id]")
      let currentSectionId = currentSections[0].id
      let maxVisiblePercent = 0

      sectionElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const sectionId = element.getAttribute("data-section-id") || ""

        // Calculate how much of the section is visible
        const windowHeight = window.innerHeight
        const visibleTop = Math.max(0, rect.top)
        const visibleBottom = Math.min(windowHeight, rect.bottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        const percentVisible = (visibleHeight / rect.height) * 100

        // Update section visibility state
        setSectionVisibility((prev) => ({
          ...prev,
          [sectionId]: {
            visible: visibleHeight > 0,
            fullyVisible: visibleHeight === rect.height,
            percentVisible,
            enteredViewport: prev[sectionId]?.enteredViewport || visibleHeight > 0,
          },
        }))

        // Determine current section based on visibility percentage
        if (percentVisible > maxVisiblePercent && percentVisible > 15) {
          maxVisiblePercent = percentVisible
          currentSectionId = sectionId
        }
      })

      if (currentSectionId !== currentSection) {
        setCurrentSection(currentSectionId)
      }
    }, 50),
    [activeTab, currentSection, currentSections, scrollMetrics.maxPosition, autoScrollActive],
  )

  // Enhanced scroll to section with animation and progress tracking
  const scrollToSection = useCallback((sectionId: string) => {
    if (!sectionId) return

    const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`)
    if (sectionElement && scrollRef.current) {
      setScrollTarget(sectionId)
      setAutoScrollActive(true)

      // Calculate offset to position section nicely in viewport
      const headerHeight = 100 // Approximate header height
      const offset = sectionElement.getBoundingClientRect().top + scrollRef.current.scrollTop - headerHeight

      // Smooth scroll with animation
      const startPosition = scrollRef.current.scrollTop
      const distance = offset - startPosition
      const duration = Math.min(1000, Math.max(500, Math.abs(distance) / 2))
      const startTime = performance.now()

      // Easing function for smooth animation
      const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeInOutCubic(progress)

        if (scrollRef.current) {
          scrollRef.current.scrollTop = startPosition + distance * easedProgress
        }

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        } else {
          // Animation complete
          setCurrentSection(sectionId)
          setAutoScrollActive(false)
          setScrollTarget(null)

          // Add a small delay before allowing new scrolls
          setTimeout(() => {
            setAutoScrollActive(false)
          }, 100)
        }
      }

      requestAnimationFrame(animateScroll)
    }
  }, [])

  // Keyboard navigation for scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showTermsModal) return

      // Only handle if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const currentIndex = currentSections.findIndex((s) => s.id === currentSection)

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          if (currentIndex < currentSections.length - 1) {
            scrollToSection(currentSections[currentIndex + 1].id)
          }
          break
        case "ArrowUp":
          e.preventDefault()
          if (currentIndex > 0) {
            scrollToSection(currentSections[currentIndex - 1].id)
          }
          break
        case "Home":
          e.preventDefault()
          scrollToSection(currentSections[0].id)
          break
        case "End":
          e.preventDefault()
          scrollToSection(currentSections[currentSections.length - 1].id)
          break
        case "PageDown":
          e.preventDefault()
          if (scrollRef.current) {
            const newPosition = scrollRef.current.scrollTop + scrollRef.current.clientHeight * 0.9
            scrollRef.current.scrollTo({
              top: newPosition,
              behavior: "smooth",
            })
          }
          break
        case "PageUp":
          e.preventDefault()
          if (scrollRef.current) {
            const newPosition = scrollRef.current.scrollTop - scrollRef.current.clientHeight * 0.9
            scrollRef.current.scrollTo({
              top: Math.max(0, newPosition),
              behavior: "smooth",
            })
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showTermsModal, currentSection, currentSections, scrollToSection])

  // Handle print
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const content = document.querySelector(`.terms-content-${activeTab}`)?.innerHTML

    printWindow.document.write(`
      <html>
        <head>
          <title>smileybroom - ${activeTab === "terms" ? "Terms of Service" : "Privacy Policy"}</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 2rem; }
            h1, h2, h3 { margin-top: 2rem; }
            p { margin-bottom: 1rem; }
            @media print {
              @page { margin: 2cm; }
              h1, h2, h3 { page-break-after: avoid; }
              p { orphans: 3; widows: 3; }
            }
          </style>
        </head>
        <body>
          <h1>${activeTab === "terms" ? "Terms of Service" : "Privacy Policy"}</h1>
          ${content}
        </body>
      </html>
    `)

    printWindow.document.close()

    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  // Handle download as PDF with progress feedback
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Your ${activeTab === "terms" ? "Terms of Service" : "Privacy Policy"} PDF is being prepared.`,
    })

    // Simulate PDF generation with progress updates
    let progress = 0
    const interval = setInterval(() => {
      progress += 20

      if (progress < 100) {
        toast({
          title: "Generating PDF",
          description: `${progress}% complete...`,
          variant: "default",
        })
      } else {
        clearInterval(interval)
        toast({
          title: "Download Complete",
          description: "Your document has been downloaded successfully.",
          variant: "default",
        })
      }
    }, 400)
  }

  // Handle accept terms with animation
  const handleAccept = () => {
    // Animated acceptance
    const animateAcceptance = async () => {
      // First show toast
      toast({
        title: "Terms Accepted",
        description: "Thank you for accepting our terms and conditions.",
        variant: "default",
      })

      // Then close modal with slight delay for better UX
      setTimeout(() => {
        acceptTerms()
        closeTermsModal()
      }, 300)
    }

    animateAcceptance()
  }

  // Highlight text based on search query with advanced matching
  const highlightText = (text: string) => {
    if (!searchQuery || !text) return text

    try {
      // Case insensitive search with word boundary awareness
      const regex = new RegExp(`(\\b${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b)`, "gi")
      const parts = text.split(regex)

      return parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded animate-pulse">
            {part}
          </mark>
        ) : (
          part
        ),
      )
    } catch (e) {
      // Fallback for invalid regex
      return text
    }
  }

  // Scroll to top button handler
  const scrollToTop = () => {
    if (scrollRef.current) {
      setAutoScrollActive(true)
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })

      // Reset auto scroll after animation completes
      setTimeout(() => {
        setAutoScrollActive(false)
      }, 1000)
    }
  }

  return (
    <Dialog open={showTermsModal} onOpenChange={closeTermsModal}>
      <DialogContent className="max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[1200px] h-[90vh] p-0 gap-0 top-[5vh] translate-y-0 overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex h-10 w-10 rounded-full bg-primary/10 items-center justify-center">
                {activeTab === "terms" ? (
                  <FileText className="h-5 w-5 text-primary" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {activeTab === "terms" ? "Terms of Service" : "Privacy Policy"}
                </h2>
                <p className="text-sm text-muted-foreground">Last updated: May 7, 2023</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setShowSimplified(!showSimplified)}>
                      {showSimplified ? <Eye className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showSimplified ? "Show Original Version" : "Show Simplified Version"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handlePrint}>
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Print Document</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download as PDF</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button variant="ghost" size="icon" onClick={closeTermsModal} className="ml-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 border-r bg-muted/30 flex-shrink-0">
              <div className="p-4 border-b">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="terms">
                      <FileText className="h-4 w-4 mr-2" />
                      Terms
                    </TabsTrigger>
                    <TabsTrigger value="privacy">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Privacy
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-8 pr-4 py-2 text-sm rounded-md border bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <h3 className="font-medium text-sm mb-3">Sections</h3>
                <nav className="space-y-1">
                  {currentSections.map((section) => {
                    const SectionIcon = section.icon
                    const isActive = currentSection === section.id
                    const hasBeenViewed = sectionVisibility[section.id]?.enteredViewport

                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors relative ${
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : hasBeenViewed
                              ? "hover:bg-muted text-muted-foreground"
                              : "hover:bg-muted"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <SectionIcon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                        <span>{section.title}</span>

                        {/* Reading indicator */}
                        {hasBeenViewed && (
                          <motion.div
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          </motion.div>
                        )}

                        {/* Current section indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"
                            layoutId="activeSectionIndicator"
                          />
                        )}

                        {/* Target section indicator */}
                        {scrollTarget === section.id && !isActive && (
                          <motion.div
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 1.5,
                            }}
                          >
                            <MousePointer className="h-3 w-3 text-primary" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </nav>
              </div>

              <div className="p-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Reading progress</span>
                    <span className="font-medium">{readProgress[activeTab]}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={readProgress[activeTab]} className="h-2" />

                    {/* Section markers on progress bar */}
                    {currentSections.map((section, index) => {
                      // Calculate approximate position on progress bar
                      const position = (index / (currentSections.length - 1)) * 100

                      return (
                        <div
                          key={section.id}
                          className={`absolute w-1 h-3 -mt-0.5 rounded-full ${
                            sectionVisibility[section.id]?.enteredViewport ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                          style={{
                            left: `${position}%`,
                            transform: "translateX(-50%)",
                          }}
                        />
                      )
                    })}

                    {/* Animated current position indicator */}
                    {isScrolling && (
                      <motion.div
                        className="absolute top-0 h-2 w-2 rounded-full bg-primary shadow-lg"
                        style={{
                          left: `${readProgress[activeTab]}%`,
                          transform: "translateX(-50%)",
                        }}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      />
                    )}
                  </div>
                </div>

                {/* Scroll metrics display (for advanced users) */}
                <div className="mt-4 pt-4 border-t border-muted text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Scroll velocity</span>
                    <span>{Math.round(scrollMetrics.velocity)} px/s</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Direction</span>
                    <span className="capitalize">{scrollMetrics.direction}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Mobile tabs */}
              <div className="md:hidden p-4 border-b">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="terms">
                      <FileText className="h-4 w-4 mr-2" />
                      Terms
                    </TabsTrigger>
                    <TabsTrigger value="privacy">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Privacy
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="relative mt-4">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-8 pr-4 py-2 text-sm rounded-md border bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Reading progress</span>
                    <span className="font-medium">{readProgress[activeTab]}%</span>
                  </div>
                  <Progress value={readProgress[activeTab]} className="h-2" />
                </div>
              </div>

              {/* Content area with enhanced scroll */}
              <ScrollArea
                className="flex-1 relative h-full"
                onScroll={handleScroll}
                ref={scrollRef}
                scrollHideDelay={100}
              >
                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="terms" className="terms-tabs-content">
                    <div className={`p-6 space-y-8 terms-content-terms ${showSimplified ? "hidden" : "block"}`}>
                      <section data-section-id="introduction">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Introduction
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Introduction</h3>
                        <p className="leading-relaxed text-muted-foreground mb-4">
                          Welcome to smileybroom ("Company", "we", "our", "us")! These Terms of Service govern your use
                          of our website and services.
                        </p>
                        <p className="leading-relaxed">
                          By accessing our website at{" "}
                          <a href="#" className="text-primary hover:underline">
                            smileybroom.com
                          </a>
                          , you are agreeing to be bound by these Terms of Service and all applicable laws and
                          regulations. If you do not agree with any of these terms, you are prohibited from using or
                          accessing this site.
                        </p>
                      </section>

                      <section data-section-id="acceptance">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Acceptance
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Acceptance of Terms</h3>
                        <p className="leading-relaxed mb-4">
                          By accessing or using our services, you agree to be bound by these Terms. If you disagree with
                          any part of the terms, you may not access the service.
                        </p>
                        <div className="bg-muted/30 p-4 rounded-lg border">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-primary" />
                            Important Note
                          </h4>
                          <p className="text-sm">
                            These terms constitute a legally binding agreement. We recommend reading them carefully
                            before using our services. By clicking "I Accept" or by using our services, you acknowledge
                            that you have read and understood these terms.
                          </p>
                        </div>
                      </section>

                      <section data-section-id="services">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Services
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Service Description</h3>
                        <p className="leading-relaxed mb-4">
                          smileybroom provides professional cleaning services for residential and commercial properties.
                          Our services include regular cleaning, deep cleaning, move-in/move-out cleaning, and office
                          cleaning.
                        </p>

                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="regular-cleaning">
                            <AccordionTrigger>Regular Cleaning</AccordionTrigger>
                            <AccordionContent>
                              Our regular cleaning service includes dusting, vacuuming, mopping, bathroom cleaning,
                              kitchen cleaning, and general tidying. This service is ideal for maintaining a clean home
                              on a regular basis.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="deep-cleaning">
                            <AccordionTrigger>Deep Cleaning</AccordionTrigger>
                            <AccordionContent>
                              Our deep cleaning service is a more thorough cleaning that includes all regular cleaning
                              tasks plus cleaning inside appliances, behind furniture, baseboards, vents, and other
                              areas that are not typically cleaned during regular cleaning.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="move-cleaning">
                            <AccordionTrigger>Move-In/Move-Out Cleaning</AccordionTrigger>
                            <AccordionContent>
                              Our move-in/move-out cleaning service is designed to prepare a property for new occupants
                              or to clean a property after moving out. This service includes deep cleaning of all areas,
                              including inside cabinets, appliances, and other areas.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </section>

                      <section data-section-id="booking">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Booking
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Booking and Cancellation</h3>
                        <p className="leading-relaxed mb-4">
                          You may book our services through our website or mobile app. Cancellations must be made at
                          least 24 hours before the scheduled service. Late cancellations may incur a fee of up to 50%
                          of the service cost.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900">
                            <h4 className="font-medium mb-2 text-green-800 dark:text-green-300">Booking Process</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-green-700 dark:text-green-300">
                              <li>Create an account or log in</li>
                              <li>Select the service you need</li>
                              <li>Choose a date and time</li>
                              <li>Provide your address and access instructions</li>
                              <li>Complete payment</li>
                            </ul>
                          </div>

                          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-900">
                            <h4 className="font-medium mb-2 text-amber-800 dark:text-amber-300">Cancellation Policy</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700 dark:text-amber-300">
                              <li>Cancel 24+ hours before: No fee</li>
                              <li>Cancel 12-24 hours before: 25% fee</li>
                              <li>Cancel 4-12 hours before: 50% fee</li>
                              <li>Cancel less than 4 hours before: 75% fee</li>
                              <li>No-show: 100% fee</li>
                            </ul>
                          </div>
                        </div>
                      </section>

                      <section data-section-id="payment">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Payment
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Payment Terms</h3>
                        <p className="leading-relaxed mb-4">
                          Payment is due at the time of booking. We accept credit cards, debit cards, and other payment
                          methods specified on our website. Recurring services will be automatically charged according
                          to the selected frequency.
                        </p>

                        <div className="flex flex-wrap gap-3 mb-4">
                          <Badge variant="secondary" className="text-sm py-1">
                            Credit Cards
                          </Badge>
                          <Badge variant="secondary" className="text-sm py-1">
                            Debit Cards
                          </Badge>
                          <Badge variant="secondary" className="text-sm py-1">
                            PayPal
                          </Badge>
                          <Badge variant="secondary" className="text-sm py-1">
                            Apple Pay
                          </Badge>
                          <Badge variant="secondary" className="text-sm py-1">
                            Google Pay
                          </Badge>
                        </div>
                      </section>

                      <section data-section-id="guarantee">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Guarantee
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Service Guarantee</h3>
                        <p className="leading-relaxed mb-4">
                          We strive to provide high-quality cleaning services. If you are not satisfied with our
                          service, please contact us within 24 hours, and we will re-clean the areas of concern at no
                          additional cost.
                        </p>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                          <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-300 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Our Satisfaction Guarantee
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Your satisfaction is our top priority. If you're not completely satisfied with our service,
                            please let us know within 24 hours, and we'll return to re-clean the areas of concern at no
                            additional cost. This guarantee applies to all our cleaning services.
                          </p>
                        </div>
                      </section>
                    </div>

                    {/* Simplified version */}
                    <div className={`p-6 space-y-8 ${showSimplified ? "block" : "hidden"}`}>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900 mb-6">
                        <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Simplified Version
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          This is a simplified version of our Terms of Service. While we've tried to make it easier to
                          understand, the full version remains the legally binding document.
                        </p>
                      </div>

                      <section>
                        <h3 className="text-xl font-semibold mb-3">What This Agreement Covers</h3>
                        <p className="leading-relaxed mb-4 text-base">
                          This agreement explains the rules for using smileybroom's website and cleaning services. By
                          using our services, you're agreeing to these rules.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-semibold mb-3">Our Cleaning Services</h3>
                        <p className="leading-relaxed mb-4 text-base">We offer different types of cleaning services:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                          <li>Regular cleaning for maintaining your home</li>
                          <li>Deep cleaning for a more thorough clean</li>
                          <li>Move-in/move-out cleaning when you're changing homes</li>
                          <li>Office cleaning for workspaces</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-xl font-semibold mb-3">Booking and Cancellations</h3>
                        <p className="leading-relaxed mb-4 text-base">
                          You can book our services through our website or app. If you need to cancel, please do so at
                          least 24 hours before your scheduled service. If you cancel later than that, you might have to
                          pay a fee.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-semibold mb-3">Payments</h3>
                        <p className="leading-relaxed mb-4 text-base">
                          You'll need to pay when you book a service. We accept credit cards, debit cards, PayPal, and
                          mobile payment options. For recurring services, we'll automatically charge you based on your
                          selected schedule.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-semibold mb-3">Our Guarantee</h3>
                        <p className="leading-relaxed mb-4 text-base">
                          If you're not happy with our cleaning, let us know within 24 hours. We'll come back and
                          re-clean the areas you're not satisfied with at no extra cost.
                        </p>
                      </section>
                    </div>
                  </TabsContent>

                  <TabsContent value="privacy" className="terms-tabs-content">
                    <div className={`p-6 space-y-8 terms-content-privacy ${showSimplified ? "hidden" : "block"}`}>
                      <section data-section-id="collection">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Collection
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Information Collection</h3>
                        <p className="leading-relaxed mb-4">
                          We collect personal information that you voluntarily provide to us when you register, express
                          interest in our services, or otherwise contact us.
                        </p>

                        <div className="bg-muted/30 p-4 rounded-lg border mb-4">
                          <h4 className="font-medium mb-2">Types of Information We Collect</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-1">Personal Information</h5>
                              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Billing address</li>
                                <li>Payment information</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-1">Usage Information</h5>
                              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                <li>IP address</li>
                                <li>Browser type</li>
                                <li>Device information</li>
                                <li>Pages visited</li>
                                <li>Time spent on site</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section data-section-id="usage">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Usage
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">How We Use Information</h3>
                        <p className="leading-relaxed mb-4">
                          We use your information to provide our services, improve your experience, and communicate with
                          you.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                            <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-300">Service Provision</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              We use your information to provide our cleaning services, process payments, and
                              communicate with you about your bookings.
                            </p>
                          </div>

                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900">
                            <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-300">
                              Service Improvement
                            </h4>
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                              We analyze usage data to improve our website, app, and services to better meet your needs.
                            </p>
                          </div>

                          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-100 dark:border-pink-900">
                            <h4 className="font-medium mb-2 text-pink-800 dark:text-pink-300">Communication</h4>
                            <p className="text-sm text-pink-700 dark:text-pink-300">
                              We use your contact information to send service updates, promotional offers, and respond
                              to your inquiries.
                            </p>
                          </div>
                        </div>
                      </section>

                      <section data-section-id="sharing">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Sharing
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Information Sharing</h3>
                        <p className="leading-relaxed mb-4">
                          We may share your information with service providers who help us operate our business. We do
                          not sell your personal information to third parties.
                        </p>

                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="service-providers">
                            <AccordionTrigger>Service Providers</AccordionTrigger>
                            <AccordionContent>
                              We share information with trusted third-party service providers who help us operate our
                              business, such as payment processors, email service providers, and customer support tools.
                              These providers are contractually obligated to protect your information.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="legal-requirements">
                            <AccordionTrigger>Legal Requirements</AccordionTrigger>
                            <AccordionContent>
                              We may disclose your information if required to do so by law or in response to valid
                              requests by public authorities (e.g., a court or government agency).
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="business-transfers">
                            <AccordionTrigger>Business Transfers</AccordionTrigger>
                            <AccordionContent>
                              If we are involved in a merger, acquisition, or sale of all or a portion of our assets,
                              your information may be transferred as part of that transaction. We will notify you via
                              email and/or a prominent notice on our website of any change in ownership or uses of your
                              personal information.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </section>

                      <section data-section-id="cookies">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Cookies
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Cookies & Tracking</h3>
                        <p className="leading-relaxed mb-4">
                          We use cookies and similar tracking technologies to track activity on our website and store
                          certain information. You can instruct your browser to refuse all cookies or to indicate when a
                          cookie is being sent.
                        </p>

                        <div className="bg-muted/30 p-4 rounded-lg border mb-4">
                          <h4 className="font-medium mb-2">Types of Cookies We Use</h4>
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-sm font-medium">Essential Cookies</h5>
                              <p className="text-sm text-muted-foreground">
                                These cookies are necessary for the website to function properly and cannot be switched
                                off.
                              </p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium">Analytical Cookies</h5>
                              <p className="text-sm text-muted-foreground">
                                These cookies allow us to count visits and traffic sources so we can measure and improve
                                the performance of our site.
                              </p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium">Marketing Cookies</h5>
                              <p className="text-sm text-muted-foreground">
                                These cookies are used to track visitors across websites to enable us to display
                                relevant advertisements.
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section data-section-id="security">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Security
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Data Security</h3>
                        <p className="leading-relaxed mb-4">
                          We implement appropriate security measures to protect your personal information. However, no
                          method of transmission over the Internet or electronic storage is 100% secure, and we cannot
                          guarantee absolute security.
                        </p>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900">
                          <h4 className="font-medium mb-2 text-green-800 dark:text-green-300 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Our Security Measures
                          </h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-green-700 dark:text-green-300">
                            <li>Encryption of sensitive data</li>
                            <li>Secure payment processing</li>
                            <li>Regular security assessments</li>
                            <li>Employee access controls</li>
                            <li>Continuous monitoring for suspicious activities</li>
                          </ul>
                        </div>
                      </section>

                      <section data-section-id="rights">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                            Rights
                          </Badge>
                          <div className="h-px flex-1 bg-muted"></div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">Your Rights</h3>
                        <p className="leading-relaxed mb-4">
                          Depending on your location, you may have certain rights regarding your personal information,
                          such as the right to access, correct, or delete your data.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2">For EU/UK Residents</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              <li>Right to access your data</li>
                              <li>Right to rectification</li>
                              <li>Right to erasure</li>
                              <li>Right to restrict processing</li>
                              <li>Right to data portability</li>
                              <li>Right to object</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">For California Residents</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              <li>Right to know what information is collected</li>
                              <li>Right to delete your information</li>
                              <li>Right to opt-out of the sale of information</li>
                              <li>Right to non-discrimination</li>
                            </ul>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          To exercise your rights, please contact us at{" "}
                          <a href="mailto:privacy@smileybroom.com" className="text-primary hover:underline">
                            privacy@smileybroom.com
                          </a>
                          .
                        </p>
                      </section>
                    </div>

                    {/* Simplified version */}
                    <div className={`p-6 space-y-8 ${showSimplified ? "block" : "hidden"}`}>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900 mb-6">
                        <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Simplified Version
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          This is a simplified version of our Privacy Policy. While we've tried to make it easier to
                          understand, the full version remains the legally binding document.
                        </p>
                      </div>

                      <section>
                        <h3 className="text-xl font-semibold mb-3">Information We Collect</h3>
                        <p className="leading-relaxed mb-4 text-base">
                          We collect information you provide when you use our services, such as your name, email, phone
                          number, and address. We also collect some information automatically, like your IP address and
                          browser type.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-semibold mb-3">How We Use Your Information</h3>
                        <p className="leading-relaxed mb-4 text-base">We use your information to:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                          <li>Provide our cleaning services to you</li>
                          <li>Process your payments</li>
                          <li>Communicate with you about your bookings</li>
                          <li>Improve our website and services</li>
                          <li>Send you promotional offers (if you opt in)</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-xl font-semibold mb-3">Sharing Your Information</h3>
                        <p className="leading-relaxed mb-4 text-base">
                          We share your information with service providers who help us run our business, like payment
                          processors. We don't sell your personal information to third parties.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-semibold mb-3">Cookies</h3>
                        <p className="leading-relaxed mb-4 text-base">
                          We use cookies (small text files stored on your device) to remember your preferences and
                          analyze how people use our website. You can control cookies through your browser settings.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xl font-semibold mb-3">Your Rights</h3>
                        <p className="leading-relaxed mb-4 text-base">
                          Depending on where you live, you have rights regarding your personal information. These may
                          include the right to access, correct, or delete your information. Contact us at
                          privacy@smileybroom.com to exercise these rights.
                        </p>
                      </section>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Scroll bar with section indicators */}
                <ScrollBar orientation="vertical" className="w-2.5 bg-muted/20" />

                {/* Floating scroll indicators */}
                <AnimatePresence>
                  {showScrollIndicator && (
                    <motion.div
                      className="fixed bottom-20 right-6 flex flex-col gap-2 z-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.button
                        onClick={scrollToTop}
                        className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowUp className="h-5 w-5" />
                      </motion.button>

                      <motion.div className="p-2 bg-background border rounded-md shadow-lg text-xs text-center">
                        <div className="font-medium">{currentSection}</div>
                        <div className="text-muted-foreground mt-1">{readProgress[activeTab]}% read</div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reading guide - subtle indicator of current reading position */}
                <AnimatePresence>
                  {isScrolling && (
                    <motion.div
                      className="fixed left-1/2 bottom-4 -translate-x-1/2 bg-background/80 backdrop-blur-sm border rounded-full px-3 py-1.5 shadow-lg z-50 flex items-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">
                        {scrollMetrics.direction === "down" ? "Reading..." : "Reviewing..."}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bookmark indicator */}
                <AnimatePresence>
                  {autoScrollActive && scrollTarget && (
                    <motion.div
                      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-lg px-4 py-2 shadow-lg z-50 flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Bookmark className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Navigating to {currentSections.find((s) => s.id === scrollTarget)?.title}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollArea>

              {/* Mobile section navigation */}
              <div className="md:hidden p-4 border-t">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentIndex = currentSections.findIndex((s) => s.id === currentSection)
                      if (currentIndex > 0) {
                        scrollToSection(currentSections[currentIndex - 1].id)
                      }
                    }}
                    disabled={currentSections.findIndex((s) => s.id === currentSection) === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    {currentSections.findIndex((s) => s.id === currentSection) + 1} of {currentSections.length}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentIndex = currentSections.findIndex((s) => s.id === currentSection)
                      if (currentIndex < currentSections.length - 1) {
                        scrollToSection(currentSections[currentIndex + 1].id)
                      }
                    }}
                    disabled={currentSections.findIndex((s) => s.id === currentSection) === currentSections.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-muted/30 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Languages className="h-4 w-4 mr-2" />
                        English
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Change Language (Coming Soon)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button variant="ghost" size="sm" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Document
                  </a>
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={closeTermsModal}>
                  Close
                </Button>
                <Button
                  onClick={handleAccept}
                  disabled={readProgress[activeTab] < 70 && activeTab === "terms"}
                  className={readProgress[activeTab] >= 70 || activeTab !== "terms" ? "relative overflow-hidden" : ""}
                >
                  {readProgress[activeTab] < 70 && activeTab === "terms" ? (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Please read more
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />I Accept
                      {/* Animated background effect when button is enabled */}
                      {(readProgress[activeTab] >= 70 || activeTab !== "terms") && (
                        <motion.div
                          className="absolute inset-0 bg-primary/20"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1.5,
                            ease: "linear",
                          }}
                        />
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <style jsx global>{`
        .terms-tabs-content {
          height: 100%;
          margin: 0;
          padding: 0;
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
      `}</style>
    </Dialog>
  )
}
