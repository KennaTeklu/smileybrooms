"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Share2, Bot, ChevronLeft, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Dynamically import the content components
const CollapsibleSettingsPanelContent = dynamic(
  () => import("./collapsible-settings-panel").then((mod) => mod.CollapsibleSettingsPanel),
  { ssr: false, loading: () => null },
)
const CollapsibleSharePanelContent = dynamic(
  () => import("./collapsible-share-panel").then((mod) => mod.CollapsibleSharePanel),
  { ssr: false, loading: () => null },
)
const SuperChatbotContent = dynamic(() => import("./super-chatbot").then((mod) => mod.SuperChatbot), {
  ssr: false,
  loading: () => null,
})

export default function UnifiedSidePanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("settings")
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0)
  const [isScrollPaused, setIsScrollPaused] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Define configurable scroll range values
  const minTopOffset = 20 // Minimum distance from the top of the viewport
  const initialScrollOffset = 50 // How far down the panel starts relative to scroll
  const bottomPageMargin = 20 // Margin from the very bottom of the document

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setIsScrollPaused(isExpanded)
  }, [isExpanded])

  useEffect(() => {
    if (!isMounted || isScrollPaused) return

    const updatePositionAndHeight = () => {
      setScrollPosition(window.scrollY)
      if (panelRef.current) {
        setPanelHeight(panelRef.current.offsetHeight)
      }
    }

    window.addEventListener("scroll", updatePositionAndHeight, { passive: true })
    window.addEventListener("resize", updatePositionAndHeight, { passive: true })
    updatePositionAndHeight()

    return () => {
      window.removeEventListener("scroll", updatePositionAndHeight)
      window.removeEventListener("resize", updatePositionAndHeight)
    }
  }, [isMounted, isScrollPaused])

  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, isMounted])

  if (!isMounted) {
    return null
  }

  const documentHeight = document.documentElement.scrollHeight
  const maxPanelTop = documentHeight - panelHeight - bottomPageMargin

  const panelTopPosition = isScrollPaused
    ? `${Math.max(minTopOffset, Math.min(scrollPosition + initialScrollOffset, maxPanelTop))}px`
    : `${Math.max(minTopOffset, Math.min(window.scrollY + initialScrollOffset, maxPanelTop))}px`

  return (
    <div ref={panelRef} className="fixed right-0 z-50 flex" style={{ top: panelTopPosition }}>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "min(100vw, 400px)", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-l-lg shadow-lg overflow-hidden border-l border-t border-b border-gray-200 dark:border-gray-800 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {activeTab === "settings" && <Settings className="h-5 w-5" />}
                {activeTab === "share" && <Share2 className="h-5 w-5" />}
                {activeTab === "chatbot" && <Bot className="h-5 w-5" />}
                {activeTab === "settings" && "Settings"}
                {activeTab === "share" && "Share"}
                {activeTab === "chatbot" && "AI Assistant"}
                {isScrollPaused && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded ml-2">
                    Scroll Fixed
                  </span>
                )}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)} aria-label="Collapse side panel">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-3 p-2">
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-1" /> Settings
                </TabsTrigger>
                <TabsTrigger value="share">
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </TabsTrigger>
                <TabsTrigger value="chatbot">
                  <Bot className="h-4 w-4 mr-1" /> Chatbot
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
                <TabsContent value="settings" className="mt-0">
                  <Suspense fallback={null}>
                    <CollapsibleSettingsPanelContent isUnifiedPanel={true} />
                  </Suspense>
                </TabsContent>
                <TabsContent value="share" className="mt-0">
                  <Suspense fallback={null}>
                    <CollapsibleSharePanelContent isUnifiedPanel={true} />
                  </Suspense>
                </TabsContent>
                <TabsContent value="chatbot" className="mt-0">
                  <Suspense fallback={null}>
                    <SuperChatbotContent isUnifiedPanel={true} />
                  </Suspense>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsExpanded(true)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-l border-t border-b border-gray-200 dark:border-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open side panel"
          >
            <PanelLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Tools</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
