"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Bot, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CollapsibleChatbotPanelProps {
  sharePanelInfo: {
    expanded: boolean
    width: number
  }
}

const DEFAULT_COLLAPSED_TOP_OFFSET = 100 // Default position from top
const SHARE_PANEL_ACTIVE_CHATBOT_TOP_OFFSET = 500 // Position when share panel is active

export function CollapsibleChatbotPanel({ sharePanelInfo }: CollapsibleChatbotPanelProps) {
  const [isChatbotExpanded, setIsChatbotExpanded] = useState(false)
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Calculate dynamic top position
  const dynamicTop = sharePanelInfo.expanded ? SHARE_PANEL_ACTIVE_CHATBOT_TOP_OFFSET : DEFAULT_COLLAPSED_TOP_OFFSET

  // Transition class for instant movement when share panel is active, smooth otherwise
  const topTransitionClass = sharePanelInfo.expanded ? "duration-0" : "duration-300"

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }])
      setInput("")
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "Hello! How can I help you today?", sender: "bot" }])
      }, 500)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <motion.div
      className={cn("fixed right-4 z-50", `transition-all ease-in-out ${topTransitionClass}`)}
      style={{ top: `${dynamicTop}px` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Collapsible open={isChatbotExpanded} onOpenChange={setIsChatbotExpanded} className="w-[350px] max-w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className="rounded-full w-16 h-16 shadow-lg flex items-center justify-center"
            aria-label="Open chatbot"
          >
            <Bot className="h-8 w-8" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Card className="w-full shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
              <CardTitle className="text-lg font-semibold">AI Chatbot</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsChatbotExpanded(false)}>
                X
              </Button>
            </CardHeader>
            <CardContent className="p-4 h-[300px] flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-2 rounded-lg max-w-[80%]",
                        msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-gray-800 mr-auto",
                      )}
                    >
                      {msg.text}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="flex mt-4">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                  className="flex-1 mr-2"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  )
}
