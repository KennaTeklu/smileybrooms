"use client"

import { useState, useEffect } from "react"
import { useSupportBot } from "@/lib/support-bot-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ArrowLeft, MessageSquareText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n/client"

export function SupportBot() {
  const { isOpen, closeSupportBot, currentNode, navigateTo, goBack, supportHistory } = useSupportBot()
  const { t } = useTranslation()

  const [showRedirectMessage, setShowRedirectMessage] = useState(false)
  const [redirectingTo, setRedirectingTo] = useState("")

  useEffect(() => {
    if (currentNode.isEndpoint) {
      setShowRedirectMessage(true)
      setRedirectingTo(currentNode.title)

      // Simulate redirection after 3 seconds
      const timer = setTimeout(() => {
        setShowRedirectMessage(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [currentNode])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-auto overflow-hidden shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-white hover:bg-white/20"
            onClick={closeSupportBot}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-6 w-6" />
            <CardTitle>{t("support.title")}</CardTitle>
          </div>
          <CardDescription className="text-blue-100">{t("support.subtitle")}</CardDescription>
        </CardHeader>

        <AnimatePresence mode="wait">
          {showRedirectMessage ? (
            <motion.div
              key="redirecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="p-6 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">{t("support.connecting", { team: redirectingTo })}</h3>
                <p className="text-gray-500">{currentNode.endpointMessage || t("support.specialist")}</p>
              </CardContent>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{currentNode.title}</h3>
                {currentNode.message && <p className="text-gray-500 mb-4">{currentNode.message}</p>}

                <div className="space-y-3 mt-4">
                  {currentNode.options.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <button
                        className={cn(
                          "w-full text-left px-5 py-3 rounded-full transition-all",
                          "bg-gradient-to-r hover:shadow-md",
                          option.id === "root"
                            ? "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-dashed border-gray-300 dark:border-gray-600"
                            : "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/40 dark:hover:to-blue-800/40",
                        )}
                        onClick={() => navigateTo(option.id)}
                      >
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.description}</div>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>

        <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t p-3 flex justify-between">
          {supportHistory.length > 0 && (
            <Button variant="ghost" size="sm" onClick={goBack} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>
          )}
          <div className="text-xs text-gray-500 ml-auto">
            {t("support.id")}: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
