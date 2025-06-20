"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Loader2, Settings, Mic, MicOff, MapPin, Star, MessageSquare, TrendingUp, Minimize2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useAccessibility } from "@/lib/accessibility-context"
import { useAnalytics } from "@/hooks/use-analytics"
import { useTour } from "@/hooks/use-tour"
import { usePathname } from "next/navigation"
import { processFormSubmission } from "@/lib/form-utils"
import { useToast } from "@/hooks/use-toast"

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

  const [isMinimized, setIsMinimized] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [userContext, setUserContext] = useState({
    currentPage: pathname,
    hasInteracted: false,
    sessionDuration: 0,
    cartItems: 0,
  })

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

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

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

      // Add system message to chat
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "system",
        content: "✅ Your feedback has been submitted successfully!",
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
      content: "🎯 Starting the website tour! I'll guide you through the key features.",
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
• 🧹 Cleaning service questions
• 📋 Booking and scheduling
• 💰 Pricing information
• 🎯 Website tour and navigation
• 📝 Feedback and suggestions
• 🎤 Voice commands (click the mic!)

What would you like to know?`

    return welcome
  }

  const quickActions = [
    { label: "Start Tour", icon: MapPin, action: handleTourRequest },
    {
      label: "Get Pricing",
      icon: TrendingUp,
      action: () => handleInputChange({ target: { value: "What are your cleaning service prices?" } } as any),
    },
    {
      label: "Book Service",
      icon: Star,
      action: () => handleInputChange({ target: { value: "How do I book a cleaning service?" } } as any),
    },
    { label: "Give Feedback", icon: MessageSquare, action: () => setActiveTab("feedback") },
  ]

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsMinimized(false)} className="rounded-full w-14 h-14 shadow-lg" size="icon">
          <MessageSquare className="h-6 w-6" />
          {messages.length > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center">
              {messages.length}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 h-[500px] flex flex-col shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Super AI Assistant
              {(preferences.screenReader || preferences.highContrast || preferences.largeText) && (
                <Badge variant="secondary" className="text-xs">
                  Accessible
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            <CardContent className="flex-1 p-3 overflow-hidden flex flex-col">
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
            </CardContent>
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
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button key={index} variant="outline" className="h-20 flex flex-col gap-1" onClick={action.action}>
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Current Context</h4>
                <div className="text-xs space-y-1">
                  <div>Page: {pathname}</div>
                  <div>Messages: {messages.length}</div>
                  <div>Theme: {theme}</div>
                  {isTourActive && <div className="text-green-600">🎯 Tour Active</div>}
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="feedback" className="flex-1 flex flex-col m-0">
            <CardContent className="p-3">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Quick Feedback</label>
                  <div className="flex gap-2 mt-1">
                    {["😍", "😊", "😐", "😕", "😞"].map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleFormSubmission({
                            type: "quick_feedback",
                            rating: 5 - index,
                            emoji,
                            page: pathname,
                          })
                        }
                      >
                        {emoji}
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
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
