"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Loader2,
  Mic,
  MicOff,
  Compass,
  DollarSign,
  CalendarCheck,
  MessageSquareText,
  ChevronLeft,
  Bot,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useAccessibility } from "@/lib/accessibility-context"
import { useAnalytics } from "@/hooks/use-analytics"
import { useTour } from "@/hooks/use-tour"
import { usePathname } from "next/navigation"
import { processFormSubmission } from "@/lib/form-utils"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  type?: "message" | "form" | "tour" | "feedback" | "analytics"
  metadata?: any
}

export default function SuperChatbot() {
  const { theme } = useTheme()
  const { preferences } = useAccessibility()
  const { trackEvent } = useAnalytics()
  const { startTour, isActive: isTourActive } = useTour()
  const pathname = usePathname()
  const { toast } = useToast()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0)
  const [isScrollPaused, setIsScrollPaused] = useState(false)
  const [jotformLoaded, setJotformLoaded] = useState(false)
  const [userContext, setUserContext] = useState({
    currentPage: pathname,
    hasInteracted: false,
    sessionDuration: 0,
    cartItems: 0,
  })

  const panelRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const jotformIframeRef = useRef<HTMLIFrameElement>(null)

  // Define configurable scroll range values
  const minTopOffset = 20 // Minimum distance from the top of the viewport
  // Adjusted initialScrollOffset to be 50px below the share panel (which is around 100px from top)
  const initialScrollOffset = 150 // This positions it roughly 50px below the share panel
  const bottomPageMargin = 20 // Margin from the very bottom of the document

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: "/api/chat",
    body: {
      userPreferences: {
        theme,
        ...preferences,
      },
      userContext,
      currentPage: pathname,
    },
    onFinish: (message) => {
      trackEvent("chatbot_response_received", {
        messageLength: message.content.length,
        currentPage: pathname,
      })
    },
  })

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Pause panel's scroll-following when expanded
  useEffect(() => {
    setIsScrollPaused(isExpanded)
  }, [isExpanded])

  // Track scroll position and panel height after mounting
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
    updatePositionAndHeight() // Initial call

    return () => {
      window.removeEventListener("scroll", updatePositionAndHeight)
      window.removeEventListener("resize", updatePositionAndHeight)
    }
  }, [isMounted, isScrollPaused])

  // Handle click outside to collapse panel
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

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleInputChange({ target: { value: transcript } } as any)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
        toast({
          title: "Voice Recognition Error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [handleInputChange, toast])

  // Load JotForm script when "Live Agent" tab is active
  useEffect(() => {
    if (activeTab === "live-agent" && !jotformLoaded) {
      const script = document.createElement("script")
      script.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js"
      script.onload = () => {
        setJotformLoaded(true)
        if (jotformIframeRef.current) {
          ;(window as any).jotformEmbedHandler(`iframe[id='${jotformIframeRef.current.id}']`, "https://www.jotform.com")
        }
      }
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [activeTab, jotformLoaded])

  // Track user context
  useEffect(() => {
    setUserContext((prev) => ({
      ...prev,
      currentPage: pathname,
      hasInteracted: messages.length > 0,
    }))
  }, [pathname, messages.length])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Track chatbot interactions
  useEffect(() => {
    if (messages.length > 0) {
      trackEvent("chatbot_interaction", {
        messageCount: messages.length,
        currentPage: pathname,
      })
    }
  }, [messages.length, pathname, trackEvent])

  // Don't render until mounted to prevent SSR issues
  if (!isMounted) {
    return null
  }

  // Calculate panel position based on scroll and document height
  const documentHeight = document.documentElement.scrollHeight
  const maxPanelTop = documentHeight - panelHeight - bottomPageMargin

  // Use the current scroll position for panel's top if scroll-following is paused, otherwise calculate
  const panelTopPosition = isScrollPaused
    ? `${Math.max(minTopOffset, Math.min(scrollPosition + initialScrollOffset, maxPanelTop))}px`
    : `${Math.max(minTopOffset, Math.min(window.scrollY + initialScrollOffset, maxPanelTop))}px`

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Not Supported",
        description: "Voice input is not supported in this browser.",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      trackEvent("voice_input_started", { currentPage: pathname })
    }
  }

  const handleFormSubmission = async (formData: any) => {
    try {
      await processFormSubmission(formData, "feedback")
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll review it shortly.",
      })

      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "system",
        content: "Your feedback has been submitted successfully!",
        timestamp: new Date(),
        type: "form",
      }

      setMessages((prev) => [...prev, systemMessage])
      trackEvent("chatbot_form_submission", { type: "feedback" })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTourRequest = () => {
    startTour("mainWebsiteTour")
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "system",
      content: "Starting the website tour! I'll guide you through the key features.",
      timestamp: new Date(),
      type: "tour",
    }
    setMessages((prev) => [...prev, systemMessage])
    trackEvent("chatbot_tour_started", { currentPage: pathname })
  }

  const getContextualWelcome = () => {
    const pageContext =
      {
        "/": "homepage",
        "/checkout": "checkout process",
        "/pricing": "pricing page",
        "/about": "about page",
        "/contact": "contact page",
      }[pathname] || "this page"

    const accessibilityFeatures = []
    if (preferences.screenReader) accessibilityFeatures.push("screen reader support")
    if (preferences.highContrast) accessibilityFeatures.push("high contrast mode")
    if (preferences.largeText) accessibilityFeatures.push("large text")
    if (preferences.keyboardOnly) accessibilityFeatures.push("keyboard navigation")

    let welcome = `Hi! I'm your SmileyBrooms AI assistant. I see you're on the ${pageContext}.`

    if (accessibilityFeatures.length > 0) {
      welcome += ` I notice you have ${accessibilityFeatures.join(", ")} enabled, so I'll tailor my responses accordingly.`
    }

    welcome += `\n\nI can help you with:
• Cleaning service questions
• Booking and scheduling
• Pricing information
• Website tour and navigation
• Feedback and suggestions
• Voice commands (click the mic!)

What would you like to know?`

    return welcome
  }

  const quickActions = [
    { label: "Start Tour", icon: Compass, action: handleTourRequest },
    {
      label: "Get Pricing",
      icon: DollarSign,
      action: () => handleInputChange({ target: { value: "What are your cleaning service prices?" } } as any),
    },
    {
      label: "Book Service",
      icon: CalendarCheck,
      action: () => handleInputChange({ target: { value: "How do I book a cleaning service?" } } as any),
    },
    { label: "Give Feedback", icon: MessageSquareText, action: () => setActiveTab("feedback") },
  ]

  return (
    <div ref={panelRef} className="fixed right-0 z-40 flex" style={{ top: panelTopPosition }}>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "min(100vw, 400px)", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-l-lg shadow-xl overflow-hidden border-l border-t border-b border-gray-200 dark:border-gray-800"
          >
            <div className="bg-primary text-primary-foreground p-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <span className="font-semibold">AI Assistant</span>
                  {isScrollPaused && (
                    <Badge variant="secondary" className="text-xs">
                      Fixed
                    </Badge>
                  )}
                  {(preferences.screenReader || preferences.highContrast || preferences.largeText) && (
                    <Badge variant="secondary" className="text-xs">
                      Accessible
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Collapse chatbot"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="h-[500px] flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-4 m-2">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="live-agent">Live Agent</TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 flex flex-col m-0">
                  <div className="flex-1 p-3 overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1 pr-2">
                      <div className="space-y-3">
                        {messages.length === 0 && (
                          <div className="text-sm mt-4 p-3 bg-muted/50 rounded-lg">{getContextualWelcome()}</div>
                        )}
                        {messages.map((m) => (
                          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[85%] p-3 rounded-lg ${
                                m.role === "user"
                                  ? "bg-blue-500 text-white"
                                  : m.role === "system"
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : preferences.highContrast
                                      ? "bg-black text-white border border-white"
                                      : "bg-gray-200 text-gray-800"
                              } ${preferences.largeText ? "text-base" : "text-sm"}`}
                            >
                              {m.content}
                              {m.type && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {m.type}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div
                              className={`max-w-[85%] p-3 rounded-lg flex items-center ${
                                preferences.highContrast
                                  ? "bg-black text-white border border-white"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              {preferences.screenReader ? "Processing your request..." : "Thinking..."}
                            </div>
                          </div>
                        )}
                        {error && (
                          <div className="text-red-500 text-sm text-center mt-2 p-2 bg-red-50 rounded-lg">
                            <strong>Error:</strong> {error.message}
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </div>
                  <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
                    <Input
                      className={`flex-1 ${preferences.largeText ? "text-base" : ""}`}
                      value={input}
                      placeholder={preferences.screenReader ? "Type your message here" : "Ask me anything..."}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      aria-label="Chat message input"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={handleVoiceInput}
                      disabled={isLoading}
                      className={isListening ? "bg-red-100 border-red-300" : ""}
                      aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    >
                      {isListening ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isLoading || !input.trim()}
                      aria-label={isLoading ? "Sending message" : "Send message"}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="actions" className="flex-1 flex flex-col m-0">
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-20 flex flex-col gap-1"
                          onClick={action.action}
                        >
                          <action.icon className="h-5 w-5" />
                          <span className="text-xs">{action.label}</span>
                        </Button>
                      ))}
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Current Context</h4>
                      <div className="text-xs space-y-1">
                        <div>Page: {pathname}</div>
                        <div>Messages: {messages.length}</div>
                        <div>Theme: {theme}</div>
                        {isTourActive && <div className="text-green-600">🎯 Tour Active</div>}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="feedback" className="flex-1 flex flex-col m-0">
                  <div className="p-3">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Quick Feedback</label>
                        <div className="flex gap-2 mt-1">
                          {["Excellent", "Good", "Neutral", "Poor", "Very Poor"].map((label, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleFormSubmission({
                                  type: "quick_feedback",
                                  rating: 5 - index,
                                  page: pathname,
                                })
                              }
                            >
                              {label}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Detailed Feedback</label>
                        <textarea
                          className="w-full mt-1 p-2 border rounded-md text-sm"
                          rows={3}
                          placeholder="Tell us what you think..."
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              handleFormSubmission({
                                type: "detailed_feedback",
                                message: e.target.value,
                                page: pathname,
                              })
                              e.target.value = ""
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Live Agent Tab with JotForm Embed */}
                <TabsContent value="live-agent" className="flex-1 flex flex-col m-0 p-0">
                  <div className="flex-1 w-full h-full overflow-hidden">
                    <iframe
                      id="JotFormIFrame-019727f88b017b95a6ff71f7fdcc58538ab4"
                      ref={jotformIframeRef}
                      title="smileybrooms.com: Customer Support Representative"
                      onLoad={() => {
                        if (jotformIframeRef.current) {
                          if (jotformLoaded) {
                            ;(window as any).jotformEmbedHandler(
                              `iframe[id='${jotformIframeRef.current.id}']`,
                              "https://www.jotform.com",
                            )
                          }
                        }
                      }}
                      allowTransparency={true}
                      allow="geolocation; microphone; camera; fullscreen"
                      src="https://agent.jotform.com/019727f88b017b95a6ff71f7fdcc58538ab4?embedMode=iframe&background=1&shadow=1"
                      frameBorder="0"
                      style={{
                        minWidth: "100%",
                        maxWidth: "100%",
                        height: "100%",
                        border: "none",
                        width: "100%",
                      }}
                      scrolling="no"
                    ></iframe>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
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
            aria-label="Open AI Assistant"
          >
            <Bot className="h-5 w-5" />
            <span className="text-sm font-medium">AI</span>
            {messages.length > 0 && (
              <Badge className="ml-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                {messages.length}
              </Badge>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
