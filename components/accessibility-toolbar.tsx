"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Share2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface AccessibilityToolbarProps {
  className?: string
}

export function AccessibilityToolbar({ className }: AccessibilityToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(1)
  const [contrast, setContrast] = useState(false)
  const [grayscale, setGrayscale] = useState(false)
  const [invert, setInvert] = useState(false)
  const [showSharePanel, setShowSharePanel] = useState(false)

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <div className="flex items-center">
        <div className="flex flex-col gap-2">
          <motion.button
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "flex items-center justify-center p-3 bg-white dark:bg-gray-900",
              "rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open accessibility settings"
          >
            <Settings className="h-5 w-5" />
          </motion.button>

          <motion.button
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowSharePanel(!showSharePanel)}
            className={cn(
              "flex items-center justify-center p-3 bg-white dark:bg-gray-900",
              "rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Share page"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Accessibility Settings</DialogTitle>
              <DialogDescription>Customize the website to fit your needs.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="font-size" className="text-right">
                  Font Size
                </Label>
                <Slider
                  id="font-size"
                  defaultValue={[100]}
                  max={200}
                  min={50}
                  step={1}
                  onValueChange={(value) => setFontSize(value[0] / 100)}
                  className="col-span-3"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {showSharePanel && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute top-0 right-full mr-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-64"
          >
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Share Page</h3>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: document.title,
                      url: window.location.href,
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                  }
                  setShowSharePanel(false)
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Page
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  setShowSharePanel(false)
                }}
              >
                Copy Link
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
